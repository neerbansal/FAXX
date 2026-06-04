const { escapeHtml } = require('../chatbot.js');

describe('escapeHtml', () => {
  it('should correctly escape & characters', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
  });

  it('should correctly escape < characters', () => {
    expect(escapeHtml('foo < bar')).toBe('foo &lt; bar');
  });

  it('should correctly escape > characters', () => {
    expect(escapeHtml('foo > bar')).toBe('foo &gt; bar');
  });

  it('should escape all occurrences', () => {
    expect(escapeHtml('<>&<>&')).toBe('&lt;&gt;&amp;&lt;&gt;&amp;');
  });

  it('should handle strings without characters to escape', () => {
    expect(escapeHtml('foo bar')).toBe('foo bar');
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });
});
