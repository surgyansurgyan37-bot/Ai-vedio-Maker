import os, json, re, uuid
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
from services import make_project, make_voice

app = FastAPI(title="AI Long Video Maker v2")
BASE = Path(__file__).parent
OUT = BASE / "output"
OUT.mkdir(exist_ok=True)

class Request(BaseModel):
    script: str
    duration: int = 5
    style: str = "Cinematic"
    ratio: str = "16:9"
    voice: str = "alloy"

@app.get("/", response_class=HTMLResponse)
def home():
    return (BASE / "index.html").read_text(encoding="utf-8")

@app.post("/api/create")
def create(req: Request):
    project = make_project(req.script, req.duration, req.style, req.ratio)
    project["id"] = uuid.uuid4().hex
    (OUT / f"{project['id']}.json").write_text(json.dumps(project, ensure_ascii=False, indent=2), encoding="utf-8")
    return project

@app.post("/api/voice/{project_id}")
def voice(project_id: str, req: Request):
    path = OUT / f"{project_id}.mp3"
    text = req.script
    make_voice(text, str(path), req.voice)
    return {"audio": f"/output/{path.name}"}

@app.get("/output/{name}")
def output(name: str):
    path = OUT / name
    return FileResponse(path)
