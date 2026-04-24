import {
  getTransformConfig,
  isTransformEnabled,
  isStripHtml,
  isNormalizeWhitespace,
  getTruncateLength,
} from './transform-config';
import type { AuditResult } from './types';

export function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, '');
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function transformString(value: string): string {
  if (!isTransformEnabled()) return value;

  let result = value;

  if (isStripHtml()) {
    result = stripHtmlTags(result);
  }

  if (isNormalizeWhitespace()) {
    result = normalizeWhitespace(result);
  }

  const maxLength = getTruncateLength();
  if (maxLength !== null) {
    result = truncateText(result, maxLength);
  }

  return result;
}

export function transformResult(result: AuditResult): AuditResult {
  if (!isTransformEnabled()) return result;

  return {
    ...result,
    message: transformString(result.message),
    helpUrl: result.helpUrl ? transformString(result.helpUrl) : result.helpUrl,
  };
}

export function transformResults(results: AuditResult[]): AuditResult[] {
  if (!isTransformEnabled()) return results;
  return results.map(transformResult);
}

export function transformAndCount(
  results: AuditResult[]
): { results: AuditResult[]; transformedCount: number } {
  if (!isTransformEnabled()) return { results, transformedCount: 0 };
  const transformed = transformResults(results);
  const transformedCount = transformed.filter(
    (r, i) => r.message !== results[i].message
  ).length;
  return { results: transformed, transformedCount };
}
