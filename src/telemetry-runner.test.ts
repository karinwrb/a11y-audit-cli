import { buildTelemetryEvent, sendTelemetry, trackAudit } from './telemetry-runner';
import { setTelemetryConfig, resetTelemetryConfig } from './telemetry-config';
import { AuditReport } from './types';

const makeReport = (overrides: Partial<AuditReport> = {}): AuditReport => ({
  url: 'https://example.com',
  score: 85,
  results: [],
  timestamp: new Date().toISOString(),
  ...overrides,
});

beforeEach(() => resetTelemetryConfig());

describe('buildTelemetryEvent', () => {
  it('builds event from report', () => {
    const report = makeReport({ score: 90, results: [{} as any, {} as any] });
    const event = buildTelemetryEvent(report, 123);
    expect(event.event).toBe('audit_complete');
    expect(event.url).toBe('https://example.com');
    expect(event.score).toBe(90);
    expect(event.violationCount).toBe(2);
    expect(event.durationMs).toBe(123);
  });

  it('omits durationMs when not provided', () => {
    const event = buildTelemetryEvent(makeReport());
    expect(event).not.toHaveProperty('durationMs');
  });
});

describe('sendTelemetry', () => {
  it('returns false when telemetry disabled', async () => {
    setTelemetryConfig({ enabled: false, endpoint: 'https://telemetry.example.com' });
    const result = await sendTelemetry({ event: 'audit_complete', timestamp: '', url: '', score: 0, violationCount: 0 });
    expect(result).toBe(false);
  });

  it('returns false when no endpoint', async () => {
    setTelemetryConfig({ enabled: true, endpoint: '' });
    const result = await sendTelemetry({ event: 'audit_complete', timestamp: '', url: '', score: 0, violationCount: 0 });
    expect(result).toBe(false);
  });

  it('returns false on fetch failure', async () => {
    setTelemetryConfig({ enabled: true, endpoint: 'https://telemetry.example.com' });
    global.fetch = jest.fn().mockRejectedValue(new Error('network'));
    const result = await sendTelemetry({ event: 'audit_complete', timestamp: '', url: '', score: 0, violationCount: 0 });
    expect(result).toBe(false);
  });
});

describe('trackAudit', () => {
  it('does nothing when disabled', async () => {
    setTelemetryConfig({ enabled: false, endpoint: 'https://telemetry.example.com' });
    global.fetch = jest.fn();
    await trackAudit(makeReport());
    expect(fetch).not.toHaveBeenCalled();
  });
});
