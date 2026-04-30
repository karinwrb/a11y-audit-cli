import { AuditResult } from './types';
import { getAlertConfig } from './alert-config';

export interface AlertEvent {
  type: 'critical' | 'warning' | 'score_drop' | 'new_violation';
  message: string;
  url: string;
  ruleId?: string;
  score?: number;
}

export function buildAlertEvents(results: AuditResult[]): AlertEvent[] {
  const config = getAlertConfig();
  if (!config.enabled) return [];

  const events: AlertEvent[] = [];

  for (const result of results) {
    if (config.alertOnCritical) {
      const criticals = result.violations.filter(v => v.severity === 'critical');
      for (const v of criticals) {
        events.push({
          type: 'critical',
          message: `Critical violation: ${v.ruleId} on ${result.url}`,
          url: result.url,
          ruleId: v.ruleId,
        });
      }
    }

    if (config.alertOnWarning) {
      const warnings = result.violations.filter(v => v.severity === 'warning');
      for (const v of warnings) {
        events.push({
          type: 'warning',
          message: `Warning violation: ${v.ruleId} on ${result.url}`,
          url: result.url,
          ruleId: v.ruleId,
        });
      }
    }

    if (config.minScoreThreshold !== undefined && result.score < config.minScoreThreshold) {
      events.push({
        type: 'score_drop',
        message: `Score ${result.score} below threshold ${config.minScoreThreshold} for ${result.url}`,
        url: result.url,
        score: result.score,
      });
    }
  }

  return events;
}

export function formatAlertSummary(events: AlertEvent[]): string {
  if (events.length === 0) return 'No alerts triggered.';
  const lines = [`Alerts (${events.length}):`];
  for (const e of events) {
    lines.push(`  [${e.type.toUpperCase()}] ${e.message}`);
  }
  return lines.join('\n');
}

export function hasAlertEvents(events: AlertEvent[]): boolean {
  return events.length > 0;
}
