import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getMemory } from "../config/memory.js";
import { reductCredit } from "../utils/reductcredit.js";
import { getmodel } from "../config/model.js";
import { checkAgentLimit } from "../config/checkLimit.js";

export const ChatAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "chat");
    const llm = await getmodel("chat");
    const searchContext = state.searchResponse
      ? `
      Web Search Results:
      ${JSON.stringify(state.searchResponse)}
      Answer the user using only the above search results.
      `
      : "";

    const prompt = `You are CortexAI, an intelligent AI assistant.
    ${searchContext}
    If searchContext exists:
    -Use searchResponse to answer.
    -Do not mention internal tools.
    Rules:
    - For simple questions, greetings, and short queries, respond naturally in plain text.
    - For technical, educational, coding, or detailed topics, use clean Markdown.
    
    Formatting:
    - Use # for titles and ## for sections.
    - Leave a blank line after headings.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code.
    - Keep paragraphs short and readable.
    - Never write headings and content on the same line.
    - Never generate large walls of text.
    `;
    const history = await getMemory(state.conversationId);
    const memory = [new SystemMessage(prompt)];
    history.forEach((msg) => {
      if (msg.role == "user") {
        memory.push(new HumanMessage(msg.content));
      } else {
        memory.push(new AIMessage(msg.content));
      }
    });
    memory.push(new HumanMessage(state.prompt));

    console.log(memory);
    const response = await llm.invoke(memory);
    await reductCredit(state.userId, "chat");
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
  }
};
