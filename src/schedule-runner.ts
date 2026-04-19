import { getScheduleConfig } from './schedule-config';

export interface ScheduledJob {
  cron: string;
  timezone: string;
  handler: () => Promise<void>;
  timer?: NodeJS.Timeout;
}

export function parseCronToMs(cron: string): number {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error(`Invalid cron expression: ${cron}`);
  const minute = parts[0];
  if (minute === '*') return 60_000;
  if (minute.startsWith('*/')) return parseInt(minute.slice(2), 10) * 60_000;
  return 60 * 60_000; // default hourly
}

export function createScheduledJob(
  handler: () => Promise<void>
): ScheduledJob {
  const cfg = getScheduleConfig();
  return { cron: cfg.cron, timezone: cfg.timezone, handler };
}

export function startJob(job: ScheduledJob): ScheduledJob {
  const intervalMs = parseCronToMs(job.cron);
  job.timer = setInterval(async () => {
    try {
      await job.handler();
    } catch (err) {
      console.error('[schedule] job error:', err);
    }
  }, intervalMs);
  return job;
}

export function stopJob(job: ScheduledJob): void {
  if (job.timer) {
    clearInterval(job.timer);
    job.timer = undefined;
  }
}
