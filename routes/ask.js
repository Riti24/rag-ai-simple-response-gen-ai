import { Router } from "express";
import { getVectorStore } from "../lib/vectorstore.js";
import { askQuestion } from "../lib/qa.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ ok: false, error: "Empty question" });
    }

    const vectorStore = await getVectorStore();
    const answer = await askQuestion(vectorStore, question);

    res.json({ ok: true, answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
