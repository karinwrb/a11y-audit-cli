import { withRetry, isRetryableError } from './retry';
import { getRetryConfig } from './retry-config';
import { AuditResult } from './types';

export type AuditFn = (url: string) => Promise<AuditResult[]>;

export async function auditWithRetry(
  url: string,
  auditFn: AuditFn,
  onRetry?: (attempt: number, error: Error) => void
): Promise<AuditResult[]> {
  const config = getRetryConfig();
  let attempt = 0;

  return withRetry(
    async () => {
      attempt++;
      try {
        return await auditFn(url);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (onRetry && attempt < config.maxAttempts) {
          onRetry(attempt, error);
        }
        throw error;
      }
    },
    {
      ...config,
      shouldRetry: isRetryableError,
    }
  );
}

export function createRetryingAuditor(
  auditFn: AuditFn,
  onRetry?: (attempt: number, error: Error) => void
): (url: string) => Promise<AuditResult[]> {
  return (url: string) => auditWithRetry(url, auditFn, onRetry);
}
