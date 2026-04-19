import { getTelemetryConfig, isTelemetryEnabled, getTelemetryEndpoint } from './telemetry-config';
import { AuditReport } from './types';

export interface TelemetryEvent {
  event: string;
  timestamp: string;
  url: string;
  score: number;
  violationCount: number;
  durationMs?: number;
}

export function buildTelemetryEvent(
  report: AuditReport,
  durationMs?: number
): TelemetryEvent {
  return {
    event: 'audit_complete',
    timestamp: new Date().toISOString(),
    url: report.url,
    score: report.score,
    violationCount: report.results.length,
    ...(durationMs !== undefined ? { durationMs } : {}),
  };
}

export async function sendTelemetry(
  event: TelemetryEvent
): Promise<boolean> {
  if (!isTelemetryEnabled()) return false;

  const endpoint = getTelemetryEndpoint();
  if (!endpoint) return false;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function trackAudit(
  report: AuditReport,
  durationMs?: number
): Promise<void> {
  const config = getTelemetryConfig();
  if (!config.enabled) return;

  const event = buildTelemetryEvent(report, durationMs);
  await sendTelemetry(event);
}
