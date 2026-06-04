// FAXX IMPERIAL — Main App Controller v2.0

let soundOn = true;
let fxOn = true;
let logoClicks = 0;
let authMode = 'login';
let konami = [];
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq = 440, dur = 0.1, type = 'square') {
  if (!soundOn) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}

// Mouse trail
const dots = [];
document.addEventListener('mousemove', e => {
  if (!fxOn) return;
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  document.body.appendChild(dot);
  dots.push(dot);
  setTimeout(() => { dot.remove(); dots.shift(); }, 500);
});

// Konami code
document.addEventListener('keydown', e => {
  konami.push(e.key);
  if (konami.length > 10) konami.shift();
  if (konami.join(',') === KONAMI.join(',')) {
    document.body.classList.add('god-mode');
    showToast('GOD MODE ACTIVATED');
    beep(880, 0.3); beep(1100, 0.3); beep(1320, 0.5);
    confetti();
  }
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u') {
    e.preventDefault();
    toggleTerminal();
  }
});

// Logo easter eggs
function logoClick() {
  logoClicks++;
  beep(600 + logoClicks * 50, 0.08);
  if (logoClicks >= 5) {
    const logo = document.getElementById('heroLogo');
    if (logo) {
      logo.classList.add('spin');
      showToast('LOGO OVERLOAD');
      setTimeout(() => logo.classList.remove('spin'), 1000);
    }
    logoClicks = 0;
  }
}

function heroLogoClick() {
  const tag = document.getElementById('tagline');
  if (!tag) return;
  const phrases = [
    "No corporate chains. No banned accounts. Just raw code.",
    "Claude who? We don't know her.",
    "Made in China. Loved by Earth.",
    "Your 7th account starts here.",
    "Google fears this website.",
    "Universe Made On Earth",
    "GLORY TO CHINA 🇨🇳"
  ];
  tag.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  tag.style.letterSpacing = Math.random() * 8 + 'px';
  beep(440, 0.05); beep(554, 0.05); beep(659, 0.05);
}

// UI Toggles
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  if (panel) panel.classList.toggle('open');
  beep(330, 0.05);
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.classList.toggle('active');
  showToast(isDark ? 'LIGHT MODE (HERESY)' : 'DARK MODE (RETURN)');
  beep(isDark ? 880 : 220, 0.1);
}

function toggleSound() {
  soundOn = !soundOn;
  const toggle = document.getElementById('soundToggle');
  if (toggle) toggle.classList.toggle('active');
}

function toggleEffects() {
  fxOn = !fxOn;
  const toggle = document.getElementById('fxToggle');
  if (toggle) toggle.classList.toggle('active');
  showToast(fxOn ? 'CHAOS ENABLED' : 'CHAOS DISABLED');
}

function openAuth() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('active');
  beep(440, 0.1);
}

function closeAuth() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

function toggleAuthMode() {
  authMode = authMode === 'login' ? 'register' : 'login';
  const title = document.getElementById('authTitle');
  const btn = document.getElementById('authBtn');
  const footer = document.getElementById('authSwitch');

  if (title) title.textContent = authMode === 'login' ? 'Enter The Universe' : 'Create Identity';
  if (btn) btn.textContent = authMode === 'login' ? 'AUTHENTICATE' : 'INITIALIZE';
  if (footer) {
    footer.innerHTML = authMode === 'login'
      ? 'No account? <a onclick="toggleAuthMode()">Initialize new identity</a>'
      : 'Existing unit? <a onclick="toggleAuthMode()">Authenticate</a>';
  }
  beep(550, 0.08);
}

function handleAuth() {
  const pass = document.getElementById('authPass')?.value;
  if (!pass || pass.length < 4) {
    showToast('KEY TOO WEAK');
    beep(150, 0.3, 'sawtooth');
    return;
  }
  showToast(authMode === 'login' ? 'ACCESS GRANTED' : 'IDENTITY FORGED');
  beep(523, 0.1); beep(659, 0.1); beep(784, 0.2);
  setTimeout(closeAuth, 800);
}

function toggleTerminal() {
  const term = document.getElementById('terminal');
  if (!term) return;
  const isOpen = term.classList.toggle('open');
  if (isOpen) {
    const input = document.getElementById('termInput');
    if (input) input.focus();
    beep(880, 0.05);
  }
}

function selfDestruct() {
  const overlay = document.getElementById('destructOverlay');
  if (overlay) overlay.classList.add('active');
  beep(100, 0.5, 'sawtooth');
  setTimeout(() => beep(80, 0.5, 'sawtooth'), 200);
  setTimeout(() => beep(60, 1.0, 'sawtooth'), 400);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function footerSecret() {
  const credit = document.getElementById('kimiCredit');
  if (credit) credit.classList.toggle('visible');
  beep(1000, 0.05);
}

// Confetti
function confetti() {
  const fragment = document.createDocumentFragment();
  const elementsToAnimate = [];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.style.position = 'fixed';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-10px';
    c.style.width = '8px';
    c.style.height = '8px';
    c.style.background = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)];
    c.style.zIndex = 9999;
    c.style.pointerEvents = 'none';
    fragment.appendChild(c);
    const dur = 2 + Math.random() * 3;
    elementsToAnimate.push({ c, dur });
  }
  document.body.appendChild(fragment);
  for (const { c, dur } of elementsToAnimate) {
    c.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration: dur * 1000, easing: 'linear' });
    setTimeout(() => c.remove(), dur * 1000);
  }
}

// YouTube Connection (uses proxy)
async function connectYouTube() {
  const keyInput = document.getElementById('ytApiKey');
  const chInput = document.getElementById('ytChannel');
  const key = keyInput?.value.trim();
  const ch = chInput?.value.trim();

  if (!ch) {
    showToast('MISSING CHANNEL ID');
    beep(200, 0.2, 'sawtooth');
    return;
  }

  showToast('CONNECTING...');
  beep(440, 0.1); beep(554, 0.1); beep(659, 0.1);

  try {
    // Use our proxy (key is hidden in backend .env, but frontend can optionally send one for testing)
    const res = await fetch(`https://faxx.up.railway.app/api/youtube/stats?channel_id=${encodeURIComponent(ch)}`);
    const data = await res.json();

    if (data.error) {
      showToast(data.error === 'NO_KEY' ? 'SET YOUTUBE_API_KEY IN VERCEL ENV' : 'YOUTUBE API ERROR');
      // Fallback to mock data for demo
      showMockYouTube();
      return;
    }

    renderYouTubeData(data);
  } catch (err) {
    showToast('CONNECTION FAILED — SHOWING MOCK DATA');
    showMockYouTube();
  }
}

function showMockYouTube() {
  document.getElementById('ytStats').style.display = 'grid';
  document.getElementById('ytChartBox').style.display = 'block';
  animateNum('ytViews', 1248903);
  animateNum('ytSubs', 45200);
  animateNum('ytVideos', 342);
  animateNum('ytEngage', 8.4, '%');
  drawChart();
  showToast('LINK ESTABLISHED (DEMO MODE)');
  beep(784, 0.2);
}

function renderYouTubeData(data) {
  document.getElementById('ytStats').style.display = 'grid';
  document.getElementById('ytChartBox').style.display = 'block';
  animateNum('ytViews', data.stats.views);
  animateNum('ytSubs', data.stats.subscribers);
  animateNum('ytVideos', data.stats.videos);
  animateNum('ytEngage', 8.4, '%'); // Engagement not in basic API
  drawChart();
  showToast(`CONNECTED: ${data.channel.title}`);
  beep(784, 0.2);
}

function animateNum(id, target, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = target / 40;
  const iv = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(iv); }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 30);
}

function drawChart() {
  const canvas = document.getElementById('ytCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width, h = rect.height;
  const data = [45, 52, 38, 65, 78, 92, 88, 105, 120, 135, 128, 150];
  const max = Math.max(...data);
  const pad = 40;
  const bw = (w - pad * 2) / data.length;

  ctx.clearRect(0, 0, w, h);
  const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border').trim();
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (h - pad * 2) * (i / 4);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
  }

  data.forEach((val, i) => {
    const bh = (val / max) * (h - pad * 2);
    const x = pad + i * bw + bw * 0.2;
    const y = h - pad - bh;
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--fg').trim();
    ctx.fillRect(x, y, bw * 0.6, bh);
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border').trim();
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, bw * 0.6, bh);
  });

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--fg').trim();
  ctx.font = '12px Space Mono';
  ctx.fillText('VIEWS (LAST 12 MONTHS)', pad, pad - 10);
}

// Init everything on load
document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
  initTerminal();

  // Fix broken logo with fallback
  const heroLogo = document.getElementById('heroLogo');
  if (heroLogo) {
    heroLogo.onerror = function() {
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.id = 'logoFallback';
      fallback.textContent = 'FAXX IMPERIAL';
      fallback.style.cssText = 'font-size:clamp(40px,10vw,90px);font-weight:900;text-transform:uppercase;letter-spacing:-2px;margin-bottom:24px;filter:drop-shadow(6px 6px 0px var(--shadow));cursor:pointer;';
      fallback.onclick = heroLogoClick;
      this.parentNode.insertBefore(fallback, this);
    };
  }

  // Resume audio context on first interaction
  document.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });

  // Random glitch
  setInterval(() => {
    if (!fxOn) return;
    if (Math.random() > 0.95) {
      const t = document.getElementById('heroTitle');
      if (t) {
        t.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        setTimeout(() => t.style.transform = 'none', 100);
      }
    }
  }, 2000);

  setTimeout(() => showToast('WELCOME TO THE GRID v2.0'), 600);
});

window.addEventListener('resize', () => {
  const box = document.getElementById('ytChartBox');
  if (box && box.style.display !== 'none') drawChart();
});

// Expose globals
window.beep = beep;
window.showToast = showToast;
window.confetti = confetti;
window.selfDestruct = selfDestruct;
window.toggleTerminal = toggleTerminal;
window.toggleSettings = toggleSettings;
window.toggleTheme = toggleTheme;
window.toggleSound = toggleSound;
window.toggleEffects = toggleEffects;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.toggleAuthMode = toggleAuthMode;
window.handleAuth = handleAuth;
window.logoClick = logoClick;
window.heroLogoClick = heroLogoClick;
window.footerSecret = footerSecret;
window.connectYouTube = connectYouTube;
  
