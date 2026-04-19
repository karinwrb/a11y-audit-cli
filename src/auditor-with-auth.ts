import { injectAuth } from './auth-runner';
import { AuditResult } from './types';

export type AuditorFn = (url: string, headers?: Record<string, string>) => Promise<AuditResult>;

export function createAuthAuditor(auditor: AuditorFn): AuditorFn {
  return async function auditWithAuth(url: string, headers: Record<string, string> = {}): Promise<AuditResult> {
    const { url: authedUrl, headers: authHeaders } = injectAuth(url);
    const mergedHeaders = { ...authHeaders, ...headers };
    return auditor(authedUrl, mergedHeaders);
  };
}
