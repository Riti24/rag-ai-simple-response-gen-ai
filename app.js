import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";
import askRoute from "./routes/ask.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"] }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/upload", uploadRoute);
app.use("/ask", askRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
