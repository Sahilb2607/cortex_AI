import { StateGraph } from "@langchain/langgraph";
import { RouterAgent } from "./router.js";
import { ChatAgent } from "../agents/chat.agents.js";
import { CodingAgent } from "../agents/coding.agents.js";
import { PDFAgent } from "../agents/pdf.agents.js";
import { PPTAgent } from "../agents/ppt.agents.js";
import { SearchAgent } from "../agents/search.agents.js";
import { VisionAgent } from "../agents/visions.agents.js";
import { State } from "./state.js";
import { pdfRag } from "../agents/pdfRag.agents.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agents.js";
const workflow = new StateGraph(State);

workflow.addNode("router", RouterAgent);
workflow.addNode("chat", ChatAgent);
workflow.addNode("coding", CodingAgent);
workflow.addNode("pdf", PDFAgent);
workflow.addNode("ppt", PPTAgent);
workflow.addNode("search", SearchAgent);
workflow.addNode("vision", VisionAgent);
workflow.addNode("pdfRag", pdfRag);
workflow.addNode("imageAnalyzer", imageAnalyzer);

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
      case "coding":
        return "coding";
      case "pdf":
        return "pdf";
      case "ppt":
        return "ppt";
      case "search":
        return "search";
      case "vision":
        return "vision";
      case "pdfRag":
        return "pdfRag";
      case "imageAnalyzer":
        return "imageAnalyzer";
      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    search: "search",
    vision: "vision",
    pdfRag:"pdfRag",
    imageAnalyzer:"imageAnalyzer"
  },
);
workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("vision", "__end__");
workflow.addEdge("pdfRag", "__end__");
workflow.addEdge("imageAnalyzer", "__end__");

export const graph = workflow.compile();
