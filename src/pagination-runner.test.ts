import {
  paginateResults,
  getPage,
  formatPaginationSummary,
} from './pagination-runner';
import { setPaginationConfig, resetPaginationConfig } from './pagination-config';
import { AuditResult } from './types';

function makeResult(id: string): AuditResult {
  return {
    ruleId: id,
    description: `Rule ${id}`,
    severity: 'minor',
    url: 'https://example.com',
    fixSuggestion: 'Fix it.',
  };
}

const results: AuditResult[] = Array.from({ length: 25 }, (_, i) =>
  makeResult(`rule-${i + 1}`)
);

beforeEach(() => resetPaginationConfig());

describe('paginateResults', () => {
  it('returns first page with correct items', () => {
    setPaginationConfig({ pageSize: 10 });
    const p = paginateResults(results, 1);
    expect(p.items).toHaveLength(10);
    expect(p.items[0].ruleId).toBe('rule-1');
    expect(p.page).toBe(1);
    expect(p.totalItems).toBe(25);
    expect(p.totalPages).toBe(3);
    expect(p.hasNext).toBe(true);
    expect(p.hasPrev).toBe(false);
  });

  it('returns last page with remaining items', () => {
    setPaginationConfig({ pageSize: 10 });
    const p = paginateResults(results, 3);
    expect(p.items).toHaveLength(5);
    expect(p.hasNext).toBe(false);
    expect(p.hasPrev).toBe(true);
  });

  it('clamps page to valid range', () => {
    setPaginationConfig({ pageSize: 10 });
    const p = paginateResults(results, 999);
    expect(p.page).toBe(3);
  });

  it('respects maxPages limit', () => {
    setPaginationConfig({ pageSize: 5, maxPages: 2 });
    const p = paginateResults(results, 1);
    expect(p.totalPages).toBe(2);
  });

  it('handles empty results', () => {
    const p = paginateResults([], 1);
    expect(p.items).toHaveLength(0);
    expect(p.totalPages).toBe(1);
    expect(p.hasNext).toBe(false);
  });
});

describe('getPage', () => {
  it('returns all results when pagination disabled', () => {
    setPaginationConfig({ enabled: false, pageSize: 5 });
    expect(getPage(results, 1)).toHaveLength(25);
  });

  it('paginates when enabled', () => {
    setPaginationConfig({ enabled: true, pageSize: 5 });
    expect(getPage(results, 2)).toHaveLength(5);
  });
});

describe('formatPaginationSummary', () => {
  it('formats summary correctly', () => {
    setPaginationConfig({ pageSize: 10 });
    const p = paginateResults(results, 2);
    expect(formatPaginationSummary(p)).toBe(
      'Showing 11–20 of 25 results (page 2/3)'
    );
  });

  it('handles empty results gracefully', () => {
    const p = paginateResults([], 1);
    expect(formatPaginationSummary(p)).toBe('No results found.');
  });
});
