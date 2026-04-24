import * as os from 'os';
import { AuditResult } from './types';
import {
  isEnrichEnabled,
  isTimestampEnabled,
  isHostnameEnabled,
  getUserAgent,
} from './enrich-config';

export interface EnrichedAuditResult extends AuditResult {
  meta?: {
    timestamp?: string;
    hostname?: string;
    userAgent?: string;
  };
}

export function buildEnrichMeta(): Record<string, string> {
  const meta: Record<string, string> = {};

  if (isTimestampEnabled()) {
    meta.timestamp = new Date().toISOString();
  }

  if (isHostnameEnabled()) {
    meta.hostname = os.hostname();
  }

  const ua = getUserAgent();
  if (ua) {
    meta.userAgent = ua;
  }

  return meta;
}

export function enrichResult(result: AuditResult): EnrichedAuditResult {
  if (!isEnrichEnabled()) {
    return result;
  }

  const meta = buildEnrichMeta();
  return { ...result, meta };
}

export function enrichResults(results: AuditResult[]): EnrichedAuditResult[] {
  if (!isEnrichEnabled()) {
    return results;
  }

  // Build meta once and apply to all results for consistency
  const meta = buildEnrichMeta();
  return results.map((result) => ({ ...result, meta }));
}

export function enrichAndCount(
  results: AuditResult[]
): { results: EnrichedAuditResult[]; enriched: number } {
  if (!isEnrichEnabled()) {
    return { results, enriched: 0 };
  }

  const enriched = enrichResults(results);
  return { results: enriched, enriched: enriched.length };
}
