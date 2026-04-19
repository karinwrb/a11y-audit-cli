import fs from 'fs';
import { filterBaselined, updateBaseline, buildBaselineKey, isBaselined, applyBaseline } from './baseline-runner';
import { resetBaselineConfig, setBaselineConfig } from './baseline-config';
import { AuditResult } from './types';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

function makeResult(ruleId: string): AuditResult {
  return { ruleId, description: 'test', severity: 'moderate', impact: 'moderate', url: 'http://x.com', suggestion: '', passed: false };
}

beforeEach(() => {
  resetBaselineConfig();
  jest.clearAllMocks();
});

describe('buildBaselineKey', () => {
  it('combines url and ruleId', () => {
    expect(buildBaselineKey('http://a.com', 'color-contrast')).toBe('http://a.com::color-contrast');
  });
});

describe('isBaselined', () => {
  it('returns true when key exists', () => {
    const baseline = { 'http://a.com::rule1': ['rule1'] };
    expect(isBaselined(baseline, 'http://a.com', 'rule1')).toBe(true);
  });
  it('returns false when key missing', () => {
    expect(isBaselined({}, 'http://a.com', 'rule1')).toBe(false);
  });
});

describe('filterBaselined', () => {
  it('removes baselined results', () => {
    const baseline = { 'http://x.com::rule1': ['rule1'] };
    const results = [makeResult('rule1'), makeResult('rule2')];
    const filtered = filterBaselined(results, 'http://x.com', baseline);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].ruleId).toBe('rule2');
  });
});

describe('updateBaseline', () => {
  it('adds new entries to baseline', () => {
    const results = [makeResult('rule1')];
    const updated = updateBaseline(results, 'http://x.com', {});
    expect(updated['http://x.com::rule1']).toEqual(['rule1']);
  });
});

describe('applyBaseline', () => {
  it('filters results when baseline exists and update is false', () => {
    setBaselineConfig({ enabled: true, baselineFile: '.baseline.json', updateBaseline: false });
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ 'http://x.com::rule1': ['rule1'] }));
    const results = [makeResult('rule1'), makeResult('rule2')];
    const out = applyBaseline(results, 'http://x.com');
    expect(out).toHaveLength(1);
    expect(out[0].ruleId).toBe('rule2');
  });
});
