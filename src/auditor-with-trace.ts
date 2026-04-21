import { isTraceEnabled, getTraceIdHeader } from './trace-config';
import { startTrace, finishTrace, formatTraceSummary } from './trace-runner';
import { AuditResult } from './types';

type AuditorFn = (url: string, headers?: Record<string, string>) => Promise<AuditResult[]>;

export function createTracingAuditor(
  auditor: AuditorFn,
  onTrace?: (summary: string) => void
): AuditorFn {
  return async function tracingAuditor(
    url: string,
    headers?: Record<string, string>
  ): Promise<AuditResult[]> {
    if (!isTraceEnabled()) {
      return auditor(url, headers);
    }

    const traceIdHeader = getTraceIdHeader();
    const ctx = startTrace(url, headers);

    const outgoingHeaders: Record<string, string> = {
      ...(headers ?? {}),
      [traceIdHeader]: ctx.traceId,
    };

    const results = await auditor(url, outgoingHeaders);
    const entry = finishTrace(ctx, results);
    const summary = formatTraceSummary(entry);

    if (onTrace) {
      onTrace(summary);
    }

    return results;
  };
}
