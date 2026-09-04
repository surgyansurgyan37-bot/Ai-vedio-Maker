# AI Video Maker — Clean Vercel Version

This project is intentionally arranged for Vercel:

- `index.html` — website home page
- `api/script.js` — script API
- `api/voice.js` — text-to-speech API
- `package.json` — OpenAI SDK dependency

## Vercel Environment Variables

Add these in Vercel:

- `OPENAI_API_KEY` — your private API key
- `OPENAI_MODEL` — a text model available to your OpenAI account
- Optional: `OPENAI_TTS_MODEL`
- Optional: `OPENAI_TTS_VOICE`

Do not put API keys in `index.html`.

Without an API key, the website still opens and the script button uses a demo script. Browser Voice Preview can also be used.

Final server-side MP4 rendering and AI image/video generation are not included in this first clean deployment package.
