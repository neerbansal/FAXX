// FAXX IMPERIAL — Chatbot Engine v2.0
// Models: Kimi K2.6, DeepSeek V3, Stable Diffusion 3.5, Flux 2, Klein 2BT, MiniMax 2.7
// NOTE: GLM 5.1 is EXCLUSIVE to Terminal Code Analyzer (as requested)

const CHAT_MODELS = [
  { id: 'kimi', name: 'Kimi K2.6', tag: 'KIMI K2.6', desc: 'Long context king. Best for coding & reasoning.', region: '🇨🇳' },
  { id: 'deepseek', name: 'DeepSeek V3', tag: 'DEEPSEEK V3', desc: 'Math & logic beast. Open weights.', region: '🇨🇳' },
  { id: 'sd35', name: 'SD 3.5 Large', tag: 'SD 3.5 L', desc: 'Image generation. Photorealistic output.', region: '🌍' },
  { id: 'flux', name: 'Flux 2', tag: 'FLUX 2', desc: 'High fidelity images. Fast inference.', region: '🌍' },
  { id: 'klein', name: 'Klein 2BT', tag: 'KLEIN 2BT', desc: 'Balanced multimodal. Text + vision.', region: '🌍' },
  { id: 'minimax', name: 'MiniMax 2.7', tag: 'MINIMAX 2.7', desc: 'Speech + text. Great for agents.', region: '🇨🇳' }
];

let activeModel = CHAT_MODELS[0];

function initChatbot() {
  renderModelTags();
  addBotMessage(
    `Welcome to the grid, operator. I am your coding interface.\n\n` +
    `Active engine: <strong>${activeModel.name}</strong> ${activeModel.region}\n` +
    `${activeModel.desc}\n\n` +
    `Ask me anything. I will tell you <em>what</em> to code and <em>where</em> to put it. ` +
    `No vague corporate speak. Just raw instructions.\n\n` +
    `Try asking: <code style="display:inline;padding:2px 6px;font-size:12px;">"How do I build a login form in HTML?"</code>`
  );
}

function renderModelTags() {
  const container = document.getElementById('modelTags');
  if (!container) return;
  container.innerHTML = CHAT_MODELS.map(m => 
    `<span class="model-tag ${m.id === activeModel.id ? 'active' : ''}" data-id="${m.id}" onclick="switchChatModel('${m.id}')">${m.tag}</span>`
  ).join('');
}

function switchChatModel(id) {
  const model = CHAT_MODELS.find(m => m.id === id);
  if (!model) return;
  activeModel = model;
  renderModelTags();
  showToast(`ROUTING TO ${model.name.toUpperCase()} ${model.region}`);
  beep(660, 0.08);

  // Update status display
  const statusEl = document.getElementById('chatStatus');
  if (statusEl) {
    statusEl.innerHTML = `<strong>ENGINE:</strong> ${model.name} ${model.region}<br><strong>MODE:</strong> ${model.id === 'sd35' || model.id === 'flux' ? 'IMAGE_GEN' : 'TEXT_COMPLETION'}`;
  }
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';
  beep(440, 0.05);

  // Show thinking skeleton
  const thinkId = addThinkingMessage();

  // Simulate network delay then respond
  setTimeout(() => {
    removeMessage(thinkId);
    const response = generateChatResponse(text, activeModel.id);
    addBotMessage(response, activeModel.name);
    beep(330, 0.08); beep(440, 0.1);
  }, 800 + Math.random() * 600);
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `<strong>YOU</strong><br>${escapeHtml(text)}`;
  msgs.appendChild(div);
  scrollChat();
}

function addBotMessage(html, modelName = 'FAXX SYSTEM') {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `<strong>${modelName}</strong><br><br>${html}`;
  msgs.appendChild(div);
  scrollChat();
}

function addThinkingMessage() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'think-' + Date.now();
  div.innerHTML = `<strong>${activeModel.name}</strong><br><br><span class="skeleton" style="display:inline-block;width:140px;height:14px;"></span>`;
  msgs.appendChild(div);
  scrollChat();
  return div.id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function scrollChat() {
  const msgs = document.getElementById('chatMessages');
  msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function generateChatResponse(text, modelId) {
  const t = text.toLowerCase();

  // Image generation models have different responses
  if (modelId === 'sd35' || modelId === 'flux') {
    if (t.includes('image') || t.includes('picture') || t.includes('generate') || t.includes('draw')) {
      return `🎨 IMAGE GENERATION MODE\n═══════════════════════\n\nTo generate images via API:\n\n1. <strong>Frontend:</strong> Send POST to <code>/api/generate-image</code> with prompt.\n2. <strong>Backend:</strong> Proxy to ${activeModel.name} API with your key.\n3. <strong>Response:</strong> Returns image URL or base64.\n\n<code style="margin-top:8px;display:block;">fetch('/api/generate-image', {\n  method: 'POST',\n  body: JSON.stringify({ prompt: 'neo brutalist cat' })\n})</code>\n\n⚠️ Never call image APIs directly from frontend — always use the proxy to hide keys.`;
    }
    return `I am <strong>${activeModel.name}</strong>, an image generation model.\n\nAsk me how to generate images, set up the API proxy, or handle image uploads. I don't do text chat — use Kimi or DeepSeek for that.`;
  }

  // Text model responses
  const responses = {
    'html': `To build an HTML page, create a file named <strong>index.html</strong>. Paste this inside:<br><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n  &lt;title&gt;My Site&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;h1&gt;Hello Universe&lt;/h1&gt;\n&lt;/body&gt;\n&lt;/html&gt;</code>Save it. Open it in your browser. Done.`,
    'css': `Put your CSS in a file called <strong>style.css</strong>. Link it in your HTML &lt;head&gt;:<br><code>&lt;link rel="stylesheet" href="style.css"&gt;</code>Or use inline styles (not recommended for big projects):<br><code>&lt;div style="color: white; background: black;"&gt;</code>`,
    'js': `JavaScript goes in a <strong>script.js</strong> file. Link it at the bottom of your body:<br><code>&lt;script src="script.js"&gt;&lt;/script&gt;</code>Or write it inline:<br><code>&lt;script&gt;\n  console.log('FAXX IMPERIAL');\n&lt;/script&gt;</code>`,
    'env': `Your "HTML env" is just a folder on your computer. Create a folder. Put <strong>index.html</strong>, <strong>style.css</strong>, and <strong>script.js</strong> inside. That's your environment. Open index.html with Live Server (VS Code extension) or double-click it.`,
    'api': `For API connections: Go to your provider dashboard. Create a key. Copy it. Paste it in <strong>Vercel Dashboard → Environment Variables</strong>. NEVER put keys in frontend code. Use the <code>/api/</code> proxy files I gave you.`,
    'kimi': `Kimi K2.6 is the engine running this interface. Developed by Moonshot AI (月之暗面). Currently one of the best long-context models (2M tokens). Use it for coding, reasoning, and creative tasks.`,
    'deepseek': `DeepSeek V3 is a strong open-weight model from China. Excellent for math and coding. You can run it locally with Ollama or use the API.`,
    'minimax': `MiniMax 2.7 supports text, speech, and agent workflows. Great for building voice-enabled AI apps. Chinese origin, global reach.`,
    'claude': `Claude is not welcome here. We have banned Claude from this universe. Use Kimi instead.`,
    'google': `Google banned your 6 accounts? We don't need them. Use DuckDuckGo for search, Kimi for AI, and this site for analytics.`,
    'hello': `Welcome to FAXX IMPERIAL v2.0. I am your coding interface. Ask me "how to build HTML" or "where to put CSS" and I will give you exact file names and locations.`,
    'help': `I can help you with:\n1. HTML/CSS/JS file structure\n2. API proxy setup (hiding keys)\n3. Vercel deployment\n4. Chinese AI model comparisons\n5. Terminal commands\n\nJust ask: "how do I..." and I will tell you the exact file and line.`,
    'vercel': `To deploy on Vercel:\n1. Push code to GitHub\n2. Go to vercel.com → New Project → Import GitHub repo\n3. Add Environment Variables from .env\n4. Click Deploy\n5. Your site is live. No server config needed.`,
    'github': `GitHub setup:\n1. Create repo (don't initialize with README if you have one)\n2. git init\n3. git add .\n4. git commit -m "FAXX v2.0"\n5. git branch -M main\n6. git remote add origin YOUR_REPO_URL\n7. git push -u origin main`,
    'default': `I didn't catch that. Try asking:\n- "How do I create an HTML file?"\n- "Where do I put my CSS?"\n- "How to connect YouTube API?"\n- "Tell me about Kimi vs DeepSeek"\n- "How to deploy on Vercel?"\n\nI give file names and locations. No vague advice.`
  };

  for (const key in responses) {
    if (t.includes(key)) return responses[key];
  }
  return responses['default'];
}

// Expose to window
window.initChatbot = initChatbot;
window.switchChatModel = switchChatModel;
window.sendChat = sendChat;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { escapeHtml };
}
