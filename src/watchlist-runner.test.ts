import { AuditResult } from './types';
import {
  buildViolationKey,
  diffWatchlist,
  isUrlWatched,
  formatWatchlistDiff,
  hasAlerts,
} from './watchlist-runner';
import { resetWatchlistConfig, setWatchlistConfig } from './watchlist-config';

beforeEach(() => resetWatchlistConfig());

function makeResult(ruleId: string, target = ''): AuditResult {
  return { ruleId, message: `Issue: ${ruleId}`, severity: 'moderate', target, url: 'https://example.com' } as AuditResult;
}

describe('buildViolationKey', () => {
  it('builds key from ruleId and target', () => {
    expect(buildViolationKey(makeResult('color-contrast', '#btn'))).toBe('color-contrast::#btn');
  });
});

describe('diffWatchlist', () => {
  it('identifies new violations', () => {
    const prev: AuditResult[] = [];
    const curr = [makeResult('color-contrast')];
    const diff = diffWatchlist(prev, curr, 'https://example.com');
    expect(diff.newViolations).toHaveLength(1);
    expect(diff.removedViolations).toHaveLength(0);
  });

  it('identifies removed violations', () => {
    const prev = [makeResult('color-contrast')];
    const curr: AuditResult[] = [];
    const diff = diffWatchlist(prev, curr, 'https://example.com');
    expect(diff.removedViolations).toHaveLength(1);
    expect(diff.newViolations).toHaveLength(0);
  });

  it('identifies unchanged violations', () => {
    const r = makeResult('color-contrast');
    const diff = diffWatchlist([r], [r], 'https://example.com');
    expect(diff.unchanged).toHaveLength(1);
  });
});

describe('isUrlWatched', () => {
  it('returns false when watchlist disabled', () => {
    expect(isUrlWatched('https://example.com')).toBe(false);
  });

  it('returns true when url is in enabled watchlist', () => {
    setWatchlistConfig({ enabled: true, urls: ['https://example.com'] });
    expect(isUrlWatched('https://example.com')).toBe(true);
  });
});

describe('formatWatchlistDiff', () => {
  it('includes new violations in output', () => {
    setWatchlistConfig({ enabled: true, alertOnNewViolations: true });
    const diff = diffWatchlist([], [makeResult('aria-label')], 'https://example.com');
    const output = formatWatchlistDiff(diff);
    expect(output).toContain('New violations');
    expect(output).toContain('aria-label');
  });
});

describe('hasAlerts', () => {
  it('returns true when new violations exist and alert enabled', () => {
    setWatchlistConfig({ enabled: true, alertOnNewViolations: true });
    const diff = diffWatchlist([], [makeResult('alt-text')], 'https://example.com');
    expect(hasAlerts(diff)).toBe(true);
  });

  it('returns false when no new violations', () => {
    setWatchlistConfig({ enabled: true, alertOnNewViolations: true });
    const diff = diffWatchlist([], [], 'https://example.com');
    expect(hasAlerts(diff)).toBe(false);
  });
});
