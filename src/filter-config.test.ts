import {
  getFilterConfig,
  setFilterConfig,
  resetFilterConfig,
  getMinSeverity,
  isIncompleteIncluded,
  getActiveRuleIds,
  meetsMinSeverity,
} from './filter-config';

beforeEach(() => {
  resetFilterConfig();
});

describe('getFilterConfig', () => {
  it('returns default config', () => {
    expect(getFilterConfig()).toEqual({
      minSeverity: 'minor',
      includeIncomplete: false,
      ruleIds: null,
    });
  });
});

describe('setFilterConfig', () => {
  it('updates minSeverity', () => {
    setFilterConfig({ minSeverity: 'serious' });
    expect(getMinSeverity()).toBe('serious');
  });

  it('updates includeIncomplete', () => {
    setFilterConfig({ includeIncomplete: true });
    expect(isIncompleteIncluded()).toBe(true);
  });

  it('updates ruleIds', () => {
    setFilterConfig({ ruleIds: ['color-contrast', 'label'] });
    expect(getActiveRuleIds()).toEqual(['color-contrast', 'label']);
  });

  it('does not mutate returned ruleIds array', () => {
    setFilterConfig({ ruleIds: ['aria-required-attr'] });
    const ids = getActiveRuleIds()!;
    ids.push('extra');
    expect(getActiveRuleIds()).toEqual(['aria-required-attr']);
  });
});

describe('meetsMinSeverity', () => {
  it('returns true when severity equals minSeverity', () => {
    setFilterConfig({ minSeverity: 'moderate' });
    expect(meetsMinSeverity('moderate')).toBe(true);
  });

  it('returns true when severity is above minSeverity', () => {
    setFilterConfig({ minSeverity: 'moderate' });
    expect(meetsMinSeverity('critical')).toBe(true);
  });

  it('returns false when severity is below minSeverity', () => {
    setFilterConfig({ minSeverity: 'serious' });
    expect(meetsMinSeverity('minor')).toBe(false);
  });
});

describe('resetFilterConfig', () => {
  it('restores defaults after changes', () => {
    setFilterConfig({ minSeverity: 'critical', includeIncomplete: true });
    resetFilterConfig();
    expect(getFilterConfig().minSeverity).toBe('minor');
    expect(getFilterConfig().includeIncomplete).toBe(false);
  });
});
