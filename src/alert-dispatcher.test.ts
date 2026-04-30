import { dispatchAlerts, shouldAbortOnAlerts } from './alert-dispatcher';
import { setAlertConfig, resetAlertConfig } from './alert-config';
import { AuditResult } from './types';
import * as notifyRunner from './notify-runner';

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    url: 'https://example.com',
    score: 95,
    violations: [],
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => resetAlertConfig());

describe('dispatchAlerts', () => {
  it('returns zero dispatched when no alerts fire', async () => {
    setAlertConfig({ enabled: true, alertOnCritical: true, alertOnWarning: false });
    const result = await dispatchAlerts([makeResult()]);
    expect(result.dispatched).toBe(0);
    expect(result.webhookSent).toBe(false);
  });

  it('dispatches critical alerts and logs to console', async () => {
    setAlertConfig({ enabled: true, alertOnCritical: true, alertOnWarning: false, logToConsole: true });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const r = makeResult({
      violations: [{ ruleId: 'r1', severity: 'critical', message: 'bad', selector: 'img', fix: 'add alt' }],
    });
    const result = await dispatchAlerts([r]);
    expect(result.dispatched).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[ALERT:CRITICAL]'));
    warnSpy.mockRestore();
  });

  it('sends webhook when webhookUrl is configured', async () => {
    const sendSpy = jest.spyOn(notifyRunner, 'sendWebhook').mockResolvedValue(undefined);
    setAlertConfig({
      enabled: true,
      alertOnCritical: true,
      alertOnWarning: false,
      webhookUrl: 'https://hooks.example.com/alert',
      logToConsole: false,
    });
    const r = makeResult({
      violations: [{ ruleId: 'r2', severity: 'critical', message: 'err', selector: 'div', fix: '' }],
    });
    const result = await dispatchAlerts([r]);
    expect(result.webhookSent).toBe(true);
    expect(sendSpy).toHaveBeenCalledWith('https://hooks.example.com/alert', expect.objectContaining({ alertCount: 1 }));
    sendSpy.mockRestore();
  });

  it('does not throw when webhook fails', async () => {
    jest.spyOn(notifyRunner, 'sendWebhook').mockRejectedValue(new Error('network error'));
    setAlertConfig({ enabled: true, alertOnCritical: true, webhookUrl: 'https://bad.url', logToConsole: false });
    const r = makeResult({
      violations: [{ ruleId: 'r3', severity: 'critical', message: 'x', selector: 'a', fix: '' }],
    });
    await expect(dispatchAlerts([r])).resolves.not.toThrow();
  });
});

describe('shouldAbortOnAlerts', () => {
  it('returns false when abortOnAlert is not set', () => {
    setAlertConfig({ enabled: true, abortOnAlert: false });
    expect(shouldAbortOnAlerts([{ type: 'critical', message: 'm', url: 'u' }])).toBe(false);
  });

  it('returns true when abortOnAlert is set and events exist', () => {
    setAlertConfig({ enabled: true, abortOnAlert: true });
    expect(shouldAbortOnAlerts([{ type: 'critical', message: 'm', url: 'u' }])).toBe(true);
  });

  it('returns false when no events even if abortOnAlert is true', () => {
    setAlertConfig({ enabled: true, abortOnAlert: true });
    expect(shouldAbortOnAlerts([])).toBe(false);
  });
});
