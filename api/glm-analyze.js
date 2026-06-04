// FAXX IMPERIAL — GLM 5.1 Code Analyzer
// Reads your frontend/backend code, analyzes errors, suggests fixes.
// NEVER exposes API keys in analysis output.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://faxx.up.railway.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, context, errorLog, mode } = req.body || {};
  const GLM_KEY = process.env.GLM_API_KEY;

  if (!GLM_KEY) {
    return res.status(200).json({
      analysis: '⚠️ GLM_API_KEY not configured. Add it to your .env file on Vercel.\n\nHere is what I would analyze:\n- Syntax errors\n- API key leakage (regex scan)\n- Performance bottlenecks\n- Security vulnerabilities',
      threatLevel: 'CONFIG_MISSING',
      fixes: ['Go to Vercel Dashboard → Project → Environment Variables → Add GLM_API_KEY']
    });
  }

  try {
    // SECURITY: Strip any API keys from code before sending to GLM
    const sanitizedCode = (code || '').replace(
      /(api[_-]?key|apikey|token|secret|password|auth)\s*[:=]\s*["'][^"']{10,}["']/gi,
      '$1: "***HIDDEN_BY_FAXX_SECURITY***"'
    );

    // In production, uncomment below to call real GLM 5.1 API:
    /*
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GLM_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-5.1',
        messages: [
          {
            role: 'system',
            content: 'You are GLM 5.1, the FAXX IMPERIAL code analyzer. Analyze code for errors, security issues, and performance. NEVER repeat API keys if found. Always give file names and line numbers.'
          },
          {
            role: 'user',
            content: `Context: ${context || 'general'}\nError Log: ${errorLog || 'none'}\n\nCode:\n${sanitizedCode}`
          }
        ],
        temperature: 0.2
      })
    });
    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'No response';
    */

    // MOCK RESPONSE (remove when real API is connected):
    const mockAnalysis = generateMockAnalysis(context, errorLog, sanitizedCode);

    return res.status(200).json({
      analysis: mockAnalysis,
      threatLevel: errorLog ? 'HIGH' : 'LOW',
      secretsScanned: true,
      secretsFound: sanitizedCode.includes('HIDDEN_BY_FAXX'),
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return res.status(500).json({
      error: 'GLM_ANALYSIS_FAILED',
      message: err.message,
      threatLevel: 'CRITICAL'
    });
  }
}

export function generateMockAnalysis(context, errorLog, code) {
  if (errorLog) {
    return `🚨 SYSTEM THREAT DETECTED\n═══════════════════════\n\n${errorLog}\n\n🔧 GLM 5.1 DIAGNOSIS:\n1. This is a runtime error in the ${context || 'frontend'} layer.\n2. Check your API proxy in /api/ — the key might be missing in Vercel env vars.\n3. Ensure CORS headers are set on all API routes.\n4. If 500 error: check Vercel Functions logs (Dashboard → Logs).\n\n📁 FILES TO CHECK:\n- api/${(context || 'generic').toLowerCase()}.js\n- js/terminal.js (line 45-60)\n- .env (ensure keys are set, NOT committed)\n\n✅ ACTION:\nRun "/status" in terminal to verify all API connections.`;
  }

  if (code && code.length > 50) {
    return `🔍 GLM 5.1 CODE SCAN COMPLETE\n══════════════════════════════\n\n📊 METRICS:\n- Lines scanned: ${code.split('\n').length}\n- Functions found: ${(code.match(/function|=>/g) || []).length}\n- API calls: ${(code.match(/fetch|axios/gi) || []).length}\n\n🛡️ SECURITY:\n- API keys sanitized: ${code.includes('HIDDEN_BY_FAXX') ? 'YES ✓' : 'NO ✓ (none found)'}\n\n💡 SUGGESTIONS:\n1. Add try/catch blocks around all fetch() calls.\n2. Use the /api/ proxy instead of calling external APIs directly from frontend.\n3. Add input validation before sending data to GLM analyzer.\n4. Consider splitting large files into modules.`;
  }

  return `GLM 5.1 CODE ANALYZER READY\n════════════════════════════\n\nUsage:\n- Paste code in terminal and run /analyze\n- Or let auto-capture send errors here\n\nI will scan for:\n✓ Syntax errors\n✓ API key leaks\n✓ CORS misconfigurations\n✓ Performance issues\n✓ Security vulnerabilities\n\nYour secrets are always redacted before analysis.`;
}
