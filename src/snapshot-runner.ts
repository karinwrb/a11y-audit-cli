import * as fs from 'fs';
import * as path from 'path';
import { AuditResult } from './types';
import { getSnapshotConfig } from './snapshot-config';

export interface SnapshotEntry {
  url: string;
  ruleId: string;
  severity: string;
  message: string;
}

export function resultToEntry(result: AuditResult): SnapshotEntry {
  return {
    url: result.url,
    ruleId: result.ruleId,
    severity: result.severity,
    message: result.message,
  };
}

export function buildSnapshotPath(label: string): string {
  const { snapshotDir } = getSnapshotConfig();
  const safe = label.replace(/[^a-z0-9_-]/gi, '_');
  return path.join(snapshotDir, `${safe}.json`);
}

export function loadSnapshot(label: string): SnapshotEntry[] {
  const filePath = buildSnapshotPath(label);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as SnapshotEntry[];
  } catch {
    return [];
  }
}

export function saveSnapshot(label: string, results: AuditResult[]): void {
  const { snapshotDir } = getSnapshotConfig();
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }
  const entries = results.map(resultToEntry);
  const filePath = buildSnapshotPath(label);
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
}

export interface SnapshotComparison {
  added: SnapshotEntry[];
  removed: SnapshotEntry[];
  unchanged: number;
}

function entryKey(e: SnapshotEntry): string {
  return `${e.url}::${e.ruleId}::${e.severity}`;
}

export function compareSnapshots(
  previous: SnapshotEntry[],
  current: SnapshotEntry[]
): SnapshotComparison {
  const prevKeys = new Set(previous.map(entryKey));
  const currKeys = new Set(current.map(entryKey));
  const added = current.filter((e) => !prevKeys.has(entryKey(e)));
  const removed = previous.filter((e) => !currKeys.has(entryKey(e)));
  const unchanged = current.filter((e) => prevKeys.has(entryKey(e))).length;
  return { added, removed, unchanged };
}

export function formatSnapshotSummary(comparison: SnapshotComparison): string {
  const { added, removed, unchanged } = comparison;
  return [
    `Snapshot comparison:`,
    `  + ${added.length} new violation(s)`,
    `  - ${removed.length} resolved violation(s)`,
    `  = ${unchanged} unchanged`,
  ].join('\n');
}
