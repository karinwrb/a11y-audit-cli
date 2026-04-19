import { checkThreshold, applyThreshold } from './threshold-runner';
import { setThresholdConfig, resetThresholdConfig } from './threshold-config';
import { AuditReport } from './types';

const makeReport = (score: number, hasViolations = false): AuditReport => ({
  url: 'https://example.com',
  score,
  timestamp: new Date().toISOString(),
  results: hasViolations
    ? [{ ruleId: 'r1', description: 'd', violations: [{ id: 'v1', impact: 'critical', description: 'x', nodes: [], fixSuggestion: '' }] }]
    : [],
});

beforeEach(() => resetThresholdConfig());

test('passes when threshold disabled', () => {
  const result = checkThreshold(makeReport(10));
  expect(result.passed).toBe(true);
});

test('fails when score below minScore', () => {
  setThresholdConfig({ enabled: true, minScore: 80 });
  const result = checkThreshold(makeReport(70));
  expect(result.passed).toBe(false);
  expect(result.reasons[0]).toMatch(/below minimum threshold/);
});

test('passes when score meets minScore', () => {
  setThresholdConfig({ enabled: true, minScore: 80 });
  const result = checkThreshold(makeReport(85));
  expect(result.passed).toBe(true);
});

test('fails on violation when failOnViolation is true', () => {
  setThresholdConfig({ enabled: true, minScore: 0, failOnViolation: true });
  const result = checkThreshold(makeReport(100, true));
  expect(result.passed).toBe(false);
  expect(result.reasons[0]).toMatch(/failOnViolation/);
});

test('applyThreshold throws on failure', () => {
  setThresholdConfig({ enabled: true, minScore: 90 });
  expect(() => applyThreshold(makeReport(50))).toThrow('Threshold check failed');
});

test('applyThreshold does not throw on pass', () => {
  setThresholdConfig({ enabled: true, minScore: 80 });
  expect(() => applyThreshold(makeReport(95))).not.toThrow();
});
