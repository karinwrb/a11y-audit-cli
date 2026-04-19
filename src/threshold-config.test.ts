import {
  getThresholdConfig,
  setThresholdConfig,
  resetThresholdConfig,
  isThresholdEnabled,
  getMinScore,
  isFailOnViolation,
} from './threshold-config';

beforeEach(() => resetThresholdConfig());

test('defaults are correct', () => {
  const cfg = getThresholdConfig();
  expect(cfg.enabled).toBe(false);
  expect(cfg.minScore).toBe(80);
  expect(cfg.failOnViolation).toBe(false);
});

test('setThresholdConfig updates fields', () => {
  setThresholdConfig({ enabled: true, minScore: 90 });
  expect(isThresholdEnabled()).toBe(true);
  expect(getMinScore()).toBe(90);
});

test('isFailOnViolation reflects config', () => {
  setThresholdConfig({ failOnVexpect(isFailOnViolation()).toBe(true);
});

test('resetThresholdConfig restores defaults', () => {
  setThresholdConfig({ enabled: true, minScore: 50 });
  resetThresholdConfig();
  expect(isThresholdEnabled()).toBe(false);
  expect(getMinScore()).toBe(80);
});
