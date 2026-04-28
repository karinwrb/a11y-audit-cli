import {
  applySeverityOverride,
  applySeverityOverrides,
  applyDefaultSeverity,
  applySeverityAndCount,
  formatSeverityOverrideSummary,
} from './severity-runner';
import { setSeverityConfig, resetSeverityConfig } from './severity-config';
import { AuditResult } from './types';

function makeResult(id: string, severity: AuditResult['severity'] = 'minor'): AuditResult {
  return {
    id,
    description: `Rule ${id}`,
    severity,
    url: 'https://example.com',
    fixSuggestion: 'Fix it',
    impact: severity,
    tags: [],
  };
}

afterEach(() => resetSeverityConfig());

describe('applySeverityOverride', () => {
  it('returns result unchanged when disabled', () => {
    const r = makeResult('rule-1', 'minor');
    expect(applySeverityOverride(r)).toEqual(r);
  });

  it('overrides severity when enabled and rule matches', () => {
    setSeverityConfig({ enabled: true, overrides: { 'rule-1': 'critical' } });
    const r = makeResult('rule-1', 'minor');
    const result = applySeverityOverride(r);
    expect(result.severity).toBe('critical');
  });

  it('does not override when rule not in overrides', () => {
    setSeverityConfig({ enabled: true, overrides: { 'rule-2': 'critical' } });
    const r = makeResult('rule-1', 'minor');
    expect(applySeverityOverride(r).severity).toBe('minor');
  });
});

describe('applySeverityOverrides', () => {
  it('returns results unchanged when disabled', () => {
    const results = [makeResult('rule-1'), makeResult('rule-2')];
    expect(applySeverityOverrides(results)).toEqual(results);
  });

  it('applies overrides to matching results', () => {
    setSeverityConfig({ enabled: true, overrides: { 'rule-1': 'serious' } });
    const results = [makeResult('rule-1', 'minor'), makeResult('rule-2', 'minor')];
    const updated = applySeverityOverrides(results);
    expect(updated[0].severity).toBe('serious');
    expect(updated[1].severity).toBe('minor');
  });
});

describe('applyDefaultSeverity', () => {
  it('fills in default severity when result has none', () => {
    setSeverityConfig({ enabled: true, defaultSeverity: 'moderate' });
    const r = { ...makeResult('rule-1'), severity: undefined as unknown as AuditResult['severity'] };
    const result = applyDefaultSeverity(r);
    expect(result.severity).toBe('moderate');
  });

  it('does not overwrite existing severity', () => {
    setSeverityConfig({ enabled: true, defaultSeverity: 'moderate' });
    const r = makeResult('rule-1', 'critical');
    expect(applyDefaultSeverity(r).severity).toBe('critical');
  });
});

describe('applySeverityAndCount', () => {
  it('returns zero overridden when disabled', () => {
    const results = [makeResult('rule-1'), makeResult('rule-2')];
    const { overriddenCount } = applySeverityAndCount(results);
    expect(overriddenCount).toBe(0);
  });

  it('counts overridden results correctly', () => {
    setSeverityConfig({ enabled: true, overrides: { 'rule-1': 'critical', 'rule-2': 'serious' } });
    const results = [makeResult('rule-1'), makeResult('rule-2'), makeResult('rule-3')];
    const { overriddenCount, results: updated } = applySeverityAndCount(results);
    expect(overriddenCount).toBe(2);
    expect(updated[0].severity).toBe('critical');
    expect(updated[2].severity).toBe('minor');
  });
});

describe('formatSeverityOverrideSummary', () => {
  it('formats summary string', () => {
    expect(formatSeverityOverrideSummary(3, 10)).toBe(
      'Severity overrides applied: 3 of 10 result(s) updated.'
    );
  });
});
