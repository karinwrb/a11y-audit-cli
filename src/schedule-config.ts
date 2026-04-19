export interface ScheduleConfig {
  enabled: boolean;
  cron: string;
  timezone: string;
}

const DEFAULT: ScheduleConfig = {
  enabled: false,
  cron: '0 * * * *',
  timezone: 'UTC',
};

let current: ScheduleConfig = { ...DEFAULT };

export function getScheduleConfig(): ScheduleConfig {
  return { ...current };
}

export function setScheduleConfig(cfg: Partial<ScheduleConfig>): void {
  current = { ...current, ...cfg };
}

export function resetScheduleConfig(): void {
  current = { ...DEFAULT };
}

export function isScheduleEnabled(): boolean {
  return current.enabled;
}

export function getCron(): string {
  return current.cron;
}

export function getTimezone(): string {
  return current.timezone;
}
