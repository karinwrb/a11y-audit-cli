import { AuditResult } from './types';
import { getWatchlistConfig } from './watchlist-config';

export interface WatchlistDiff {
  url: string;
  newViolations: AuditResult[];
  removedViolations: AuditResult[];
  unchanged: AuditResult[];
}

export function buildViolationKey(result: AuditResult): string {
  return `${result.ruleId}::${result.target ?? ''}`;
}

export function diffWatchlist(
  previous: AuditResult[],
  current: AuditResult[],
  url: string
): WatchlistDiff {
  const prevKeys = new Map(previous.map((r) => [buildViolationKey(r), r]));
  const currKeys = new Map(current.map((r) => [buildViolationKey(r), r]));

  const newViolations = current.filter((r) => !prevKeys.has(buildViolationKey(r)));
  const removedViolations = previous.filter((r) => !currKeys.has(buildViolationKey(r)));
  const unchanged = current.filter((r) => prevKeys.has(buildViolationKey(r)));

  return { url, newViolations, removedViolations, unchanged };
}

export function isUrlWatched(url: string): boolean {
  const config = getWatchlistConfig();
  return config.enabled && config.urls.includes(url);
}

export function formatWatchlistDiff(diff: WatchlistDiff): string {
  const config = getWatchlistConfig();
  const lines: string[] = [`Watchlist diff for: ${diff.url}`];

  if (config.alertOnNewViolations && diff.newViolations.length > 0) {
    lines.push(`  🔴 New violations (${diff.newViolations.length}):`);
    diff.newViolations.forEach((r) => lines.push(`    - [${r.ruleId}] ${r.message}`));
  }

  if (config.alertOnRemovedViolations && diff.removedViolations.length > 0) {
    lines.push(`  ✅ Resolved violations (${diff.removedViolations.length}):`);
    diff.removedViolations.forEach((r) => lines.push(`    - [${r.ruleId}] ${r.message}`));
  }

  lines.push(`  ℹ️  Unchanged violations: ${diff.unchanged.length}`);
  return lines.join('\n');
}

export function hasAlerts(diff: WatchlistDiff): boolean {
  const config = getWatchlistConfig();
  return (
    (config.alertOnNewViolations && diff.newViolations.length > 0) ||
    (config.alertOnRemovedViolations && diff.removedViolations.length > 0)
  );
}
