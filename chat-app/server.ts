import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Mistral } from "@mistralai/mistralai";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const MODEL = "mistral-small-latest";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const app = express();
app.use(express.json());
app.use(express.static(path.join(dirname, "public")));

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

app.post("/api/chat", async (req, res) => {
  if (!process.env.MISTRAL_API_KEY) {
    res.status(500).json({ error: "MISTRAL_API_KEY ist auf dem Server nicht gesetzt." });
    return;
  }

  const raw: unknown = (req.body as { messages?: unknown } | undefined)?.messages;
  const list = Array.isArray(raw) ? raw : [];
  const messages = list
    .filter(
      (m): m is ChatMessage =>
        m != null &&
        (m.role === "user" || m.role === "assistant" || m.role === "system") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-50);

  if (messages.length === 0) {
    res.status(400).json({ error: "Keine gueltigen Nachrichten empfangen." });
    return;
  }

  try {
    const response = await client.chat.complete({
      model: MODEL,
      messages,
    });
    const content = response.choices?.[0]?.message?.content ?? "";
    res.json({ reply: typeof content === "string" ? content : JSON.stringify(content) });
  } catch (err) {
    console.error("Mistral API error:", err);
    res.status(502).json({ error: "Die Mistral-API hat einen Fehler zurueckgegeben." });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "127.0.0.1", () => {
  console.log(`Server laeuft auf http://localhost:${port}`);
});
