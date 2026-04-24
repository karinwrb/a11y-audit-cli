import { AuditResult } from './types';
import { getNormalizeConfig, isNormalizeEnabled } from './normalize-config';

export function normalizeUrl(url: string): string {
  const config = getNormalizeConfig();
  let result = url;

  if (config.trimWhitespace) {
    result = result.trim();
  }

  if (config.lowercaseUrls) {
    try {
      const parsed = new URL(result);
      parsed.hostname = parsed.hostname.toLowerCase();
      result = parsed.toString();
    } catch {
      result = result.toLowerCase();
    }
  }

  if (config.removeTrailingSlash) {
    try {
      const parsed = new URL(result);
      if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
        parsed.pathname = parsed.pathname.replace(/\/+$/, '');
        result = parsed.toString();
      }
    } catch {
      if (result.length > 1 && result.endsWith('/')) {
        result = result.replace(/\/+$/, '');
      }
    }
  }

  return result;
}

export function normalizeResult(result: AuditResult): AuditResult {
  if (!isNormalizeEnabled()) return result;
  return {
    ...result,
    url: normalizeUrl(result.url),
  };
}

export function normalizeResults(results: AuditResult[]): AuditResult[] {
  if (!isNormalizeEnabled()) return results;
  return results.map(normalizeResult);
}

export function normalizeAndCount(
  results: AuditResult[]
): { results: AuditResult[]; normalizedCount: number } {
  if (!isNormalizeEnabled()) {
    return { results, normalizedCount: 0 };
  }
  const normalized = normalizeResults(results);
  const normalizedCount = normalized.filter(
    (r, i) => r.url !== results[i].url
  ).length;
  return { results: normalized, normalizedCount };
}
