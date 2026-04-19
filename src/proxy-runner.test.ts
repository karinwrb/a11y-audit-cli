import { buildProxyAgent, applyProxy } from './proxy-runner';
import { setProxyConfig, resetProxyConfig } from './proxy-config';

afterEach(() => {
  resetProxyConfig();
});

describe('buildProxyAgent', () => {
  it('returns null when proxy disabled', () => {
    setProxyConfig({ enabled: false, url: 'http://proxy:8080' });
    expect(buildProxyAgent()).toBeNull();
  });

  it('returns null when no url set', () => {
    setProxyConfig({ enabled: true, url: '' });
    expect(buildProxyAgent()).toBeNull();
  });

  it('returns agent object when enabled with url', () => {
    setProxyConfig({ enabled: true, url: 'http://proxy.example.com:3128' });
    const agent = buildProxyAgent();
    expect(agent).not.toBeNull();
    expect(agent).toHaveProperty('proxyUrl', 'http://proxy.example.com:3128');
  });
});

describe('applyProxy', () => {
  it('returns options unchanged when proxy disabled', () => {
    setProxyConfig({ enabled: false, url: 'http://proxy:8080' });
    const opts = { headers: {} };
    expect(applyProxy(opts)).toEqual(opts);
  });

  it('injects agent into options when proxy enabled', () => {
    setProxyConfig({ enabled: true, url: 'http://proxy:8080' });
    const result = applyProxy({ headers: {} });
    expect(result).toHaveProperty('agent');
  });

  it('preserves existing options fields', () => {
    setProxyConfig({ enabled: true, url: 'http://proxy:8080' });
    const result = applyProxy({ headers: { 'x-test': '1' }, timeout: 5000 });
    expect(result.headers).toEqual({ 'x-test': '1' });
    expect(result.timeout).toBe(5000);
  });
});
