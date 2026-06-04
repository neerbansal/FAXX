import { test } from 'node:test';
import assert from 'node:assert';
import { generateMockAnalysis } from '../glm-analyze.js';

test('generateMockAnalysis handles presence of errorLog', () => {
  const result = generateMockAnalysis('frontend', 'ReferenceError: x is not defined', 'const y = 1;');
  assert.ok(result.includes('🚨 SYSTEM THREAT DETECTED'));
  assert.ok(result.includes('ReferenceError: x is not defined'));
  assert.ok(result.includes('runtime error in the frontend layer'));
});

test('generateMockAnalysis handles presence of errorLog with generic context', () => {
  const result = generateMockAnalysis(undefined, 'Error: timeout', 'console.log("hello");');
  assert.ok(result.includes('🚨 SYSTEM THREAT DETECTED'));
  assert.ok(result.includes('runtime error in the frontend layer'));
  assert.ok(result.includes('api/generic.js'));
});

test('generateMockAnalysis handles missing errorLog and long code', () => {
  const longCode = 'a'.repeat(51);
  const result = generateMockAnalysis('frontend', null, longCode);
  assert.ok(result.includes('🔍 GLM 5.1 CODE SCAN COMPLETE'));
  assert.ok(result.includes('Lines scanned:'));
});

test('generateMockAnalysis handles missing errorLog and code length exactly 50', () => {
  const code50 = 'a'.repeat(50);
  const result = generateMockAnalysis('frontend', null, code50);
  assert.ok(result.includes('GLM 5.1 CODE ANALYZER READY'));
});

test('generateMockAnalysis handles missing errorLog and short code', () => {
  const shortCode = 'a'.repeat(10);
  const result = generateMockAnalysis('frontend', null, shortCode);
  assert.ok(result.includes('GLM 5.1 CODE ANALYZER READY'));
});

test('generateMockAnalysis handles missing errorLog and missing code', () => {
  const result = generateMockAnalysis('frontend', null, null);
  assert.ok(result.includes('GLM 5.1 CODE ANALYZER READY'));
});

test('generateMockAnalysis correctly calculates metrics for long code', () => {
    const code = `
        function test() {
            fetch('/api/data');
            axios.get('/api/other');
        }
        const a = () => {};
        // HIDDEN_BY_FAXX
    `;
    const result = generateMockAnalysis('frontend', null, code);
    assert.ok(result.includes('Functions found: 2'));
    assert.ok(result.includes('API calls: 2'));
    assert.ok(result.includes('API keys sanitized: YES ✓'));
});
