import { getmodel } from "../config/model.js";
import axios from "axios";
import { uploadTos3 } from "../utils/UploadTos3.js";
import { getFroms3 } from "../utils/getFroms3.js";
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const VisionAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "vision");
    const llm = await getmodel("vision");
    const prompt = `You are an elite AI image prompt engineer.
    
            Convert the user request into a highly detailed image generation prompt.
    
            Requirements:
    
            - Cinematic lighting
            - Professional composition
            - Ultra realistic
            - High detail
            - Beautiful color palette
            - Sharp focus
            - 8K quality
            - Photorealistic
            - Depth of field
            - Professional photography
            - Stunning visuals
    
            Return only the image prompt.
    
            User Request:
            ${state.prompt}
            `;
    const result = await llm.invoke(prompt);
    const res = result.content.trim();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(res)}`;
    await reductCredit(state.userId, "vision");
    const arraybuff = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(arraybuff.data);
    const fileName = `img-${Date.now()}.png`;
    await uploadTos3(fileName, buffer, "image/png");
    const URI = await getFroms3(fileName, 10 * 60);

    return {
      ...state,
      AImessage: `🖼️ Image Generated Successfully

![Generated Image](${URI})

[Download Image](${URI})

⏳ Link expires in 10 minutes.`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      AImessage: error?.data?.message || "Failed to generate response!!!..",
    };
  }
};
