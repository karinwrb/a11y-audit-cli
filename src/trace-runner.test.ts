import { describe, it, expect, beforeEach } from 'vitest';
import { resetTraceConfig, setTraceConfig } from './trace-config';
import {
  startTrace,
  finishTrace,
  formatTraceSummary,
  generateTraceId,
} from './trace-runner';
import { AuditResult } from './types';

const makeResult = (id: string): AuditResult => ({
  ruleId: id,
  description: 'test',
  severity: 'minor',
  element: '<div>',
  suggestion: 'fix it',
});

describe('generateTraceId', () => {
  it('should generate unique ids', () => {
    const a = generateTraceId();
    const b = generateTraceId();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^trace-/);
  });
});

describe('startTrace', () => {
  beforeEach(() => resetTraceConfig());

  it('should create a trace context with url and traceId', () => {
    setTraceConfig({ enabled: true });
    const ctx = startTrace('https://example.com');
    expect(ctx.traceId).toMatch(/^trace-/);
    expect(ctx.url).toBe('https://example.com');
    expect(ctx.startTime).toBeGreaterThan(0);
  });

  it('should not include headers when includeHeaders is false', () => {
    setTraceConfig({ enabled: true, includeHeaders: false });
    const ctx = startTrace('https://example.com', { Authorization: 'Bearer x' });
    expect(ctx.headers).toBeUndefined();
  });

  it('should include headers when includeHeaders is true', () => {
    setTraceConfig({ enabled: true, includeHeaders: true });
    const ctx = startTrace('https://example.com', { Authorization: 'Bearer x' });
    expect(ctx.headers).toEqual({ Authorization: 'Bearer x' });
  });
});

describe('finishTrace', () => {
  beforeEach(() => resetTraceConfig());

  it('should produce a trace entry with result count', () => {
    setTraceConfig({ enabled: true, includeTimings: true });
    const ctx = startTrace('https://example.com');
    const entry = finishTrace(ctx, [makeResult('r1'), makeResult('r2')]);
    expect(entry.resultCount).toBe(2);
    expect(entry.url).toBe('https://example.com');
    expect(entry.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should set durationMs to 0 when timings disabled', () => {
    setTraceConfig({ enabled: true, includeTimings: false });
    const ctx = startTrace('https://example.com');
    const entry = finishTrace(ctx, []);
    expect(entry.durationMs).toBe(0);
  });
});

describe('formatTraceSummary', () => {
  it('should format a trace entry as a readable string', () => {
    const entry = {
      traceId: 'trace-abc',
      url: 'https://example.com',
      startedAt: '2024-01-01T00:00:00.000Z',
      finishedAt: '2024-01-01T00:00:01.000Z',
      durationMs: 1000,
      resultCount: 3,
    };
    const summary = formatTraceSummary(entry);
    expect(summary).toContain('trace-abc');
    expect(summary).toContain('https://example.com');
    expect(summary).toContain('duration=1000ms');
    expect(summary).toContain('results=3');
  });
});
