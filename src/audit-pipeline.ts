/**
 * audit-pipeline.ts
 *
 * Orchestrates the full audit pipeline: from URL input through scanning,
 * filtering, enriching, deduplication, severity overrides, scope filtering,
 * tag filtering, baseline suppression, and final threshold checks.
 *
 * This is the central composition point that wires together all the
 * individual runners into a single cohesive execution flow.
 */

import { AuditResult, AuditReport } from './types';
import { runRules } from './rules';
import { violationsToAuditResults, calculateScore } from './scanner';
import { filterAndCount } from './filter-runner';
import { filterIgnoredAndCount } from './ignore-runner';
import { filterBaselined } from './baseline-runner';
import { dedupeAndCount } from './dedupe-runner';
import { enrichAndCount } from './enrich-runner';
import { applySeverityAndCount } from './severity-runner';
import { filterByTagsAndCount } from './tag-runner';
import { filterByScope } from './scope-runner';
import { sampleIfEnabled } from './sampling-runner';
import { applyThreshold } from './threshold-runner';
import { isBaselineEnabled } from './baseline-config';
import { isDedupeEnabled } from './dedup-config';
import { isSamplingEnabled } from './sampling-config';

export interface PipelineOptions {
  url: string;
  /** Optional label to attach to every result in this run */
  label?: string;
}

export interface PipelineResult {
  report: AuditReport;
  /** Whether the run passed the configured score threshold */
  passed: boolean;
  /** Human-readable summary of each pipeline stage's effect */
  stageLog: string[];
}

/**
 * Runs the full audit pipeline for a single URL.
 *
 * Stages (in order):
 *  1. Scan – run axe rules via Playwright
 *  2. Scope filter – drop URLs outside configured patterns / depth
 *  3. Severity override – remap rule severities per config
 *  4. Tag filter – keep only results matching configured tags
 *  5. Ignore filter – drop explicitly ignored rule IDs / URLs
 *  6. Baseline suppression – drop results already in the baseline
 *  7. Deduplication – collapse identical violations
 *  8. Enrich – attach metadata (timestamp, run-id, label, …)
 *  9. Min-severity filter – drop results below configured threshold
 * 10. Sampling – probabilistic down-sampling when enabled
 * 11. Score calculation & threshold check
 */
export async function runAuditPipeline(
  options: PipelineOptions
): Promise<PipelineResult> {
  const { url } = options;
  const stageLog: string[] = [];

  // Stage 1 – Scan
  const violations = await runRules(url);
  let results: AuditResult[] = violationsToAuditResults(violations, url);
  stageLog.push(`scan: ${results.length} raw violations`);

  // Stage 2 – Scope filter
  const scoped = filterByScope(results);
  stageLog.push(`scope: ${results.length} → ${scoped.length}`);
  results = scoped;

  // Stage 3 – Severity overrides
  const { results: withSeverity, overrideCount } = applySeverityAndCount(results);
  stageLog.push(`severity-override: ${overrideCount} overrides applied`);
  results = withSeverity;

  // Stage 4 – Tag filter
  const { results: tagged, removed: tagRemoved } = filterByTagsAndCount(results);
  stageLog.push(`tag-filter: removed ${tagRemoved}`);
  results = tagged;

  // Stage 5 – Ignore filter
  const { results: notIgnored, ignoredCount } = filterIgnoredAndCount(results);
  stageLog.push(`ignore: suppressed ${ignoredCount}`);
  results = notIgnored;

  // Stage 6 – Baseline suppression
  if (isBaselineEnabled()) {
    const beforeBaseline = results.length;
    results = filterBaselined(results);
    stageLog.push(`baseline: suppressed ${beforeBaseline - results.length}`);
  }

  // Stage 7 – Deduplication
  if (isDedupeEnabled()) {
    const { results: deduped, duplicateCount } = dedupeAndCount(results);
    stageLog.push(`dedupe: removed ${duplicateCount} duplicates`);
    results = deduped;
  }

  // Stage 8 – Enrich
  const { results: enriched, enrichedCount } = enrichAndCount(results);
  stageLog.push(`enrich: enriched ${enrichedCount}`);
  results = enriched;

  // Stage 9 – Min-severity filter
  const { results: filtered, removedCount } = filterAndCount(results);
  stageLog.push(`min-severity: removed ${removedCount}`);
  results = filtered;

  // Stage 10 – Sampling
  if (isSamplingEnabled()) {
    const sampled = sampleIfEnabled(results);
    stageLog.push(`sampling: ${results.length} → ${sampled.length}`);
    results = sampled;
  }

  // Stage 11 – Score & threshold
  const score = calculateScore(results);
  const report: AuditReport = {
    url,
    score,
    results,
    generatedAt: new Date().toISOString(),
  };

  const { passed } = applyThreshold(report);
  stageLog.push(`threshold: score=${score} passed=${passed}`);

  return { report, passed, stageLog };
}
