import fs from 'fs';
import path from 'path';
import { AuditResult } from './types';
import { getBaselineFile, shouldUpdateBaseline } from './baseline-config';

export type BaselineMap = Record<string, string[]>;

export function loadBaseline(): BaselineMap {
  const file = getBaselineFile();
  if (!fs.existsSync(file)) return {};
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as BaselineMap;
  } catch {
    return {};
  }
}

export function saveBaseline(baseline: BaselineMap): void {
  const file = getBaselineFile();
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(baseline, null, 2), 'utf-8');
}

export function buildBaselineKey(url: string, ruleId: string): string {
  return `${url}::${ruleId}`;
}

export function isBaselined(baseline: BaselineMap, url: string, ruleId: string): boolean {
  const key = buildBaselineKey(url, ruleId);
  return Array.isArray(baseline[key]);
}

export function filterBaselined(results: AuditResult[], url: string, baseline: BaselineMap): AuditResult[] {
  return results.filter(r => !isBaselined(baseline, url, r.ruleId));
}

export function updateBaseline(results: AuditResult[], url: string, baseline: BaselineMap): BaselineMap {
  const updated = { ...baseline };
  for (const r of results) {
    const key = buildBaselineKey(url, r.ruleId);
    updated[key] = [r.ruleId];
  }
  return updated;
}

export function applyBaseline(results: AuditResult[], url: string): AuditResult[] {
  const baseline = loadBaseline();
  if (shouldUpdateBaseline()) {
    const updated = updateBaseline(results, url, baseline);
    saveBaseline(updated);
    return results;
  }
  return filterBaselined(results, url, baseline);
}
