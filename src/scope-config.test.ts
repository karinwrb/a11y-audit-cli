import {
  getScopeConfig,
  setScopeConfig,
  resetScopeConfig,
  isScopeEnabled,
  getIncludePatterns,
  getExcludePatterns,
  getMaxDepth,
} from './scope-config';

beforeEach(() => resetScopeConfig());

describe('getScopeConfig', () => {
  it('returns defaults', () => {
    const config = getScopeConfig();
    expect(config.enabled).toBe(false);
    expect(config.includePatterns).toEqual([]);
    expect(config.excludePatterns).toEqual([]);
    expect(config.maxDepth).toBe(0);
  });
});

describe('setScopeConfig', () => {
  it('updates partial config', () => {
    setScopeConfig({ enabled: true, maxDepth: 3 });
    expect(isScopeEnabled()).toBe(true);
    expect(getMaxDepth()).toBe(3);
  });

  it('does not overwrite unset fields', () => {
    setScopeConfig({ includePatterns: ['https://example.com/*'] });
    expect(getExcludePatterns()).toEqual([]);
  });
});

describe('resetScopeConfig', () => {
  it('restores defaults', () => {
    setScopeConfig({ enabled: true, maxDepth: 5, includePatterns: ['*'] });
    resetScopeConfig();
    expect(isScopeEnabled()).toBe(false);
    expect(getMaxDepth()).toBe(0);
    expect(getIncludePatterns()).toEqual([]);
  });
});

describe('accessors', () => {
  it('getIncludePatterns returns copy', () => {
    setScopeConfig({ includePatterns: ['https://a.com/*'] });
    const patterns = getIncludePatterns();
    patterns.push('extra');
    expect(getIncludePatterns()).toHaveLength(1);
  });

  it('getExcludePatterns returns copy', () => {
    setScopeConfig({ excludePatterns: ['https://b.com/*'] });
    const patterns = getExcludePatterns();
    patterns.push('extra');
    expect(getExcludePatterns()).toHaveLength(1);
  });
});
