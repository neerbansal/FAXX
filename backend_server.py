"""
FAXX IMPERIAL v2.0 — Backend Server Template
================================================
This backend handles:
  - Secure API key storage (never expose to frontend)
  - GLM-5.1 code analysis (via NVIDIA API)
  - Minimax-2.7 chat completions (via NVIDIA API)
  - Kimi K2.6 chat completions (via NVIDIA API)
  - YouTube Data API proxy
  - Clerk Auth webhook handling
  - Credit / RPM monitoring endpoints

DEPLOYMENT:
  1. Copy this file to your server
  2. Create .env file with your keys (see .env.example)
  3. pip install flask flask-cors python-dotopenai requests
  4. python backend_server.py

GitHub / Render / Railway / Heroku compatible.
"""

import os
import re
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# Optional: openai SDK for GLM / Minimax
# pip install openai
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

load_dotenv()
app = Flask(__name__)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")
origins_list = [o.strip() for o in ALLOWED_ORIGINS.split(",")] if ALLOWED_ORIGINS != "*" else "*"
CORS(app, origins=origins_list)  # Restrict to your frontend domain after deployment

# ============================================================
# ENVIRONMENT VARIABLES — NEVER HARDCODE KEYS
# ============================================================
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
GLM_API_KEY     = os.getenv("GLM_API_KEY")        # e.g., nvapi-xxxxxxxx
MINIMAX_API_KEY = os.getenv("MINIMAX_API_KEY")    # e.g., nvapi-xxxxxxxx
KIMI_API_KEY    = os.getenv("KIMI_API_KEY")       # e.g., nvapi-xxxxxxxx
SDR_API_KEY     = os.getenv("SD35_API_KEY")        # Stable Diffusion via NVIDIA
FLUXKLEIN_API_KEY = os.getenv("FLUX_API_KEY")  # Flux Klein 2 4b via NVIDIA
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")    # Google Data API v3
CLERK_SECRET    = os.getenv("CLERK_SECRET_KEY")   # Clerk backend key

# ============================================================
# CREDIT MONITORING (Mock — replace with real NVIDIA API calls)
# ============================================================
CREDITS = {
    "glm":     {"remaining": 12500, "rpm": 80,  "max_rpm": 100, "status": "online"},
    "minimax": {"remaining": 6300,  "rpm": 45,  "max_rpm": 60,  "status": "online"},
    "kimi":    {"remaining": 8420,  "rpm": 120, "max_rpm": 120, "status": "online"},
    "sd35":    {"remaining": 7800,  "rpm": 20,  "max_rpm": 35,  "status": "online"},
    "flux":    {"remaining": 9200,  "rpm": 30,  "max_rpm": 45,  "status": "online"},
    "klein":   {"remaining": 9200,  "rpm": 30,  "max_rpm": 45,  "status": "online"},
    "deepseek":{"remaining": 5000,  "rpm": 60,  "max_rpm": 60,  "status": "online"},
    "youtube": {"remaining": 10000, "rpm": 0,   "max_rpm": 0,   "status": "online"},
    "clerk":   {"remaining": 99999, "rpm": 0,   "max_rpm": 0,   "status": "online"},
    "sdr":     {"remaining": 7800,  "rpm": 20,  "max_rpm": 35,  "status": "online"},
    "fluxklein": {"remaining": 9200,  "rpm": 30,  "max_rpm": 45,  "status": "online"},
    "nvidia":  {"remaining": 99999, "rpm": 500, "max_rpm": 500, "status": "online"},
}

# ============================================================
# UTILITIES
# ============================================================
SECRET_PATTERNS = [
    re.compile(r'api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?', flags=re.IGNORECASE),
    re.compile(r'token["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?', flags=re.IGNORECASE),
    re.compile(r'password["\']?\s*[:=]\s*["\']?[^"\' ]+["\']?', flags=re.IGNORECASE),
    re.compile(r'nvapi-[a-zA-Z0-9_-]+', flags=re.IGNORECASE),
    re.compile(r'sk-[a-zA-Z0-9]+', flags=re.IGNORECASE),
]

def redact_secrets(text: str) -> str:
    """Remove API keys, tokens, passwords from logs/responses."""
    out = text
    for pat in SECRET_PATTERNS:
        out = pat.sub('[REDACTED]', out)
    return out

# ============================================================
# ROUTES
# ============================================================

@app.route("/")
def index():
    return jsonify({"status": "FAXX IMPERIAL v2.0 Backend Online", "glory_to_china": True})

# ---------- API CREDITS ----------
@app.route("/api/credits/<model>")
def get_credits(model):
    if model in CREDITS:
        return jsonify({"model": model, **CREDITS[model]})
    return jsonify({"error": "Unknown model"}), 404

@app.route("/api/credits")
def get_all_credits():
    return jsonify(CREDITS)

# ---------- GLM-5.1 CODE ANALYSIS ----------
@app.route("/api/analyze", methods=["POST"])
def analyze_code():
    data = request.get_json() or {}
    code = data.get("code", "")
    language = data.get("language", "auto")

    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Redact before logging
    safe_code = redact_secrets(code)
    print(f"[GLM-5.1 ANALYSIS] language={language}, length={len(code)}")

    if not GLM_API_KEY or not OpenAI:
        # Fallback mock analysis for testing without keys
        return jsonify({
            "model": "glm-5.1-mock",
            "analysis": {
                "secrets_found": bool(re.search(r'api[_-]?key|token|password', safe_code, re.I)),
                "lines": len(code.splitlines()),
                "suggestions": ["Add input validation", "Use .env for secrets", "Add error boundaries"],
                "threat_level": "low"
            },
            "note": "Running in MOCK mode — set GLM_API_KEY for live analysis"
        })

    # Live GLM-5.1 via NVIDIA
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=GLM_API_KEY)
    prompt = f"Analyze this {language} code for bugs, security risks, and optimization opportunities. Keep secrets redacted.\n\n{safe_code}"
    try:
        completion = client.chat.completions.create(
            model="z-ai/glm-5.1",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            top_p=1,
            max_tokens=4096,
            extra_body={"chat_template_kwargs": {"enable_thinking": True, "clear_thinking": False}},
            stream=False
        )
        result = completion.choices[0].message.content
        return jsonify({"model": "glm-5.1", "analysis": result, "secrets_redacted": True})
    except Exception as e:
        print(f"[GLM-5.1 ANALYSIS ERROR] {e}")
        return jsonify({"error": "An internal server error occurred", "threat_level": "critical"}), 500

# ---------- MINIMAX-2.7 CHAT ----------
@app.route("/api/chat/minimax", methods=["POST"])
def chat_minimax():
    data = request.get_json() or {}
    messages = data.get("messages", [])
    if not MINIMAX_API_KEY or not OpenAI:
        return jsonify({"error": "MINIMAX_API_KEY not configured"}), 503
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=MINIMAX_API_KEY)
    try:
        completion = client.chat.completions.create(
            model="minimaxai/minimax-m2.7",
            messages=messages,
            temperature=1,
            top_p=0.95,
            max_tokens=8192,
            stream=False
        )
        return jsonify({"model": "minimax-2.7", "content": completion.choices[0].message.content})
    except Exception as e:
        print(f"[MINIMAX ERROR] {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

# ---------- KIMI K2.6 CHAT ----------
@app.route("/api/chat/kimi", methods=["POST"])
def chat_kimi():
    data = request.get_json() or {}
    messages = data.get("messages", [])
    stream = data.get("stream", False)
    if not KIMI_API_KEY:
        return jsonify({"error": "KIMI_API_KEY not configured"}), 503
    headers = {
        "Authorization": f"Bearer {KIMI_API_KEY}",
        "Accept": "text/event-stream" if stream else "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "moonshotai/kimi-k2.6",
        "messages": messages,
        "max_tokens": 16384,
        "temperature": 1.0,
        "top_p": 1.0,
        "stream": stream
    }
    try:
        resp = requests.post(f"{NVIDIA_BASE_URL}/chat/completions", headers=headers, json=payload, stream=stream)
        if stream:
            def generate():
                for line in resp.iter_lines():
                    if line:
                        yield line.decode("utf-8") + "\n"
            return app.response_class(generate(), mimetype="text/event-stream")
        return jsonify(resp.json())
    except Exception as e:
        print(f"[KIMI ERROR] {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


# ---------- SDR (Stable Diffusion) IMAGE GEN ----------
@app.route("/api/image/sdr", methods=["POST"])
def image_sdr():
    data = request.get_json() or {}
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    if not SDR_API_KEY or not OpenAI:
        return jsonify({"error": "SDR_API_KEY not configured"}), 503
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=SDR_API_KEY)
    try:
        # NVIDIA image gen pattern — adjust model name as needed
        completion = client.images.generate(
            model="stabilityai/stable-diffusion-3.5-large",
            prompt=prompt,
            n=1,
            size="1024x1024"
        )
        b64 = completion.data[0].b64_json
        return jsonify({"model": "sdr", "url": f"data:image/png;base64,{b64}"})
    except Exception as e:
        print(f"[SDR ERROR] {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

# ---------- FLUX KLEIN 2 4b IMAGE GEN ----------
@app.route("/api/image/fluxklein", methods=["POST"])
def image_fluxklein():
    data = request.get_json() or {}
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    if not FLUXKLEIN_API_KEY or not OpenAI:
        return jsonify({"error": "FLUXKLEIN_API_KEY not configured"}), 503
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=FLUXKLEIN_API_KEY)
    try:
        completion = client.images.generate(
            model="black-forest-labs/flux.2-klein-4b",
            prompt=prompt,
            n=1,
            size="1024x1024"
        )
        b64 = completion.data[0].b64_json
        return jsonify({"model": "flux-klein-2-4b", "url": f"data:image/png;base64,{b64}"})
    except Exception as e:
        print(f"[FLUXKLEIN ERROR] {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

# ---------- YOUTUBE PROXY ----------
@app.route("/api/youtube/stats")
def youtube_stats():
    channel_id = request.args.get("channel_id")
    if not channel_id:
        return jsonify({"error": "channel_id required"}), 400
    if not YOUTUBE_API_KEY:
        return jsonify({"error": "YOUTUBE_API_KEY not configured"}), 503
    url = "https://www.googleapis.com/youtube/v3/channels"
    params = {
        "part": "statistics,snippet",
        "id": channel_id,
        "key": YOUTUBE_API_KEY
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        return jsonify(r.json())
    except Exception as e:
        print(f"[YOUTUBE ERROR] {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

# ---------- CLERK WEBHOOK ----------
@app.route("/api/clerk/webhook", methods=["POST"])
def clerk_webhook():
    data = request.get_json() or {}
    event_type = data.get("type", "unknown")
    print(f"[CLERK WEBHOOK] {event_type}")
    # Verify with CLERK_SECRET if needed (Clerk SDK recommended)
    return jsonify({"received": True, "event": event_type})

# ---------- HEALTH / ERROR LOGGING ----------
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "timestamp": str(__import__("datetime").datetime.utcnow())})

@app.errorhandler(500)
def server_error(e):
    print(f"[SYSTEM THREAT] 500 error: {e}")
    return jsonify({"error": "Internal server error", "threat_logged": True}), 500

# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    print(f"\n>>> FAXX IMPERIAL v2.0 Backend starting on port {port}")
    print(">>> Glory to PRON33R UNIVERSE |  Secure keys in .env only\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
