import { generateMockAnalysis } from './glm-analyze.js';
import test from 'node:test';
import assert from 'node:assert';

test('generateMockAnalysis', async (t) => {
  await t.test('returns threat detection message when errorLog is present', () => {
    const context = 'frontend';
    const errorLog = 'ReferenceError: x is not defined';
    const code = 'console.log(x);';
    const result = generateMockAnalysis(context, errorLog, code);

    assert.match(result, /🚨 SYSTEM THREAT DETECTED/);
    assert.match(result, /ReferenceError: x is not defined/);
    assert.match(result, /frontend/);
  });

  await t.test('returns code scan complete message when no errorLog and code > 50 chars', () => {
    const context = 'frontend';
    const errorLog = null;
    const code = `
      function test() {
        console.log("This is a long test string to make code length greater than 50");
      }
    `;
    const result = generateMockAnalysis(context, errorLog, code);

    assert.match(result, /🔍 GLM 5.1 CODE SCAN COMPLETE/);
    assert.match(result, /Lines scanned/);
    assert.match(result, /Functions found/);
    assert.match(result, /API calls/);
  });

  await t.test('returns ready message when no errorLog and code <= 50 chars', () => {
    const context = 'frontend';
    const errorLog = null;
    const code = 'const x = 1;';
    const result = generateMockAnalysis(context, errorLog, code);

    assert.match(result, /GLM 5.1 CODE ANALYZER READY/);
    assert.match(result, /✓ Syntax errors/);
  });

  await t.test('returns ready message when no errorLog and no code', () => {
    const context = 'frontend';
    const errorLog = null;
    const code = null;
    const result = generateMockAnalysis(context, errorLog, code);

    assert.match(result, /GLM 5.1 CODE ANALYZER READY/);
  });
});
