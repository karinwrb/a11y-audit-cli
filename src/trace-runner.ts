import { getTraceConfig } from './trace-config';
import { AuditResult } from './types';

export interface TraceEntry {
  traceId: string;
  url: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  headers?: Record<string, string>;
  resultCount: number;
}

export interface TraceContext {
  traceId: string;
  startTime: number;
  url: string;
  headers?: Record<string, string>;
}

export function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function startTrace(url: string, headers?: Record<string, string>): TraceContext {
  const config = getTraceConfig();
  return {
    traceId: generateTraceId(),
    startTime: Date.now(),
    url,
    headers: config.includeHeaders ? headers : undefined,
  };
}

export function finishTrace(
  ctx: TraceContext,
  results: AuditResult[]
): TraceEntry {
  const config = getTraceConfig();
  const finishedAt = new Date().toISOString();
  const startedAt = new Date(ctx.startTime).toISOString();
  const durationMs = Date.now() - ctx.startTime;

  const entry: TraceEntry = {
    traceId: ctx.traceId,
    url: ctx.url,
    startedAt,
    finishedAt,
    durationMs: config.includeTimings ? durationMs : 0,
    resultCount: results.length,
  };

  if (config.includeHeaders && ctx.headers) {
    entry.headers = ctx.headers;
  }

  return entry;
}

export function formatTraceSummary(entry: TraceEntry): string {
  const parts = [`[Trace ${entry.traceId}] ${entry.url}`];
  if (entry.durationMs > 0) {
    parts.push(`duration=${entry.durationMs}ms`);
  }
  parts.push(`results=${entry.resultCount}`);
  return parts.join(' | ');
}
