import { buildPayload, notify } from './notify-runner';
import { setNotifyConfig, resetNotifyConfig } from './notify-config';
import { AuditReport } from './types';

beforeEach(() => resetNotifyConfig());

const makeReport = (score = 80): AuditReport => ({
  url: 'https://example.com',
  score,
  timestamp: new Date().toISOString(),
  results: [
    { ruleId: 'img-alt', description: 'Missing alt', severity: 'critical', violations: [{ selector: 'img', message: 'no alt', suggestion: 'add alt' }] },
    { ruleId: 'lang', description: 'Lang attr', severity: 'minor', violations: [] },
  ],
});

test('buildPayload constructs correct shape', () => {
  const report = makeReport(75);
  const payload = buildPayload('complete', report);
  expect(payload.event).toBe('complete');
  expect(payload.url).toBe('https://example.com');
  expect(payload.score).toBe(75);
  expect(payload.violationCount).toBe(1);
  expect(typeof payload.timestamp).toBe('string');
});

test('notify does nothing when disabled', async () => {
  const report = makeReport();
  await expect(notify('failure', report)).resolves.toBeUndefined();
});

test('notify skips when event flag off', async () => {
  setNotifyConfig({ enabled: true, onFailure: false, webhookUrl: 'https://hook.example.com' });
  const report = makeReport();
  await expect(notify('failure', report)).resolves.toBeUndefined();
});

test('notify skips when no webhookUrl', async () => {
  setNotifyConfig({ enabled: true, onFailure: true, webhookUrl: null });
  const report = makeReport();
  await expect(notify('failure', report)).resolves.toBeUndefined();
});
