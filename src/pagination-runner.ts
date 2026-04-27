import { AuditResult } from './types';
import { getPaginationConfig, isPaginationEnabled } from './pagination-config';

export interface PaginatedResults {
  items: AuditResult[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function paginateResults(
  results: AuditResult[],
  page: number = 1
): PaginatedResults {
  const config = getPaginationConfig();
  const pageSize = config.pageSize;
  const maxPages = config.maxPages;

  const totalItems = results.length;
  const totalPages = Math.min(Math.ceil(totalItems / pageSize), maxPages);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: results.slice(start, end),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

export function getPage(results: AuditResult[], page: number): AuditResult[] {
  if (!isPaginationEnabled()) {
    return results;
  }
  return paginateResults(results, page).items;
}

export function formatPaginationSummary(paginated: PaginatedResults): string {
  const { page, totalPages, totalItems, pageSize } = paginated;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  if (totalItems === 0) {
    return 'No results found.';
  }
  return `Showing ${start}–${end} of ${totalItems} results (page ${page}/${totalPages})`;
}
