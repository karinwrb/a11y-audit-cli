import { buildAlertEvents, formatAlertSummary, hasAlertEvents, AlertEvent } from './alert-runner';
import { setAlertConfig, resetAlertConfig } from './alert-config';
import { AuditResult } from './types';

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    url: 'https://example.com',
    score: 90,
    violations: [],
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => resetAlertConfig());

describe('buildAlertEvents', () => {
  it('returns empty array when alerts disabled', () => {
    setAlertConfig({ enabled: false });
    const result = makeResult({ violations: [{ ruleId: 'r1', severity: 'critical', message: 'x', selector: '', fix: '' }] });
    expect(buildAlertEvents([result])).toEqual([]);
  });

  it('fires critical alert when alertOnCritical is true', () => {
    setAlertConfig({ enabled: true, alertOnCritical: true, alertOnWarning: false });
    const result = makeResult({
      violations: [{ ruleId: 'r1', severity: 'critical', message: 'bad', selector: 'h1', fix: 'fix it' }],
    });
    const events = buildAlertEvents([result]);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('critical');
    expect(events[0].ruleId).toBe('r1');
  });

  it('fires warning alert when alertOnWarning is true', () => {
    setAlertConfig({ enabled: true, alertOnCritical: false, alertOnWarning: true });
    const result = makeResult({
      violations: [{ ruleId: 'r2', severity: 'warning', message: 'warn', selector: 'p', fix: '' }],
    });
    const events = buildAlertEvents([result]);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('warning');
  });

  it('fires score_drop alert when score below threshold', () => {
    setAlertConfig({ enabled: true, alertOnCritical: false, alertOnWarning: false, minScoreThreshold: 80 });
    const result = makeResult({ score: 60 });
    const events = buildAlertEvents([result]);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('score_drop');
    expect(events[0].score).toBe(60);
  });

  it('does not fire score_drop when score meets threshold', () => {
    setAlertConfig({ enabled: true, alertOnCritical: false, alertOnWarning: false, minScoreThreshold: 80 });
    const result = makeResult({ score: 85 });
    expect(buildAlertEvents([result])).toHaveLength(0);
  });
});

describe('formatAlertSummary', () => {
  it('returns no-alerts message when empty', () => {
    expect(formatAlertSummary([])).toBe('No alerts triggered.');
  });

  it('lists all alert events', () => {
    const events: AlertEvent[] = [
      { type: 'critical', message: 'Critical issue', url: 'https://example.com', ruleId: 'r1' },
    ];
    const summary = formatAlertSummary(events);
    expect(summary).toContain('Alerts (1)');
    expect(summary).toContain('[CRITICAL]');
    expect(summary).toContain('Critical issue');
  });
});

describe('hasAlertEvents', () => {
  it('returns false for empty array', () => expect(hasAlertEvents([])).toBe(false));
  it('returns true when events present', () => {
    expect(hasAlertEvents([{ type: 'warning', message: 'm', url: 'u' }])).toBe(true);
  });
});
