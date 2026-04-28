import {
  getDedupeConfig,
  setDedupeConfig,
  resetDedupeConfig,
  isDedupeEnabled,
  getDedupeStrategy,
} from './dedup-config';

describe('dedup-config', () => {
  afterEach(() => {
    resetDedupeConfig();
  });

  it('returns default config', () => {
    const config = getDedupeConfig();
    expect(config.enabled).toBe(true);
    expect(config.strategy).toBe('url+rule');
  });

  it('isDedupeEnabled returns true by default', () => {
    expect(isDedupeEnabled()).toBe(true);
  });

  it('getDedupeStrategy returns url+rule by default', () => {
    expect(getDedupeStrategy()).toBe('url+rule');
  });

  it('setDedupeConfig overrides enabled', () => {
    setDedupeConfig({ enabled: false });
    expect(isDedupeEnabled()).toBe(false);
  });

  it('setDedupeConfig overrides strategy', () => {
    setDedupeConfig({ strategy: 'rule' });
    expect(getDedupeStrategy()).toBe('rule');
  });

  it('setDedupeConfig merges partial updates', () => {
    setDedupeConfig({ strategy: 'url' });
    expect(isDedupeEnabled()).toBe(true);
    expect(getDedupeStrategy()).toBe('url');
  });

  it('resetDedupeConfig restores defaults', () => {
    setDedupeConfig({ enabled: false, strategy: 'url' });
    resetDedupeConfig();
    expect(isDedupeEnabled()).toBe(true);
    expect(getDedupeStrategy()).toBe('url+rule');
  });

  it('getDedupeConfig returns a copy, not reference', () => {
    const config = getDedupeConfig();
    config.enabled = false;
    expect(isDedupeEnabled()).toBe(true);
  });
});
