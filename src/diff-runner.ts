/**
 * Diff runner — compares current AuditResult[] against a saved snapshot
 * and surfaces new, resolved, and persisting violations.
 */

import fs from 'fs';
import { AuditResult } from './types';
import { getSnapshotFile } from './diff-config';

export interface DiffReport {
  newViolations: AuditResult[];
  resolvedViolations: AuditResult[];
  persistingViolations: AuditResult[];
}

function resultKey(r: AuditResult): string {
  return `${r.url}::${r.ruleId}::${r.target ?? ''}`;
}

export function loadSnapshot(): AuditResult[] {
  const file = getSnapshotFile();
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as AuditResult[];
  } catch {
    return [];
  }
}

export function saveSnapshot(results: AuditResult[]): void {
  const file = getSnapshotFile();
  fs.writeFileSync(file, JSON.stringify(results, null, 2), 'utf-8');
}

export function diffResults(
  current: AuditResult[],
  previous: AuditResult[]
): DiffReport {
  const prevKeys = new Set(previous.map(resultKey));
  const currKeys = new Set(current.map(resultKey));

  const newViolations = current.filter((r) => !prevKeys.has(resultKey(r)));
  const resolvedViolations = previous.filter((r) => !currKeys.has(resultKey(r)));
  const persistingViolations = current.filter((r) => prevKeys.has(resultKey(r)));

  return { newViolations, resolvedViolations, persistingViolations };
}

export function formatDiffSummary(diff: DiffReport): string {
  const lines: string[] = [
    `Diff Summary:`,
    `  New violations      : ${diff.newViolations.length}`,
    `  Resolved violations : ${diff.resolvedViolations.length}`,
    `  Persisting          : ${diff.persistingViolations.length}`,
  ];
  if (diff.newViolations.length > 0) {
    lines.push('\nNew violations:');
    diff.newViolations.forEach((v) =>
      lines.push(`  [${v.severity}] ${v.ruleId} — ${v.url}`)
    );
  }
  return lines.join('\n');
}
