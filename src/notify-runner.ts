import https from 'https';
import http from 'http';
import { AuditReport } from './types';
import { getNotifyConfig, isNotifyEnabled } from './notify-config';

export interface NotifyPayload {
  event: 'complete' | 'failure';
  url: string;
  score: number;
  violationCount: number;
  timestamp: string;
}

export function buildPayload(event: 'complete' | 'failure', report: AuditReport): NotifyPayload {
  return {
    event,
    url: report.url,
    score: report.score,
    violationCount: report.results.filter(r => r.violations.length > 0).length,
    timestamp: new Date().toISOString(),
  };
}

export function sendWebhook(webhookUrl: string, payload: NotifyPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const parsed = new URL(webhookUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(
      { hostname: parsed.hostname, port: parsed.port, path: parsed.pathname, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      res => { res.resume(); res.on('end', resolve); }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export async function notify(event: 'complete' | 'failure', report: AuditReport): Promise<void> {
  if (!isNotifyEnabled()) return;
  const cfg = getNotifyConfig();
  if (event === 'complete' && !cfg.onComplete) return;
  if (event === 'failure' && !cfg.onFailure) return;
  if (!cfg.webhookUrl) return;
  const payload = buildPayload(event, report);
  await sendWebhook(cfg.webhookUrl, payload);
}
