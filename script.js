import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { topic, language = "Hindi", duration = "1 minute" } = req.body || {};
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  if (!process.env.OPENAI_API_KEY) {
    const demo = language.toLowerCase().startsWith("hindi")
      ? `वीडियो विषय: ${topic}\n\nनमस्कार दोस्तों! आज हम बात करेंगे ${topic} के बारे में।\n\nइस वीडियो में हम आसान भाषा में मुख्य बातें समझेंगे, जरूरी कदम देखेंगे और अंत में कुछ उपयोगी सुझाव साझा करेंगे।\n\nध्यान रखें कि किसी भी फैसले से पहले अपनी स्थिति के अनुसार सही जानकारी जरूर जाँचें।\n\nअगर यह जानकारी उपयोगी लगी हो तो वीडियो को शेयर करें और ऐसे ही नए वीडियो के लिए जुड़े रहें।`
      : `Video topic: ${topic}\n\nHello everyone! Today we will talk about ${topic}.\n\nIn this video, we will explain the key ideas in simple language, look at practical steps, and finish with useful tips.\n\nAlways verify important information for your own situation.\n\nIf you found this useful, share the video and follow for more.`;
    return res.status(200).json({ script: demo, demo: true });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL;
    if (!model) return res.status(500).json({ error: "Set OPENAI_MODEL in Vercel Environment Variables." });

    const response = await client.responses.create({
      model,
      input: `Create a clear, engaging video script.\nTopic: ${topic}\nLanguage: ${language}\nTarget duration: ${duration}\nUse natural spoken language and useful structure.`
    });
    return res.status(200).json({ script: response.output_text || "" });
  } catch (e) {
    return res.status(500).json({ error: e.message || "AI request failed" });
  }
}