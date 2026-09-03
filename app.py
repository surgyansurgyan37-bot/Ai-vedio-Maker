import os, uuid, re
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

app = FastAPI(title="AI Long Video Maker")

BASE = Path(__file__).parent

def make_project(script, duration, style, ratio):
    sentences = [s.strip() for s in re.split(r'[.!?।]+', script) if s.strip()]
    if not sentences:
        sentences = [script.strip()]
    count = max(6, min(60, int(duration) * 3))
    each = max(4, round(int(duration) * 60 / count))
    scenes = []
    for i in range(count):
        text = sentences[i % len(sentences)]
        scenes.append({
            "scene": i + 1,
            "duration_seconds": each,
            "narration": text,
            "visual_prompt": f"{style}, cinematic, realistic, detailed shot, {text}",
            "subtitle": text,
            "ratio": ratio
        })
    return {
        "status": "project_created",
        "id": uuid.uuid4().hex,
        "duration_minutes": int(duration),
        "style": style,
        "ratio": ratio,
        "scenes": scenes
    }

@app.get("/", response_class=HTMLResponse)
def home():
    return (BASE / "index.html").read_text(encoding="utf-8")

@app.get("/api/health")
def health():
    return {"ok": True, "service": "AI Long Video Maker"}

@app.post("/api/create")
async def create(payload: dict):
    script = (payload.get("script") or "").strip()
    if not script:
        return JSONResponse({"error": "पहले script लिखें।"}, status_code=400)
    return make_project(
        script,
        payload.get("duration", 5),
        payload.get("style", "Cinematic"),
        payload.get("ratio", "16:9")
    )

@app.post("/api/voice/{project_id}")
async def voice(project_id: str, payload: dict):
    # Voice is intentionally kept server-side; add OPENAI_API_KEY in Vercel later.
    if not os.environ.get("OPENAI_API_KEY"):
        return JSONResponse(
            {"error": "Voice के लिए Vercel Environment Variables में OPENAI_API_KEY जोड़ें।"},
            status_code=503
        )
    return JSONResponse({"error": "Voice endpoint तैयार है; API key सेट करने के बाद इसे enable किया जा सकता है."}, status_code=501)
