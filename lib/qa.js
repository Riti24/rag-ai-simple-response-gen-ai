import { RetrievalQAChain } from "langchain/chains";
import { llm } from "./openai.js";

/**
 * Ask a question using RetrievalQAChain over Chroma retriever
 */
export async function askQuestion(vectorStore, question) {
  const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
  const res = await chain.call({ query: question });
  return res.text;
}
