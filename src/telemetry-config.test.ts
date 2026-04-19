import {
  getTelemetryConfig,
  setTelemetryConfig,
  resetTelemetryConfig,
  isTelemetryEnabled,
  getTelemetryEndpoint,
  isUrlIncluded,
} from './telemetry-config';

beforeEach(() => resetTelemetryConfig());

test('defaults are disabled with no endpoint', () => {
  expect(isTelemetryEnabled()).toBe(false);
  expect(getTelemetryEndpoint()).toBeNull();
  expect(isUrlIncluded()).toBe(false);
});

test('setTelemetryConfig updates fields', () => {
  setTelemetryConfig({ enabled: true, endpoint: 'https://telemetry.example.com' });
  expect(isTelemetryEnabled()).toBe(true);
  expect(getTelemetryEndpoint()).toBe('https://telemetry.example.com');
});

test('setTelemetryConfig is partial', () => {
  setTelemetryConfig({ enabled: true });
  setTelemetryConfig({ includeUrl: true });
  expect(isTelemetryEnabled()).toBe(true);
  expect(isUrlIncluded()).toBe(true);
});

test('resetTelemetryConfig restores defaults', () => {
  setTelemetryConfig({ enabled: true, endpoint: 'https://x.com', includeUrl: true });
  resetTelemetryConfig();
  const cfg = getTelemetryConfig();
  expect(cfg.enabled).toBe(false);
  expect(cfg.endpoint).toBeNull();
  expect(cfg.includeUrl).toBe(false);
});

test('getTelemetryConfig returns a copy', () => {
  const cfg = getTelemetryConfig();
  cfg.enabled = true;
  expect(isTelemetryEnabled()).toBe(false);
});
