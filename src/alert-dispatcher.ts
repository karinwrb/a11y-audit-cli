import { AlertEvent, buildAlertEvents, hasAlertEvents } from './alert-runner';
import { getAlertConfig } from './alert-config';
import { AuditResult } from './types';
import { sendWebhook } from './notify-runner';

export interface DispatchResult {
  dispatched: number;
  events: AlertEvent[];
  webhookSent: boolean;
}

export async function dispatchAlerts(results: AuditResult[]): Promise<DispatchResult> {
  const config = getAlertConfig();
  const events = buildAlertEvents(results);

  if (!hasAlertEvents(events)) {
    return { dispatched: 0, events: [], webhookSent: false };
  }

  let webhookSent = false;

  if (config.webhookUrl) {
    const payload = {
      tool: 'a11y-audit-cli',
      alertCount: events.length,
      alerts: events.map(e => ({ type: e.type, message: e.message, url: e.url })),
      timestamp: new Date().toISOString(),
    };
    try {
      await sendWebhook(config.webhookUrl, payload);
      webhookSent = true;
    } catch {
      // non-fatal: log and continue
      console.warn('[alert-dispatcher] Failed to send webhook');
    }
  }

  if (config.logToConsole !== false) {
    for (const event of events) {
      console.warn(`[ALERT:${event.type.toUpperCase()}] ${event.message}`);
    }
  }

  return { dispatched: events.length, events, webhookSent };
}

export function shouldAbortOnAlerts(events: AlertEvent[]): boolean {
  const config = getAlertConfig();
  if (!config.abortOnAlert) return false;
  return hasAlertEvents(events);
}
