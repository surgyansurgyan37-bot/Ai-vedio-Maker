# AI Long Video Maker v2

यह version script को scenes में बाँटता है और OpenAI API उपलब्ध होने पर AI narration + scene planning के लिए तैयार है।

## Setup
1. Python 3.10+ रखें।
2. `pip install -r requirements.txt`
3. `.env.example` को `.env` नाम दें और अपनी API key डालें।
4. `python app.py`
5. Browser: http://127.0.0.1:8000

## Important
API key को browser/frontend में कभी न डालें। केवल server-side `.env` में रखें।
यह prototype अभी generated video clips को किसी external video-generation service से automatically नहीं बनाता; उसके लिए provider API जोड़नी होगी।
