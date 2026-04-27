import { maskString, maskField, maskObject, maskResult, maskAndCount } from './mask-runner';
import { setMaskConfig, resetMaskConfig } from './mask-config';
import { AuditResult } from './types';

function makeResult(url: string, meta?: Record<string, unknown>): AuditResult {
  return {
    url,
    violations: [],
    passes: 0,
    score: 100,
    meta,
  } as unknown as AuditResult;
}

beforeEach(() => resetMaskConfig());

describe('maskString', () => {
  it('masks all but last N chars', () => {
    expect(maskString('secret123', '*', 3)).toBe('******123');
  });

  it('masks entirely when value shorter than visibleChars', () => {
    expect(maskString('ab', '*', 4)).toBe('**');
  });

  it('uses custom mask char', () => {
    expect(maskString('hello', '#', 2)).toBe('###lo');
  });
});

describe('maskField', () => {
  beforeEach(() =>
    setMaskConfig({ enabled: true, sensitiveFields: ['token', 'password'], maskChar: '*', visibleChars: 4 })
  );

  it('masks sensitive field', () => {
    expect(maskField('token', 'abc123456789')).toBe('********6789');
  });

  it('does not mask non-sensitive field', () => {
    expect(maskField('title', 'hello')).toBe('hello');
  });

  it('returns non-string values unchanged', () => {
    expect(maskField('token', 42)).toBe(42);
  });
});

describe('maskObject', () => {
  beforeEach(() =>
    setMaskConfig({ enabled: true, sensitiveFields: ['apiKey'], maskChar: '*', visibleChars: 2 })
  );

  it('masks nested sensitive fields', () => {
    const obj = { auth: { apiKey: 'supersecret' } };
    const result = maskObject(obj as Record<string, unknown>);
    expect((result.auth as Record<string, unknown>).apiKey).toBe('*********et');
  });

  it('leaves non-sensitive fields intact', () => {
    const obj = { name: 'test', apiKey: 'abc12' };
    const result = maskObject(obj);
    expect(result.name).toBe('test');
  });
});

describe('maskResult', () => {
  it('returns result unchanged when disabled', () => {
    setMaskConfig({ enabled: false });
    const r = makeResult('https://example.com');
    expect(maskResult(r).url).toBe('https://example.com');
  });

  it('masks url when url is in sensitiveFields', () => {
    setMaskConfig({ enabled: true, sensitiveFields: ['url'], maskChar: '*', visibleChars: 3 });
    const r = makeResult('https://example.com');
    const masked = maskResult(r);
    expect(masked.url).toMatch(/\*+/);
  });
});

describe('maskAndCount', () => {
  it('returns original results when disabled', () => {
    setMaskConfig({ enabled: false });
    const results = [makeResult('https://a.com')];
    const { results: out, maskedCount } = maskAndCount(results);
    expect(out).toEqual(results);
    expect(maskedCount).toBe(0);
  });
});
