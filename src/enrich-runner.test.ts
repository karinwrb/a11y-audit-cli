import * as os from 'os';
import {
  buildEnrichMeta,
  enrichResult,
  enrichResults,
  enrichAndCount,
} from './enrich-runner';
import {
  setEnrichConfig,
  resetEnrichConfig,
} from './enrich-config';
import { AuditResult } from './types';

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    ruleId: 'color-contrast',
    description: 'Elements must have sufficient color contrast',
    severity: 'serious',
    url: 'https://example.com',
    impact: 'serious',
    suggestion: 'Increase color contrast ratio',
    ...overrides,
  };
}

beforeEach(() => resetEnrichConfig());

describe('buildEnrichMeta', () => {
  it('includes timestamp when enabled', () => {
    setEnrichConfig({ enabled: true, addTimestamp: true });
    const meta = buildEnrichMeta();
    expect(meta.timestamp).toBeDefined();
    expect(new Date(meta.timestamp).toISOString()).toBe(meta.timestamp);
  });

  it('includes hostname when enabled', () => {
    setEnrichConfig({ enabled: true, addHostname: true });
    const meta = buildEnrichMeta();
    expect(meta.hostname).toBe(os.hostname());
  });

  it('includes userAgent when set', () => {
    setEnrichConfig({ enabled: true, addUserAgent: 'a11y-bot/1.0' });
    const meta = buildEnrichMeta();
    expect(meta.userAgent).toBe('a11y-bot/1.0');
  });

  it('omits userAgent when null', () => {
    setEnrichConfig({ enabled: true, addUserAgent: null });
    const meta = buildEnrichMeta();
    expect(meta.userAgent).toBeUndefined();
  });
});

describe('enrichResult', () => {
  it('returns result unchanged when enrichment disabled', () => {
    const result = makeResult();
    expect(enrichResult(result)).toEqual(result);
  });

  it('attaches meta when enabled', () => {
    setEnrichConfig({ enabled: true, addTimestamp: true, addHostname: false });
    const enriched = enrichResult(makeResult());
    expect(enriched.meta).toBeDefined();
    expect(enriched.meta?.timestamp).toBeDefined();
  });
});

describe('enrichResults', () => {
  it('returns original array when disabled', () => {
    const results = [makeResult(), makeResult()];
    expect(enrichResults(results)).toEqual(results);
  });

  it('applies consistent meta to all results', () => {
    setEnrichConfig({ enabled: true, addTimestamp: true });
    const results = [makeResult(), makeResult({ ruleId: 'image-alt' })];
    const enriched = enrichResults(results);
    expect(enriched[0].meta?.timestamp).toBe(enriched[1].meta?.timestamp);
  });
});

describe('enrichAndCount', () => {
  it('returns enriched 0 when disabled', () => {
    const { enriched } = enrichAndCount([makeResult()]);
    expect(enriched).toBe(0);
  });

  it('counts all enriched results', () => {
    setEnrichConfig({ enabled: true });
    const { enriched, results } = enrichAndCount([makeResult(), makeResult()]);
    expect(enriched).toBe(2);
    expect(results).toHaveLength(2);
  });
});
