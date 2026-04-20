import fs from 'fs';
import { diffResults, loadSnapshot, saveSnapshot, formatDiffSummary } from './diff-runner';
import { resetDiffConfig, setDiffConfig } from './diff-config';
import { AuditResult } from './types';

const SNAP = '.test-snapshot.json';

function makeResult(ruleId: string, url = 'https://example.com', target = ''): AuditResult {
  return { ruleId, url, target, severity: 'critical', message: 'test', passed: false };
}

beforeEach(() => {
  resetDiffConfig();
  setDiffConfig({ snapshotFile: SNAP });
  if (fs.existsSync(SNAP)) fs.unlinkSync(SNAP);
});

afterEach(() => {
  if (fs.existsSync(SNAP)) fs.unlinkSync(SNAP);
});

describe('diffResults', () => {
  it('identifies new violations', () => {
    const prev = [makeResult('rule-a')];
    const curr = [makeResult('rule-a'), makeResult('rule-b')];
    const { newViolations } = diffResults(curr, prev);
    expect(newViolations).toHaveLength(1);
    expect(newViolations[0].ruleId).toBe('rule-b');
  });

  it('identifies resolved violations', () => {
    const prev = [makeResult('rule-a'), makeResult('rule-b')];
    const curr = [makeResult('rule-a')];
    const { resolvedViolations } = diffResults(curr, prev);
    expect(resolvedViolations).toHaveLength(1);
    expect(resolvedViolations[0].ruleId).toBe('rule-b');
  });

  it('identifies persisting violations', () => {
    const prev = [makeResult('rule-a')];
    const curr = [makeResult('rule-a')];
    const { persistingViolations } = diffResults(curr, prev);
    expect(persistingViolations).toHaveLength(1);
  });

  it('returns empty arrays when no previous results', () => {
    const curr = [makeResult('rule-a')];
    const diff = diffResults(curr, []);
    expect(diff.newViolations).toHaveLength(1);
    expect(diff.resolvedViolations).toHaveLength(0);
    expect(diff.persistingViolations).toHaveLength(0);
  });
});

describe('snapshot I/O', () => {
  it('returns empty array when snapshot missing', () => {
    expect(loadSnapshot()).toEqual([]);
  });

  it('round-trips results through snapshot file', () => {
    const results = [makeResult('rule-x')];
    saveSnapshot(results);
    const loaded = loadSnapshot();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].ruleId).toBe('rule-x');
  });
});

describe('formatDiffSummary', () => {
  it('includes counts in output', () => {
    const diff = {
      newViolations: [makeResult('rule-new')],
      resolvedViolations: [],
      persistingViolations: [makeResult('rule-old')],
    };
    const text = formatDiffSummary(diff);
    expect(text).toContain('New violations      : 1');
    expect(text).toContain('Resolved violations : 0');
    expect(text).toContain('rule-new');
  });
});
