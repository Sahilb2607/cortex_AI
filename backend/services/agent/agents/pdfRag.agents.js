import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectordb.js";
import { getmodel } from "../config/model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const pdfRag = async (state) => {
  try {
    await checkAgentLimit(state.userId,"pdf")
    const buffer = fs.readFileSync(state.file.path);
    const pdf = new PDFParse({ data: buffer });
    const result = await pdf.getText();
    const text = result.text;
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.createDocuments([text]);
    // it divides the text into chunks also it creates its document
    const collectionName = `pdf-${Date.now()}`;
    const store = await vectorStore(docs, collectionName);
    // store isn’t literally the collection itself, but it’s the object/instance that represents the connection to that collection in Qdrant.
    // now you can do many things w.r.t this collection like similarity search
    const revelantdocs = await store.similaritySearch(state.prompt, 5);
    const context = revelantdocs.map((e) => e.pageContent).join("\n\n");
    const llm = await getmodel("pdfRag");
    const messages = [
      new SystemMessage(`You are CortexAI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply:
"I couldn't find this information in the uploaded PDF."
- Use Markdown formatting.`),
new HumanMessage(`
    Context:${context}

    Question:${state.prompt}
    `)
    ];
    const response = await llm.invoke(messages);
    await reductCredit(state.userId,"pdf")
    return {
        ...state,
        AImessage:response.content
    }
  } catch (error) {
    console.log(error);
    return {
      ...state,
      AImessage: error?.data?.message || "Failed to generate response!!!..",
    };
  }
  finally{
    fs.unlinkSync(state.file.path)
  }
};
