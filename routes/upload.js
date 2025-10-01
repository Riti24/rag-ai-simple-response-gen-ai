import { Router } from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { ingestText } from "../lib/vectorStore.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: "No file uploaded" });

    const filePath = req.file.path;
    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath); // ✅ use uploaded file
      const data = await pdfParse(dataBuffer);
      text = data.text || "";
    } else {
      text = fs.readFileSync(filePath, "utf-8");
    }

    if (!text || !text.trim()) {
      try { fs.unlinkSync(filePath); } catch {}
      return res.status(400).json({ ok: false, error: "No extractable text" });
    }

    await ingestText(text);

    try { fs.unlinkSync(filePath); } catch {}
    res.json({ ok: true, message: "File ingested successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
