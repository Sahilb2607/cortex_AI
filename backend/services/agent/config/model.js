import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from "dotenv";

dotenv.config();
const grog = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});
const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
});
const deepseek = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens:8500
});
const vision = new ChatOpenRouter({
  model: "openai/gpt-4.1-mini",
  maxTokens:8500
});
export const getmodel = (agent) => {
  switch (agent) {
    case "coding":
      return deepseek;
    case "imageAnalyzer":
      return vision
    default:
      return grog;
  }
};
