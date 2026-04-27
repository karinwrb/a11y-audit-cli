import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getQuotaConfig, isQuotaEnabled } from './quota-config';

export interface QuotaState {
  hourlyCount: number;
  dailyCount: number;
  hourWindowStart: number;
  dayWindowStart: number;
}

const QUOTA_DIR = path.join(os.tmpdir(), 'a11y-audit');

function getQuotaFilePath(): string {
  return path.join(QUOTA_DIR, `${getQuotaConfig().storageKey}.json`);
}

function ensureDir(): void {
  if (!fs.existsSync(QUOTA_DIR)) {
    fs.mkdirSync(QUOTA_DIR, { recursive: true });
  }
}

export function loadQuotaState(): QuotaState {
  ensureDir();
  const filePath = getQuotaFilePath();
  if (!fs.existsSync(filePath)) {
    return { hourlyCount: 0, dailyCount: 0, hourWindowStart: Date.now(), dayWindowStart: Date.now() };
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as QuotaState;
  } catch {
    return { hourlyCount: 0, dailyCount: 0, hourWindowStart: Date.now(), dayWindowStart: Date.now() };
  }
}

export function saveQuotaState(state: QuotaState): void {
  ensureDir();
  fs.writeFileSync(getQuotaFilePath(), JSON.stringify(state, null, 2), 'utf-8');
}

export function resetWindowsIfExpired(state: QuotaState, now: number = Date.now()): QuotaState {
  const updated = { ...state };
  if (now - updated.hourWindowStart >= 3600 * 1000) {
    updated.hourlyCount = 0;
    updated.hourWindowStart = now;
  }
  if (now - updated.dayWindowStart >= 86400 * 1000) {
    updated.dailyCount = 0;
    updated.dayWindowStart = now;
  }
  return updated;
}

export function checkQuota(): { allowed: boolean; reason?: string } {
  if (!isQuotaEnabled()) return { allowed: true };
  const config = getQuotaConfig();
  const state = resetWindowsIfExpired(loadQuotaState());
  if (state.hourlyCount >= config.maxRequestsPerHour) {
    return { allowed: false, reason: `Hourly quota exceeded (${config.maxRequestsPerHour} requests/hour)` };
  }
  if (state.dailyCount >= config.maxRequestsPerDay) {
    return { allowed: false, reason: `Daily quota exceeded (${config.maxRequestsPerDay} requests/day)` };
  }
  return { allowed: true };
}

export function incrementQuota(): void {
  if (!isQuotaEnabled()) return;
  const state = resetWindowsIfExpired(loadQuotaState());
  state.hourlyCount += 1;
  state.dailyCount += 1;
  saveQuotaState(state);
}

export function resetQuotaState(): void {
  const fresh: QuotaState = { hourlyCount: 0, dailyCount: 0, hourWindowStart: Date.now(), dayWindowStart: Date.now() };
  saveQuotaState(fresh);
}
