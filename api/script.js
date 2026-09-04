import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, language = "Hindi", duration = "1 minute" } = req.body || {};

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: `Create a clear video script about "${topic}".
Language: ${language}
Duration: ${duration}

Include:
1. Hook
2. Main narration
3. Scene suggestions
4. Ending`
    });

    return res.status(200).json({
      script: response.output_text
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Script generation failed"
    });
  }
}
