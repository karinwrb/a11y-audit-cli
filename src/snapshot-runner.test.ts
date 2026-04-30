import * as fs from 'fs';
import * as path from 'path';
import {
  resultToEntry,
  buildSnapshotPath,
  loadSnapshot,
  saveSnapshot,
  compareSnapshots,
  formatSnapshotSummary,
  SnapshotEntry,
} from './snapshot-runner';
import { setSnapshotConfig, resetSnapshotConfig } from './snapshot-config';
import { AuditResult } from './types';

const TMP_DIR = path.join(__dirname, '__tmp_snapshots__');

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    url: 'https://example.com',
    ruleId: 'color-contrast',
    severity: 'serious',
    message: 'Insufficient color contrast',
    fixSuggestion: 'Increase contrast ratio',
    ...overrides,
  };
}

beforeEach(() => {
  setSnapshotConfig({ enabled: true, snapshotDir: TMP_DIR, autoSave: false, compareOnRun: false });
});

afterEach(() => {
  resetSnapshotConfig();
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
});

describe('resultToEntry', () => {
  it('maps AuditResult to SnapshotEntry', () => {
    const result = makeResult();
    const entry = resultToEntry(result);
    expect(entry.url).toBe(result.url);
    expect(entry.ruleId).toBe(result.ruleId);
    expect(entry.severity).toBe(result.severity);
    expect(entry.message).toBe(result.message);
  });
});

describe('buildSnapshotPath', () => {
  it('sanitizes label and builds path under snapshotDir', () => {
    const p = buildSnapshotPath('my label/test');
    expect(p).toContain('my_label_test.json');
    expect(p).toContain(TMP_DIR);
  });
});

describe('saveSnapshot / loadSnapshot', () => {
  it('saves and loads results correctly', () => {
    const results = [makeResult(), makeResult({ ruleId: 'image-alt' })];
    saveSnapshot('test-label', results);
    const loaded = loadSnapshot('test-label');
    expect(loaded).toHaveLength(2);
    expect(loaded[0].ruleId).toBe('color-contrast');
    expect(loaded[1].ruleId).toBe('image-alt');
  });

  it('returns empty array when snapshot file does not exist', () => {
    const loaded = loadSnapshot('nonexistent');
    expect(loaded).toEqual([]);
  });
});

describe('compareSnapshots', () => {
  const prev: SnapshotEntry[] = [
    { url: 'https://a.com', ruleId: 'rule-1', severity: 'serious', message: 'm1' },
    { url: 'https://a.com', ruleId: 'rule-2', severity: 'minor', message: 'm2' },
  ];
  const curr: SnapshotEntry[] = [
    { url: 'https://a.com', ruleId: 'rule-1', severity: 'serious', message: 'm1' },
    { url: 'https://a.com', ruleId: 'rule-3', severity: 'critical', message: 'm3' },
  ];

  it('detects added, removed, and unchanged entries', () => {
    const result = compareSnapshots(prev, curr);
    expect(result.added).toHaveLength(1);
    expect(result.added[0].ruleId).toBe('rule-3');
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].ruleId).toBe('rule-2');
    expect(result.unchanged).toBe(1);
  });
});

describe('formatSnapshotSummary', () => {
  it('formats comparison into readable text', () => {
    const summary = formatSnapshotSummary({ added: [{} as any], removed: [], unchanged: 5 });
    expect(summary).toContain('+ 1 new violation(s)');
    expect(summary).toContain('- 0 resolved violation(s)');
    expect(summary).toContain('= 5 unchanged');
  });
});
