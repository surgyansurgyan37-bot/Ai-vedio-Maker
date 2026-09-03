import os, re, json
from pathlib import Path

def make_project(script, duration, style, ratio):
    sentences = [s.strip() for s in re.split(r'[.!?।]+', script) if s.strip()]
    if not sentences:
        sentences = ["अपनी कहानी का पहला दृश्य।"]
    target = max(6, min(60, duration * 3))
    scenes = []
    for i in range(target):
        narration = sentences[i % len(sentences)]
        scenes.append({
            "scene": i + 1,
            "duration_seconds": max(4, round(duration * 60 / target)),
            "narration": narration,
            "visual_prompt": f"{style}, cinematic, realistic, detailed, {narration}",
            "subtitle": narration,
            "ratio": ratio
        })
    return {"status":"project_created","duration_minutes":duration,"style":style,"ratio":ratio,"scenes":scenes}

def make_voice(text, output_path, voice):
    from openai import OpenAI
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    if not os.environ.get("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY .env में सेट करें")
    with client.audio.speech.with_streaming_response.create(
        model="gpt-4o-mini-tts",
        voice=voice,
        input=text,
        response_format="mp3"
    ) as response:
        response.stream_to_file(output_path)
