# FAXX IMPERIAL v2.0 — Universe Made On Earth

> **No corporate chains. No banned accounts. Just raw code.**

Built by **PRON33R**. Engineered with **Kimi K2.6**. Powered by Chinese AI.

---

## What Is This?

FAXX IMPERIAL is your personal AI command center. It includes:

- **FAXX Chatbot** — Routes between Kimi K2.6, DeepSeek V3, Stable Diffusion 3.5, Flux 2, Klein 2BT, MiniMax 2.7
- **YouTube Command Center** — Real-time analytics via proxy (your key stays hidden)
- **Universe Terminal v2.0** — API System Dashboard + GLM 5.1 Code Analyzer + Light Code Editor + Threat Monitor
- **Auth System** — Pre-configured for Clerk (optional)
- **Neo-Brutalist UI** — Black/white, interactive, Easter eggs, God Mode

---

## File Structure

```
faxx-imperial/
├── index.html              <- Main page (open this locally to test)
├── css/
│   └── style.css           <- All Neo-brutalist styles
├── js/
│   ├── chatbot.js          <- FAXX Chatbot engine (6 models)
│   ├── terminal.js         <- Universe Terminal (API dashboard + GLM 5.1 + Editor)
│   └── app.js              <- Main app logic (auth, YouTube, UI)
├── api/                    <- BACKEND PROXIES (secrets stay hidden here)
│   ├── credits.js          <- Check API credits for all providers
│   ├── glm-analyze.js      <- GLM 5.1 code analysis (secrets redacted)
│   └── youtube.js          <- YouTube Data API proxy
├── assets/
│   └── logo.png            <- YOUR 3475.png LOGO (rename and drop here)
├── .env.example            <- Template for secret keys
├── .gitignore              <- Hides .env from GitHub
├── package.json            <- Vercel config
├── vercel.json             <- Vercel routing rules
└── README.md               <- You are here
```

---

## Step-by-Step Setup (For Non-Coders)

### Step 1: Get Your Logo Working
1. Rename your `3475.png` to `logo.png`
2. Put it inside the `assets/` folder
3. Done. If missing, a text fallback shows automatically.

### Step 2: Create a GitHub Repo
1. Go to github.com -> Sign in
2. Click **New Repository**
3. Name it `faxx-imperial`
4. **DO NOT** check "Add a README" (you already have one)
5. Click **Create repository**

### Step 3: Upload Files to GitHub
**Option A (Easy):**
1. On your repo page, click **"uploading an existing file"**
2. Drag ALL files/folders from this project into the browser
3. Click **Commit changes**

**Option B (Terminal — if you have Git installed):**
```bash
cd faxx-imperial
git init
git add .
git commit -m "FAXX v2.0 initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/faxx-imperial.git
git push -u origin main
```

### Step 4: Deploy to Vercel (Free)
1. Go to vercel.com -> Sign up with GitHub
2. Click **Add New Project**
3. Import your `faxx-imperial` repo
4. Framework Preset: **Other**
5. Click **Deploy**
6. Wait 30 seconds. Your site is live.

### Step 5: Add Secret API Keys (CRITICAL)
**Never put keys in frontend code. Always use Vercel Environment Variables.**

1. In Vercel Dashboard, click your project
2. Go to **Settings** -> **Environment Variables**
3. Add each key from `.env.example`:

| Variable | What to paste |
|----------|---------------|
| `GLM_API_KEY` | Your GLM 5.1 key |
| `KIMI_API_KEY` | Your Moonshot AI key |
| `MINIMAX_API_KEY` | Your MiniMax key |
| `YOUTUBE_API_KEY` | Google Cloud -> YouTube Data API v3 key |
| `NVIDIA_API_KEY` | NVIDIA NGC key |
| `CLERK_SECRET_KEY` | Clerk Dashboard -> API Keys |
| `CLERK_PUBLISHABLE_KEY` | Clerk Dashboard -> API Keys |

4. Click **Save**
5. Go to **Deployments** -> Click **Redeploy**

---

## How to Use the Terminal (API Dashboard)

Open terminal with **Ctrl+Shift+U** or click **"Open Terminal"**.

### API Credit Commands
| Command | What it does |
|---------|--------------|
| `/kimi` | Check Kimi K2.6 credits & RPM |
| `/minimax` | Check MiniMax 2.7 credits |
| `/sd35` | Check Stable Diffusion 3.5 credits |
| `/flux` | Check Flux 2 credits |
| `/klein` | Check Klein 2BT credits |
| `/deepseek` | Check DeepSeek V3 credits |
| `/nvidia` | Check NVIDIA API credits |
| `/youtube` | Check YouTube Data API quota |
| `/clerk` | Check Clerk Auth status |
| `/status` | Check ALL APIs at once |

### GLM 5.1 Code Analyzer
| Command | What it does |
|---------|--------------|
| `/glm` | Activate GLM 5.1 analyzer mode |
| `/analyze` | Scan your current codebase |
| `/threats` | View captured errors & system threats |
| `/clearthreats` | Clear threat log |

**GLM 5.1 automatically:**
- Redacts API keys before analyzing
- Catches frontend/backend errors
- Suggests exact file fixes
- Runs in the backend (your code never leaks)

### Light Code Editor
| Command | What it does |
|---------|--------------|
| `/edit` | Open code editor |
| `/files` | List open files |
| `/open index.html` | Switch to a file |
| `/save` | Save to browser storage |
| `/close` | Exit editor |

---

## Security Rules (READ THIS)

1. **NEVER commit `.env`** — It's already in `.gitignore`, but double-check.
2. **NEVER paste API keys in frontend JS** — Always use `/api/` proxy files.
3. **GLM 5.1 redacts secrets** — But still, don't paste production keys in chat.
4. **Clerk Auth** — If added, user data is handled by Clerk's secure servers.

---

## Connecting Real APIs

### YouTube Analytics
1. Get API key from Google Cloud Console
2. Enable **YouTube Data API v3**
3. Add key to Vercel env vars as `YOUTUBE_API_KEY`
4. Paste your Channel ID (starts with `UC...`) in the site
5. Click **ESTABLISH LINK**

### GLM 5.1 Code Analyzer
1. Get key from OpenBigModel
2. Add to Vercel env vars as `GLM_API_KEY`
3. Terminal -> `/glm` -> `/analyze`

### MiniMax / Kimi / DeepSeek
1. Get keys from respective dashboards
2. Add to Vercel env vars
3. Terminal -> `/status` to verify

---

## Easter Eggs

- **Konami Code**: up up down down left right left right B A -> God Mode
- **Ctrl+Shift+U**: Open Universe Terminal
- **Click logo 5x**: Logo overload spin
- **Click hero logo**: Tagline mutates
- **Settings -> Self Destruct**: Red screen of chaos
- **Click footer logo**: Reveals Kimi credit

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Logo not showing | Rename your PNG to `logo.png`, put in `assets/` |
| APIs show "NO_KEY" | Add keys to Vercel Environment Variables, then redeploy |
| Chatbot not responding | Check browser console (F12) -> Network tab |
| Terminal commands fail | Ensure you're deployed on Vercel (not just opening HTML file) |
| CORS errors | The `/api/` proxies handle this. Don't call APIs directly from frontend. |

---

## Legal

**Universe Made On Earth**
**All Rights Reserved. Trademark PRON33R.**
**pron33rbusiness@gmail.com**

Crafted with the help of **Kimi K2.6**.

---

Glory to China
