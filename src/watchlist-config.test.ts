import {
  getWatchlistConfig,
  setWatchlistConfig,
  resetWatchlistConfig,
  isWatchlistEnabled,
  getWatchedUrls,
  addWatchedUrl,
  removeWatchedUrl,
} from './watchlist-config';

beforeEach(() => resetWatchlistConfig());

describe('getWatchlistConfig', () => {
  it('returns defaults', () => {
    const cfg = getWatchlistConfig();
    expect(cfg.enabled).toBe(false);
    expect(cfg.urls).toEqual([]);
    expect(cfg.alertOnNewViolations).toBe(true);
    expect(cfg.alertOnRemovedViolations).toBe(false);
  });
});

describe('setWatchlistConfig', () => {
  it('merges partial config', () => {
    setWatchlistConfig({ enabled: true });
    expect(isWatchlistEnabled()).toBe(true);
  });
});

describe('getWatchedUrls', () => {
  it('returns copy of url list', () => {
    setWatchlistConfig({ urls: ['https://example.com'] });
    const urls = getWatchedUrls();
    expect(urls).toEqual(['https://example.com']);
  });
});

describe('addWatchedUrl', () => {
  it('adds a new url', () => {
    addWatchedUrl('https://example.com');
    expect(getWatchedUrls()).toContain('https://example.com');
  });

  it('does not add duplicate url', () => {
    addWatchedUrl('https://example.com');
    addWatchedUrl('https://example.com');
    expect(getWatchedUrls().length).toBe(1);
  });
});

describe('removeWatchedUrl', () => {
  it('removes an existing url', () => {
    addWatchedUrl('https://example.com');
    removeWatchedUrl('https://example.com');
    expect(getWatchedUrls()).not.toContain('https://example.com');
  });

  it('is a no-op for unknown url', () => {
    removeWatchedUrl('https://unknown.com');
    expect(getWatchedUrls()).toEqual([]);
  });
});
