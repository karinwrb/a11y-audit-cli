/**
 * Sampling runner — applies probabilistic sampling to a list of AuditResult.
 */

import { AuditResult } from './types';
import { getSamplingConfig, isSamplingEnabled } from './sampling-config';

/**
 * A simple seeded pseudo-random number generator (mulberry32).
 */
function createPrng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample results based on the configured rate.
 * Each result is independently included with probability `rate`.
 */
export function sampleResults(
  results: AuditResult[],
  overrideRate?: number,
  overrideSeed?: number
): AuditResult[] {
  const config = getSamplingConfig();
  const rate = overrideRate ?? config.rate;
  const seed = overrideSeed ?? config.seed;

  if (rate >= 1) return results;
  if (rate <= 0) return [];

  const rand = seed !== undefined ? createPrng(seed) : Math.random.bind(Math);
  return results.filter(() => rand() < rate);
}

/**
 * Sample results only when sampling is enabled in config.
 */
export function sampleIfEnabled(results: AuditResult[]): AuditResult[] {
  if (!isSamplingEnabled()) return results;
  return sampleResults(results);
}

export interface SampleCount {
  total: number;
  sampled: number;
  dropped: number;
}

/**
 * Sample results and return both the sampled array and count metadata.
 */
export function sampleAndCount(
  results: AuditResult[]
): { results: AuditResult[]; counts: SampleCount } {
  const sampled = sampleIfEnabled(results);
  return {
    results: sampled,
    counts: {
      total: results.length,
      sampled: sampled.length,
      dropped: results.length - sampled.length,
    },
  };
}

export function formatSampleSummary(counts: SampleCount): string {
  const pct = counts.total === 0
    ? '0%'
    : `${Math.round((counts.sampled / counts.total) * 100)}%`;
  return `Sampling: ${counts.sampled}/${counts.total} results kept (${pct}), ${counts.dropped} dropped`;
}
