import axios from 'axios';
import { runRules, RuleViolation } from './rules';
import { AuditResult, Severity } from './types';
import { getFixSuggestion } from './auditor';

export interface ScanOptions {
  timeout?: number;
  userAgent?: string;
}

export interface ScanResult {
  url: string;
  scannedAt: string;
  violations: RuleViolation[];
  auditResults: AuditResult[];
  score: number;
}

export async function fetchHtml(url: string, options: ScanOptions = {}): Promise<string> {
  const response = await axios.get(url, {
    timeout: options.timeout ?? 10000,
    headers: {
      'User-Agent': options.userAgent ?? 'a11y-audit-cli/1.0',
    },
    responseType: 'text',
  });
  return response.data as string;
}

export function calculateScore(violations: RuleViolation[]): number {
  const penalties: Record<Severity, number> = {
    critical: 20,
    serious: 10,
    moderate: 5,
    minor: 2,
  };
  const totalPenalty = violations.reduce((sum, v) => sum + (penalties[v.severity] ?? 0), 0);
  return Math.max(0, 100 - totalPenalty);
}

export function violationsToAuditResults(violations: RuleViolation[]): AuditResult[] {
  return violations.map(v => ({
    id: v.ruleId,
    description: v.message,
    severity: v.severity,
    wcagCriteria: v.wcagCriteria,
    selector: v.selector,
    fix: getFixSuggestion(v.ruleId),
  }));
}

export async function scanUrl(url: string, options: ScanOptions = {}): Promise<ScanResult> {
  const html = await fetchHtml(url, options);
  const violations = runRules(html);
  const auditResults = violationsToAuditResults(violations);
  const score = calculateScore(violations);

  return {
    url,
    scannedAt: new Date().toISOString(),
    violations,
    auditResults,
    score,
  };
}
