import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getmodel } from "../config/model.js";
import fs from "fs/promises";
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const imageAnalyzer = async (state) => {
  try {
    await checkAgentLimit(state.userId, "image");
    const llm = await getmodel("imageAnalyzer");
    const bufferimage = await fs.readFile(state.file.path);
    const base64Image = bufferimage.toString("base64");
    const messages = [
      new SystemMessage(
        `You are CortexAI image analyzer Agent.

Rules:
- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate`,
      ),

      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "analyze the image",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Image}`,
              // see it tells whenever image_url comes then put this in url
              // but how it will understand that this is a image base 64 image
              // so we pass all this things as data so llm can understand
            },
          },
        ],
      }),
    ];
    const response = await llm.invoke(messages);
    await reductCredit(state.userId, "vision");
    return {
      ...state,
      AImessage: response.content,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      AImessage: error?.data?.message || "Failed to generate response!!!..",
    };
  } finally {
    await fs.unlink(state.file.path);
  }
};
