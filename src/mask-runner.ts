import { getMaskConfig } from './mask-config';
import { AuditResult } from './types';

export function maskString(value: string, maskChar: string, visibleChars: number): string {
  if (value.length <= visibleChars) {
    return maskChar.repeat(value.length);
  }
  const visible = value.slice(-visibleChars);
  const masked = maskChar.repeat(value.length - visibleChars);
  return masked + visible;
}

export function maskField(key: string, value: unknown): unknown {
  const config = getMaskConfig();
  if (!config.enabled) return value;
  if (typeof value !== 'string') return value;

  const sensitiveKeys = config.sensitiveFields ?? [];
  const isSensitive = sensitiveKeys.some(
    (field: string) => key.toLowerCase().includes(field.toLowerCase())
  );

  if (!isSensitive) return value;
  return maskString(value, config.maskChar ?? '*', config.visibleChars ?? 4);
}

export function maskObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = maskObject(value as Record<string, unknown>);
    } else {
      result[key] = maskField(key, value);
    }
  }
  return result;
}

export function maskResult(result: AuditResult): AuditResult {
  const config = getMaskConfig();
  if (!config.enabled) return result;

  return {
    ...result,
    url: maskField('url', result.url) as string,
    meta: result.meta ? maskObject(result.meta as Record<string, unknown>) : result.meta,
  };
}

export function maskResults(results: AuditResult[]): AuditResult[] {
  return results.map(maskResult);
}

export function maskAndCount(
  results: AuditResult[]
): { results: AuditResult[]; maskedCount: number } {
  const config = getMaskConfig();
  if (!config.enabled) return { results, maskedCount: 0 };

  const masked = maskResults(results);
  const maskedCount = masked.filter((r, i) => r.url !== results[i].url).length;
  return { results: masked, maskedCount };
}
