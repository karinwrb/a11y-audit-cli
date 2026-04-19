import {
  getNotifyConfig,
  setNotifyConfig,
  resetNotifyConfig,
  isNotifyEnabled,
  getWebhookUrl,
  shouldNotifyOnComplete,
  shouldNotifyOnFailure,
} from './notify-config';

beforeEach(() => resetNotifyConfig());

test('defaults', () => {
  const cfg = getNotifyConfig();
  expect(cfg.enabled).toBe(false);
  expect(cfg.onComplete).toBe(false);
  expect(cfg.onFailure).toBe(true);
  expect(cfg.webhookUrl).toBeNull();
});

test('setNotifyConfig merges partial', () => {
  setNotifyConfig({ enabled: true, webhookUrl: 'https://example.com/hook' });
  expect(isNotifyEnabled()).toBe(true);
  expect(getWebhookUrl()).toBe('https://example.com/hook');
});

test('shouldNotifyOnComplete reflects config', () => {
  expect(shouldNotifyOnComplete()).toBe(false);
  setNotifyConfig({ onComplete: true });
  expect(shouldNotifyOnComplete()).toBe(true);
});

test('shouldNotifyOnFailure reflects config', () => {
  expect(shouldNotifyOnFailure()).toBe(true);
  setNotifyConfig({ onFailure: false });
  expect(shouldNotifyOnFailure()).toBe(false);
});

test('resetNotifyConfig restores defaults', () => {
  setNotifyConfig({ enabled: true, webhookUrl: 'https://x.com' });
  resetNotifyConfig();
  expect(isNotifyEnabled()).toBe(false);
  expect(getWebhookUrl()).toBeNull();
});
