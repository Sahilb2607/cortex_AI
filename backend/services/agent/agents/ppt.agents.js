import { getmodel } from "../config/model.js";
import { createPPT } from "../utils/createPPT.js";
import { getFroms3 } from "../utils/getFroms3.js";
import { uploadTos3 } from "../utils/UploadTos3.js";
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const PPTAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId,"ppt")
    const llm = await getmodel("ppt");
    const prompt = `
    You are a professional presentation designer.
    
    Return ONLY valid JSON.
    
    Format:
    
    {
    "title": "",
    "subtitle": "",
    "slides": [
      {
        "title": "",
        "points": [
          "",
          "",
          "",
          "",
          ""
        ]
      }
    ]
    }
    
    Rules:
    
    - Generate exactly 6 content slides.
    - Each slide should have 4-6 concise bullet points.
    - No markdown.
    - No explanation.
    - No code block.
    - Return ONLY JSON.
    
    Topic:
    
    ${state.prompt}
    `;
    const result = await llm.invoke(prompt);
    const data = JSON.parse(result.content);
    const ppt = await createPPT(data);
    const buffer = await ppt.write({ outputType: "nodebuffer" });
    await reductCredit(state.userId,"ppt")
    const fileName = `ppt-${Date.now()}.pptx`;
    await uploadTos3(
      fileName,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const URI = await getFroms3(fileName, 60 * 10);
    return {
      ...state,
      AImessage: `
# ✅ Presentation Generated
    
**${data.title}**
    
📥 [Download PPT](${URI})
    
_Link expires in 10 minutes._`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      AImessage: error?.data?.message || "Failed to generate response!!!..",
    };
  }
};
