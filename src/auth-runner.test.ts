import { buildAuthHeaders, applyAuthToUrl, injectAuth } from './auth-runner';
import { setAuthConfig, resetAuthConfig } from './auth-config';

beforeEach(() => resetAuthConfig());

describe('buildAuthHeaders', () => {
  it('returns empty object when auth disabled', () => {
    expect(buildAuthHeaders()).toEqual({});
  });

  it('returns bearer token header', () => {
    setAuthConfig({ enabled: true, bearerToken: 'tok123' });
    expect(buildAuthHeaders()).toEqual({ Authorization: 'Bearer tok123' });
  });

  it('returns basic auth header', () => {
    setAuthConfig({ enabled: true, username: 'user', password: 'pass' });
    const expected = 'Basic ' + Buffer.from('user:pass').toString('base64');
    expect(buildAuthHeaders()).toEqual({ Authorization: expected });
  });

  it('returns custom headers', () => {
    setAuthConfig({ enabled: true, customHeaders: { 'X-Api-Key': 'abc' } });
    expect(buildAuthHeaders()).toEqual({ 'X-Api-Key': 'abc' });
  });
});

describe('applyAuthToUrl', () => {
  it('returns url unchanged when disabled', () => {
    expect(applyAuthToUrl('https://example.com')).toBe('https://example.com');
  });

  it('appends api key param', () => {
    setAuthConfig({ enabled: true, apiKey: 'mykey', apiKeyParam: 'key' });
    expect(applyAuthToUrl('https://example.com')).toBe('https://example.com?key=mykey');
  });

  it('appends api key with existing query', () => {
    setAuthConfig({ enabled: true, apiKey: 'mykey', apiKeyParam: 'key' });
    expect(applyAuthToUrl('https://example.com?foo=bar')).toBe('https://example.com?foo=bar&key=mykey');
  });
});

describe('injectAuth', () => {
  it('returns combined url and headers', () => {
    setAuthConfig({ enabled: true, bearerToken: 'tok', apiKey: 'k', apiKeyParam: 'key' });
    const result = injectAuth('https://example.com');
    expect(result.headers).toEqual({ Authorization: 'Bearer tok' });
    expect(result.url).toBe('https://example.com?key=k');
  });
});
