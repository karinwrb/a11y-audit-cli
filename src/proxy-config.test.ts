import {
  getProxyConfig,
  setProxyConfig,
  resetProxyConfig,
  isProxyEnabled,
  getProxyUrl,
  getBypassList,
  isBypassed,
} from './proxy-config';

beforeEach(() => resetProxyConfig());

describe('proxy-config', () => {
  it('defaults to disabled with no url', () => {
    expect(isProxyEnabled()).toBe(false);
    expect(getProxyUrl()).toBeNull();
  });

  it('enables proxy when url and enabled are set', () => {
    setProxyConfig({ enabled: true, url: 'http://proxy:3128' });
    expect(isProxyEnabled()).toBe(true);
    expect(getProxyUrl()).toBe('http://proxy:3128');
  });

  it('remains disabled if enabled=true but url is null', () => {
    setProxyConfig({ enabled: true });
    expect(isProxyEnabled()).toBe(false);
  });

  it('returns bypass list', () => {
    setProxyConfig({ bypassList: ['localhost', '127.0.0.1'] });
    expect(getBypassList()).toEqual(['localhost', '127.0.0.1']);
  });

  it('detects bypassed urls', () => {
    setProxyConfig({ bypassList: ['localhost'] });
    expect(isBypassed('http://localhost:3000')).toBe(true);
    expect(isBypassed('http://example.com')).toBe(false);
  });

  it('resets to defaults', () => {
    setProxyConfig({ enabled: true, url: 'http://proxy:3128', bypassList: ['x'] });
    resetProxyConfig();
    const cfg = getProxyConfig();
    expect(cfg.enabled).toBe(false);
    expect(cfg.url).toBeNull();
    expect(cfg.bypassList).toEqual([]);
  });
});
