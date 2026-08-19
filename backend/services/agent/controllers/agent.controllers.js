import { addMessages } from "../config/memory.js";
import { graph } from "../graph/graph.js";
import axios from "axios";
export const agent = async (req, res,next) => {
  try {
    
    const { prompt,conversationId,agent} = req.body;
    const file=req.file
    const userId=req.headers['x-forwarded-for']
    await axios.post(`${process.env.CHAT_URI}/messages`, {
      conversationId,
      role: "user",
      content: prompt,
    });
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      userId,
      file
    });
   

    await addMessages(conversationId, "user", prompt);
    await addMessages(conversationId, "assistant", result.AImessage);
    await axios.post(`${process.env.CHAT_URI}/messages`, {
      conversationId,
      role: "assistant",
      content: result?.AImessage,
      images:result?.images,
      Artifacts:result?.Artifacts
    });

    return res.status(200).json({answer:result?.AImessage,images:result?.images,Artifacts:result?.Artifacts});
  } catch (error) {
   next(error)
  //  for global error
  // means to handle error for this entire service
  }
};
