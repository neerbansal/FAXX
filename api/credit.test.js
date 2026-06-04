import test from 'node:test';
import assert from 'node:assert';
import handler from './credit.js';

function createMockResponse() {
  let statusCode = null;
  let responseBody = null;
  let headers = {};

  const res = {
    setHeader: (name, value) => {
      headers[name] = value;
    },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (body) => {
      responseBody = body;
      return res;
    },
    end: () => {
      return res;
    },
    getStatusCode: () => statusCode,
    getResponseBody: () => responseBody,
    getHeaders: () => headers,
  };

  return res;
}

test('credit proxy - unknown provider', async () => {
  const req = {
    method: 'GET',
    query: {
      provider: 'unknown_provider_123'
    }
  };

  const res = createMockResponse();
  await handler(req, res);

  assert.strictEqual(res.getStatusCode(), 400);
  assert.deepStrictEqual(res.getResponseBody(), {
    error: 'Unknown provider. Use: kimi, minimax, sd35, flux, klein, deepseek, nvidia, youtube, clerk'
  });
});

test('credit proxy - missing provider', async () => {
  const req = {
    method: 'GET',
    query: {}
  };

  const res = createMockResponse();
  await handler(req, res);

  assert.strictEqual(res.getStatusCode(), 400);
  assert.deepStrictEqual(res.getResponseBody(), {
    error: 'Unknown provider. Use: kimi, minimax, sd35, flux, klein, deepseek, nvidia, youtube, clerk'
  });
});

test('credit proxy - OPTIONS method', async () => {
  const req = {
    method: 'OPTIONS',
    query: {}
  };

  const res = createMockResponse();
  await handler(req, res);

  assert.strictEqual(res.getStatusCode(), 200);
});

test('credit proxy - known provider without API key', async () => {
  const req = {
    method: 'GET',
    query: {
      provider: 'kimi'
    }
  };

  // Ensure env var is empty
  const originalEnv = process.env.KIMI_API_KEY;
  delete process.env.KIMI_API_KEY;

  const res = createMockResponse();
  await handler(req, res);

  assert.strictEqual(res.getStatusCode(), 200);
  assert.deepStrictEqual(res.getResponseBody(), {
    status: 'NO_KEY',
    credits: '-',
    rpm: '-',
    note: 'Add KIMI_API_KEY to .env'
  });

  if (originalEnv !== undefined) {
    process.env.KIMI_API_KEY = originalEnv;
  }
});
