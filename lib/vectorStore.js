import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { embeddings } from "./openai.js";
import fs from "fs";

const COLLECTION_NAME = "mydocs";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

/**
 * Ingest raw text into Chroma (chunks -> embeddings -> collection)
 */
export async function ingestText(rawText) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50
  });
  const docs = await splitter.createDocuments([rawText]);

  // Create (or add to) the collection
  return await Chroma.fromDocuments(docs, embeddings, {
    url: CHROMA_URL,
    collectionName: COLLECTION_NAME
  });
}

/**
 * Ingest a text file path into Chroma (convenience for dev)
 */
export async function ingestFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return ingestText(raw);
}

/**
 * Reconnect to an existing Chroma collection
 */
export async function getVectorStore() {
  return await Chroma.fromExistingCollection(embeddings, {
    url: CHROMA_URL,
    collectionName: COLLECTION_NAME
  });
}
