export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed"
    });
  }

  try {
    const { topic, duration = 60, language = "Hindi" } = req.body || {};

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required"
      });
    }

    const prompt = `
Create a complete AI video script.

Topic: ${topic}
Duration: ${duration} seconds
Language: ${language}

Give:
1. Strong hook
2. Voice-over narration
3. Scene-by-scene visual prompts
4. On-screen text
5. Ending/CTA

Make it suitable for YouTube Shorts and Instagram Reels.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    const result =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({
      success: true,
      script: result
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
