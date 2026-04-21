import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTraceConfig,
  setTraceConfig,
  resetTraceConfig,
  isTraceEnabled,
  isTimingsEnabled,
  isHeadersTraced,
  getTraceIdHeader,
} from './trace-config';

describe('trace-config', () => {
  beforeEach(() => resetTraceConfig());

  it('should return defaults', () => {
    const config = getTraceConfig();
    expect(config.enabled).toBe(false);
    expect(config.includeTimings).toBe(true);
    expect(config.includeHeaders).toBe(false);
    expect(config.traceIdHeader).toBe('X-Trace-Id');
  });

  it('should update config with setTraceConfig', () => {
    setTraceConfig({ enabled: true, traceIdHeader: 'X-Request-Id' });
    const config = getTraceConfig();
    expect(config.enabled).toBe(true);
    expect(config.traceIdHeader).toBe('X-Request-Id');
    expect(config.includeTimings).toBe(true);
  });

  it('should reset to defaults', () => {
    setTraceConfig({ enabled: true, includeHeaders: true });
    resetTraceConfig();
    expect(isTraceEnabled()).toBe(false);
    expect(isHeadersTraced()).toBe(false);
  });

  it('isTraceEnabled should reflect enabled flag', () => {
    expect(isTraceEnabled()).toBe(false);
    setTraceConfig({ enabled: true });
    expect(isTraceEnabled()).toBe(true);
  });

  it('isTimingsEnabled should reflect includeTimings flag', () => {
    expect(isTimingsEnabled()).toBe(true);
    setTraceConfig({ includeTimings: false });
    expect(isTimingsEnabled()).toBe(false);
  });

  it('isHeadersTraced should reflect includeHeaders flag', () => {
    expect(isHeadersTraced()).toBe(false);
    setTraceConfig({ includeHeaders: true });
    expect(isHeadersTraced()).toBe(true);
  });

  it('getTraceIdHeader should return custom header name', () => {
    setTraceConfig({ traceIdHeader: 'X-Custom-Trace' });
    expect(getTraceIdHeader()).toBe('X-Custom-Trace');
  });

  it('getTraceConfig should return a copy, not a reference', () => {
    const config = getTraceConfig();
    config.enabled = true;
    expect(isTraceEnabled()).toBe(false);
  });
});
