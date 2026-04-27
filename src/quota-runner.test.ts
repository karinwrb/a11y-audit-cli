import * as fs from 'fs';
import { setQuotaConfig, resetQuotaConfig } from './quota-config';
import {
  loadQuotaState,
  saveQuotaState,
  resetWindowsIfExpired,
  checkQuota,
  incrementQuota,
  resetQuotaState,
  QuotaState,
} from './quota-runner';

beforeEach(() => {
  resetQuotaConfig();
  setQuotaConfig({ enabled: true, maxRequestsPerHour: 5, maxRequestsPerDay: 10, storageKey: 'test-quota' });
  resetQuotaState();
});

afterEach(() => {
  resetQuotaConfig();
});

describe('resetWindowsIfExpired', () => {
  it('resets hourly count when hour window has passed', () => {
    const state: QuotaState = { hourlyCount: 3, dailyCount: 3, hourWindowStart: Date.now() - 3700 * 1000, dayWindowStart: Date.now() };
    const updated = resetWindowsIfExpired(state);
    expect(updated.hourlyCount).toBe(0);
    expect(updated.dailyCount).toBe(3);
  });

  it('resets daily count when day window has passed', () => {
    const state: QuotaState = { hourlyCount: 2, dailyCount: 8, hourWindowStart: Date.now(), dayWindowStart: Date.now() - 90000 * 1000 };
    const updated = resetWindowsIfExpired(state);
    expect(updated.dailyCount).toBe(0);
    expect(updated.hourlyCount).toBe(2);
  });

  it('does not reset when windows are still active', () => {
    const state: QuotaState = { hourlyCount: 2, dailyCount: 4, hourWindowStart: Date.now(), dayWindowStart: Date.now() };
    const updated = resetWindowsIfExpired(state);
    expect(updated.hourlyCount).toBe(2);
    expect(updated.dailyCount).toBe(4);
  });
});

describe('checkQuota', () => {
  it('allows requests when under quota', () => {
    const result = checkQuota();
    expect(result.allowed).toBe(true);
  });

  it('blocks when hourly quota exceeded', () => {
    for (let i = 0; i < 5; i++) incrementQuota();
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/hourly/i);
  });

  it('blocks when daily quota exceeded', () => {
    setQuotaConfig({ maxRequestsPerHour: 20, maxRequestsPerDay: 3 });
    for (let i = 0; i < 3; i++) incrementQuota();
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/daily/i);
  });

  it('allows all requests when quota is disabled', () => {
    setQuotaConfig({ enabled: false });
    for (let i = 0; i < 100; i++) incrementQuota();
    const result = checkQuota();
    expect(result.allowed).toBe(true);
  });
});

describe('incrementQuota', () => {
  it('increments both hourly and daily counts', () => {
    incrementQuota();
    incrementQuota();
    const state = loadQuotaState();
    expect(state.hourlyCount).toBe(2);
    expect(state.dailyCount).toBe(2);
  });
});
