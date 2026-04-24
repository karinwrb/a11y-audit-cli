import {
  getTransformConfig,
  setTransformConfig,
  resetTransformConfig,
  isTransformEnabled,
  isStripHtml,
  isNormalizeWhitespace,
  getTruncateLength,
} from './transform-config';

beforeEach(() => {
  resetTransformConfig();
});

test('default config is disabled', () => {
  expect(isTransformEnabled()).toBe(false);
});

test('default stripHtml is false', () => {
  expect(isStripHtml()).toBe(false);
});

test('default normalizeWhitespace is false', () => {
  expect(isNormalizeWhitespace()).toBe(false);
});

test('default truncateLength is null', () => {
  expect(getTruncateLength()).toBeNull();
});

test('setTransformConfig enables transform', () => {
  setTransformConfig({ enabled: true });
  expect(isTransformEnabled()).toBe(true);
});

test('setTransformConfig sets stripHtml', () => {
  setTransformConfig({ stripHtml: true });
  expect(isStripHtml()).toBe(true);
});

test('setTransformConfig sets truncateLength', () => {
  setTransformConfig({ truncateLength: 80 });
  expect(getTruncateLength()).toBe(80);
});

test('setTransformConfig does partial update', () => {
  setTransformConfig({ enabled: true, normalizeWhitespace: true });
  const config = getTransformConfig();
  expect(config.enabled).toBe(true);
  expect(config.normalizeWhitespace).toBe(true);
  expect(config.stripHtml).toBe(false);
});

test('resetTransformConfig restores defaults', () => {
  setTransformConfig({ enabled: true, truncateLength: 50 });
  resetTransformConfig();
  expect(isTransformEnabled()).toBe(false);
  expect(getTruncateLength()).toBeNull();
});

test('getTransformConfig returns a copy', () => {
  const config = getTransformConfig();
  config.enabled = true;
  expect(isTransformEnabled()).toBe(false);
});
