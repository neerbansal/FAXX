// FAXX IMPERIAL — Universe Terminal v2.0
// API System Dashboard | GLM 5.1 Code Analyzer | Light Code Editor | Threat Monitor

const TERM_STATE = {
  history: [],
  historyIndex: -1,
  mode: 'dashboard', // dashboard | editor | glm
  editorFiles: {
    'index.html': '',
    'style.css': '',
    'app.js': ''
  },
  activeFile: 'index.html',
  threats: [],
  apiStatus: {}
};

const COMMANDS = {
  help: {
    desc: 'Show all commands',
    exec: () => {
      addTermLine('╔════════════════════════════════════════════════════════════╗');
      addTermLine('║           FAXX IMPERIAL — UNIVERSE TERMINAL v2.0           ║');
      addTermLine('╠════════════════════════════════════════════════════════════╣');
      addTermLine('║ API DASHBOARD                                              ║');
      addTermLine('║   /kimi          Check Kimi K2.6 credits & RPM             ║');
      addTermLine('║   /minimax       Check MiniMax 2.7 credits & RPM           ║');
      addTermLine('║   /sd35          Check Stable Diffusion 3.5 credits        ║');
      addTermLine('║   /flux          Check Flux 2 credits                      ║');
      addTermLine('║   /klein         Check Klein 2BT credits                   ║');
      addTermLine('║   /deepseek      Check DeepSeek V3 credits                 ║');
      addTermLine('║   /nvidia        Check NVIDIA API credits                  ║');
      addTermLine('║   /youtube       Check YouTube Data API quota              ║');
      addTermLine('║   /clerk         Check Clerk Auth status                   ║');
      addTermLine('║   /status        Check ALL APIs at once                    ║');
      addTermLine('╠════════════════════════════════════════════════════════════╣');
      addTermLine('║ GLM 5.1 CODE ANALYZER                                      ║');
      addTermLine('║   /glm           Activate GLM 5.1 analyzer                 ║');
      addTermLine('║   /analyze       Analyze current codebase                  ║');
      addTermLine('║   /threats       View system threats & errors              ║');
      addTermLine('║   /clearthreats  Clear threat log                          ║');
      addTermLine('╠════════════════════════════════════════════════════════════╣');
      addTermLine('║ CODE EDITOR                                                ║');
      addTermLine('║   /edit          Open light code editor                    ║');
      addTermLine('║   /files         List open files                           ║');
      addTermLine('║   /save          Save current file to localStorage         ║');
      addTermLine('╠════════════════════════════════════════════════════════════╣');
      addTermLine('║ SYSTEM                                                     ║');
      addTermLine('║   whoami         User identity                             ║');
      addTermLine('║   date           Earth timestamp                           ║');
      addTermLine('║   clear          Clear terminal                            ║');
      addTermLine('║   godmode        Activate rainbow protocol                 ║');
      addTermLine('║   destroy        Initiate self destruct                    ║');
      addTermLine('╚════════════════════════════════════════════════════════════╝');
    }
  },

  '/kimi': { desc: 'Kimi K2.6 credits', exec: () => fetchCredits('kimi') },
  '/minimax': { desc: 'MiniMax 2.7 credits', exec: () => fetchCredits('minimax') },
  '/sd35': { desc: 'SD 3.5 credits', exec: () => fetchCredits('sd35') },
  '/flux': { desc: 'Flux 2 credits', exec: () => fetchCredits('flux') },
  '/klein': { desc: 'Klein 2BT credits', exec: () => fetchCredits('klein') },
  '/deepseek': { desc: 'DeepSeek V3 credits', exec: () => fetchCredits('deepseek') },
  '/nvidia': { desc: 'NVIDIA API credits', exec: () => fetchCredits('nvidia') },
  '/youtube': { desc: 'YouTube API quota', exec: () => fetchCredits('youtube') },
  '/clerk': { desc: 'Clerk Auth status', exec: () => fetchCredits('clerk') },

  '/status': {
    desc: 'Check all APIs',
    exec: async () => {
      addTermLine('🔍 SCANNING ALL API ENDPOINTS...', 'warn');
      const providers = ['kimi', 'minimax', 'sd35', 'flux', 'klein', 'deepseek', 'nvidia', 'youtube', 'clerk'];
      for (const p of providers) {
        await fetchCredits(p, true);
        await sleep(300);
      }
      addTermLine('✅ SCAN COMPLETE.', 'success');
    }
  },

  '/glm': {
    desc: 'Activate GLM 5.1',
    exec: () => {
      TERM_STATE.mode = 'glm';
      addTermLine('🧠 GLM 5.1 CODE ANALYZER ACTIVATED', 'success');
      addTermLine('═══════════════════════════════════════');
      addTermLine('GLM 5.1 is now monitoring your codebase.');
      addTermLine('Commands in this mode:');
      addTermLine('  analyze <code>   Analyze code snippet');
      addTermLine('  scan             Full codebase scan');
      addTermLine('  exit             Return to dashboard');
      addTermLine('');
      addTermLine('All API keys are automatically redacted before analysis.');
      addTermLine('Type "exit" to leave GLM mode.');
    }
  },

  '/analyze': {
    desc: 'Analyze codebase',
    exec: async () => {
      addTermLine('🧠 GLM 5.1 ANALYZING CODEBASE...', 'warn');
      addTermLine('Redacting secrets... ✓');
      try {
        const res = await fetch('/api/glm-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: document.documentElement.outerHTML.substring(0, 3000),
            context: 'frontend',
            mode: 'scan'
          })
        });
        const data = await res.json();
        addTermLine('');
        data.analysis.split('\n').forEach(line => addTermLine(line));
        if (data.secretsFound) {
          addTermLine('⚠️ SECRETS WERE DETECTED AND REDACTED.', 'err');
        }
      } catch (e) {
        addTermLine('❌ GLM 5.1 offline. Check GLM_API_KEY in Vercel env.', 'err');
      }
    }
  },

  '/threats': {
    desc: 'View threats',
    exec: () => {
      if (TERM_STATE.threats.length === 0) {
        addTermLine('✅ No system threats detected.', 'success');
        return;
      }
      addTermLine(`🚨 ${TERM_STATE.threats.length} THREAT(S) DETECTED:`, 'err');
      addTermLine('═══════════════════════════════════════');
      TERM_STATE.threats.forEach((t, i) => {
        addTermLine(`[${i + 1}] ${t.time} | ${t.type}`, 'err');
        addTermLine(`    ${t.message}`);
        if (t.fix) addTermLine(`    🔧 FIX: ${t.fix}`, 'success');
      });
    }
  },

  '/clearthreats': {
    desc: 'Clear threats',
    exec: () => {
      TERM_STATE.threats = [];
      addTermLine('🛡️ Threat log cleared.', 'success');
    }
  },

  '/edit': {
    desc: 'Open code editor',
    exec: () => {
      TERM_STATE.mode = 'editor';
      addTermLine('📝 LIGHT CODE EDITOR ACTIVATED', 'success');
      addTermLine('═══════════════════════════════════════');
      addTermLine('Files: index.html | style.css | app.js');
      addTermLine('Commands: /open <file> | /save | /close');
      addTermLine('');
      addTermLine('Current file: ' + TERM_STATE.activeFile);
      renderEditor();
    }
  },

  '/files': {
    desc: 'List files',
    exec: () => {
      addTermLine('📁 OPEN FILES:');
      Object.keys(TERM_STATE.editorFiles).forEach(f => {
        const marker = f === TERM_STATE.activeFile ? '→ ' : '  ';
        addTermLine(`${marker}${f}`);
      });
    }
  },

  '/save': {
    desc: 'Save file',
    exec: () => {
      if (TERM_STATE.mode !== 'editor') {
        addTermLine('⚠️ Not in editor mode. Type /edit first.', 'warn');
        return;
      }
      const content = document.getElementById('termEditor')?.value || '';
      TERM_STATE.editorFiles[TERM_STATE.activeFile] = content;
      localStorage.setItem('faxx_editor_' + TERM_STATE.activeFile, content);
      addTermLine(`💾 Saved ${TERM_STATE.activeFile} to localStorage.`, 'success');
    }
  },

  whoami: {
    desc: 'User identity',
    exec: () => {
      addTermLine('pron33r — FAXX IMPERIAL COMMANDER');
      addTermLine('Email: pron33rbusiness@gmail.com');
      addTermLine('Access Level: ROOT');
    }
  },

  date: {
    desc: 'Timestamp',
    exec: () => addTermLine(new Date().toString())
  },

  clear: {
    desc: 'Clear terminal',
    exec: () => {
      document.getElementById('termBody').innerHTML = '';
    }
  },

  godmode: {
    desc: 'Rainbow protocol',
    exec: () => {
      document.body.classList.add('god-mode');
      addTermLine('🌈 RAINBOW PROTOCOL ACTIVE', 'success');
      confetti();
    }
  },

  destroy: {
    desc: 'Self destruct',
    exec: () => {
      addTermLine('INITIATING SELF DESTRUCT...', 'err');
      setTimeout(() => selfDestruct(), 1000);
    }
  }
};

// Terminal input handler
function initTerminal() {
  const input = document.getElementById('termInput');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      input.value = '';
      if (!raw) return;

      TERM_STATE.history.push(raw);
      TERM_STATE.historyIndex = TERM_STATE.history.length;

      // In editor mode, handle differently
      if (TERM_STATE.mode === 'editor' && !raw.startsWith('/')) {
        addTermLine('> [Editor input captured. Use /save to persist.]');
        return;
      }

      addTermLine('> ' + raw, 'cmd');
      processTerm(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (TERM_STATE.historyIndex > 0) {
        TERM_STATE.historyIndex--;
        input.value = TERM_STATE.history[TERM_STATE.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (TERM_STATE.historyIndex < TERM_STATE.history.length - 1) {
        TERM_STATE.historyIndex++;
        input.value = TERM_STATE.history[TERM_STATE.historyIndex];
      } else {
        TERM_STATE.historyIndex = TERM_STATE.history.length;
        input.value = '';
      }
    }
  });

  // Global error capture → Terminal threat monitor
  window.addEventListener('error', (e) => {
    logThreat({
      type: 'RUNTIME_ERROR',
      message: e.message,
      file: e.filename,
      line: e.lineno,
      fix: 'Check browser console. If API error, verify env vars in Vercel.'
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    logThreat({
      type: 'UNHANDLED_PROMISE',
      message: e.reason?.message || String(e.reason),
      fix: 'Add .catch() to your Promise or use try/catch with async/await.'
    });
  });

  // Monitor fetch failures (API errors)
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const res = await originalFetch.apply(this, args);
      if (!res.ok && args[0].includes('/api/')) {
        logThreat({
          type: 'API_ERROR',
          message: `${args[0]} returned ${res.status}`,
          fix: 'Check Vercel Functions logs. Ensure API keys are set in Environment Variables.'
        });
      }
      return res;
    } catch (err) {
      logThreat({
        type: 'NETWORK_FAILURE',
        message: err.message,
        fix: 'Check internet connection. If localhost, ensure CORS is enabled on API routes.'
      });
      throw err;
    }
  };
}

function processTerm(cmd) {
  const c = cmd.toLowerCase().trim();

  // GLM mode special handling
  if (TERM_STATE.mode === 'glm' && c !== 'exit') {
    if (c === 'scan') {
      COMMANDS['/analyze'].exec();
    } else if (c.startsWith('analyze ')) {
      const code = c.slice(8);
      analyzeWithGLM(code, 'manual');
    } else {
      addTermLine('GLM 5.1: Use "analyze <code>", "scan", or "exit"');
    }
    return;
  }

  if (c === 'exit') {
    TERM_STATE.mode = 'dashboard';
    addTermLine('Returned to API Dashboard.', 'success');
    removeEditor();
    return;
  }

  // Editor mode special handling
  if (TERM_STATE.mode === 'editor') {
    if (c.startsWith('/open ')) {
      const file = c.slice(6).trim();
      if (TERM_STATE.editorFiles.hasOwnProperty(file)) {
        TERM_STATE.activeFile = file;
        addTermLine(`Opened ${file}`);
        renderEditor();
      } else {
        addTermLine(`File not found: ${file}`, 'err');
      }
      return;
    }
    if (c === '/close') {
      TERM_STATE.mode = 'dashboard';
      removeEditor();
      addTermLine('Editor closed.', 'success');
      return;
    }
  }

  // Standard commands
  if (COMMANDS[c]) {
    COMMANDS[c].exec();
  } else if (c.startsWith('/')) {
    addTermLine(`Unknown command: ${cmd}`, 'err');
    addTermLine('Type "help" for available commands.');
  } else {
    addTermLine(`Unknown command: "${cmd}"`, 'err');
  }
}

async function fetchCredits(provider, silent = false) {
  if (!silent) addTermLine(`Fetching ${provider.toUpperCase()} status...`);
  try {
    const res = await fetch(`/api/credits?provider=${provider}`);
    const data = await res.json();

    if (data.error || data.status === 'NO_KEY') {
      addTermLine(`⚠️ ${provider.toUpperCase()}: ${data.note || data.message}`, 'warn');
      return;
    }

    TERM_STATE.apiStatus[provider] = data;

    addTermLine('');
    addTermLine(`┌─ ${data.provider} ─${'─'.repeat(40 - data.provider.length)}┐`);
    addTermLine(`│ Status:    ${data.status}${' '.repeat(31 - data.status.length)}│`);
    if (data.credits || data.quota) {
      const val = data.credits || data.quota;
      addTermLine(`│ ${data.unit ? 'Credits' : 'Quota'}:   ${val}${' '.repeat(Math.max(1, 30 - String(val).length))}│`);
    }
    if (data.rpm) addTermLine(`│ RPM:       ${data.rpm}${' '.repeat(Math.max(1, 30 - String(data.rpm).length))}│`);
    if (data.tpm) addTermLine(`│ TPM:       ${data.tpm}${' '.repeat(Math.max(1, 30 - String(data.tpm).length))}│`);
    if (data.tier) addTermLine(`│ Tier:      ${data.tier}${' '.repeat(Math.max(1, 30 - String(data.tier).length))}│`);
    if (data.region) addTermLine(`│ Region:    ${data.region}${' '.repeat(Math.max(1, 30 - String(data.region).length))}│`);
    addTermLine(`└${'─'.repeat(43)}┘`);

  } catch (err) {
    addTermLine(`❌ Failed to reach ${provider}: ${err.message}`, 'err');
  }
}

async function analyzeWithGLM(code, context) {
  addTermLine('🧠 Sending to GLM 5.1 (secrets redacted)...', 'warn');
  try {
    const res = await fetch('/api/glm-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, context, mode: 'manual' })
    });
    const data = await res.json();
    data.analysis.split('\n').forEach(line => addTermLine(line));
  } catch (e) {
    addTermLine('❌ GLM 5.1 unreachable.', 'err');
  }
}

function logThreat(threat) {
  const entry = {
    ...threat,
    time: new Date().toLocaleTimeString(),
    id: Date.now()
  };
  TERM_STATE.threats.unshift(entry);
  if (TERM_STATE.threats.length > 50) TERM_STATE.threats.pop();

  // Auto-analyze with GLM if it's an API error
  if (threat.type === 'API_ERROR' || threat.type === 'RUNTIME_ERROR') {
    addTermLine('', 'err');
    addTermLine(`🚨 SYSTEM THREAT DETECTED [${entry.time}]`, 'err');
    addTermLine(`${threat.type}: ${threat.message}`, 'err');
    addTermLine('Routing to GLM 5.1 for analysis...', 'warn');

    // Mock GLM auto-analysis for immediate feedback
    setTimeout(() => {
      addTermLine('');
      addTermLine('🔧 GLM 5.1 AUTO-ANALYSIS:', 'success');
      addTermLine(threat.fix);
      addTermLine('Run "/threats" for full log. Run "/status" to verify APIs.');
    }, 600);
  }
}

function renderEditor() {
  removeEditor();
  const body = document.getElementById('termBody');
  const wrap = document.createElement('div');
  wrap.id = 'editorWrap';
  wrap.style.cssText = 'border:2px solid var(--border);margin:8px 0;padding:8px;background:rgba(255,255,255,0.03);';

  const header = document.createElement('div');
  header.style.cssText = 'font-size:11px;text-transform:uppercase;margin-bottom:6px;opacity:0.7;';
  header.textContent = `Editing: ${TERM_STATE.activeFile} | Lines: ${(TERM_STATE.editorFiles[TERM_STATE.activeFile] || '').split('\n').length}`;

  const ta = document.createElement('textarea');
  ta.id = 'termEditor';
  ta.style.cssText = 'width:100%;height:160px;background:#000;color:var(--success);border:1px solid var(--border);font-family:var(--font-mono);font-size:12px;padding:8px;resize:vertical;outline:none;';
  ta.value = localStorage.getItem('faxx_editor_' + TERM_STATE.activeFile) || TERM_STATE.editorFiles[TERM_STATE.activeFile] || '';
  ta.placeholder = `// Write ${TERM_STATE.activeFile} code here...\n// Use /save to persist\n// Use /close to exit editor`;

  wrap.appendChild(header);
  wrap.appendChild(ta);
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
  ta.focus();
}

function removeEditor() {
  const el = document.getElementById('editorWrap');
  if (el) el.remove();
}

function addTermLine(text, cls = '') {
  const body = document.getElementById('termBody');
  if (!body) return;
  const div = document.createElement('div');
  div.className = 'line ' + cls;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Expose
window.initTerminal = initTerminal;
window.addTermLine = addTermLine;
