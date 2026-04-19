import { withTimeout, isTimeoutError } from './timeout-runner';
import { getPageLoadTimeoutMs } from './timeout-config';
import type { AuditResult } from './types';

export type AuditFn = (url: string) => Promise<AuditResult[]>;

export function createTimeoutAuditor(auditFn: AuditFn): AuditFn {
  return async (url: string): Promise<AuditResult[]> => {
    try {
      return await withTimeout(auditFn(url), url, getPageLoadTimeoutMs());
    } catch (err) {
      if (isTimeoutError(err)) {
        throw new Error(
          `Audit timed out for ${url}: ${(err as Error).message}`
        );
      }
      throw err;
    }
  };
}
