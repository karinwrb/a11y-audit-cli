import { resetRedactConfig, setRedactConfig } from './redact-config';
import { redactUrl, redactHeaders, redactObject } from './redact-runner';

beforeEach(() => resetRedactConfig());

describe('redactUrl', () => {
  it('redacts known query params', () => {
    const url = 'https://example.com/page?token=abc123&foo=bar';
    const result = redactUrl(url);
    expect(result).toContain('token=%5BREDACTED%5D');
    expect(result).toContain('foo=bar');
  });

  it('leaves url unchanged when no sensitive params', () => {
    const url = 'https://example.com/page?foo=bar';
    expect(redactUrl(url)).toBe(url);
  });

  it('returns original url when disabled', () => {
    setRedactConfig({ enabled: false });
    const url = 'https://example.com?token=secret';
    expect(redactUrl(url)).toBe(url);
  });
});

describe('redactHeaders', () => {
  it('redacts authorization header', () => {
    setRedactConfig({ fields: ['token', 'authorization'] });
    const headers = { Authorization: 'Bearer xyz', 'Content-Type': 'application/json' };
    const result = redactHeaders(headers);
    expect(result['Authorization']).toBe('[REDACTED]');
    expect(result['Content-Type']).toBe('application/json');
  });

  it('returns headers unchanged when disabled', () => {
    setRedactConfig({ enabled: false });
    const headers = { token: 'secret' };
    expect(redactHeaders(headers)).toEqual(headers);
  });
});

describe('redactObject', () => {
  it('redacts matching keys', () => {
    const obj = { apiKey: '12345', name: 'test' };
    const result = redactObject(obj);
    expect(result['apiKey']).toBe('[REDACTED]');
    expect(result['name']).toBe('test');
  });

  it('returns object unchanged when disabled', () => {
    setRedactConfig({ enabled: false });
    const obj = { secret: 'shh' };
    expect(redactObject(obj)).toEqual(obj);
  });
});
