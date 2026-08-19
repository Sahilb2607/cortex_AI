import { getmodel } from "../config/model.js";
import { CreatePdf } from "../utils/createpdf.js";
import { getFroms3 } from "../utils/getFroms3.js";
import { uploadTos3 } from "../utils/UploadTos3.js";
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const PDFAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId,"pdf")
    const llm = await getmodel("pdf");
    const prompt = `
  You are an expert document writer.
  
  Return ONLY valid JSON.
  
  Do NOT return markdown.
  
  Do NOT return explanations.
  
  Structure:
  
  {
  "title":"",
  "subtitle":"",
  "sections":[
  {
  "heading":"",
  "points":[]
  }
  ]
  }
  
  Generate 4-8 sections.
  
  Each section should have 3-6 concise bullet points.
  
  Topic:
  
  ${state.prompt}
  `;
    const result = await llm.invoke(prompt);
    await reductCredit(state.userId,"pdf")
    const response = JSON.parse(result.content);
    const buffer = await CreatePdf(response);
    const fileName = `pdf-${Date.now()}.pdf`;
    await uploadTos3(fileName, buffer, "application/pdf");

    const URI = await getFroms3(fileName, 60 * 10);
    return {
      ...state,
      AImessage: `# PDF Generated

**${response.title}**

[Download PDF](${URI})

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
