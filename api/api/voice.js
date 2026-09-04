import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const audio = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      response_format: "mp3"
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Voice generation failed"
    });
  }
}
