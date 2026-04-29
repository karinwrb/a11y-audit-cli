export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

/** Ordered list of severities from most to least severe. */
export const SEVERITY_LEVELS: Severity[] = ['critical', 'serious', 'moderate', 'minor'];

export interface AuditResult {
  id: string;
  description: string;
  severity: Severity;
  wcagCriteria: string;
  selector?: string;
  fix?: string;
}

export interface AuditReport {
  url: string;
  scannedAt: string;
  score: number;
  totalViolations: number;
  violations: AuditResult[];
  summary: SeveritySummary;
}

export interface SeveritySummary {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

export type OutputFormat = 'json' | 'markdown' | 'text';

export interface CliOptions {
  url: string;
  format: OutputFormat;
  output?: string;
  timeout?: number;
}

/**
 * Returns true if `a` is more severe than `b`.
 */
export function isMoreSevere(a: Severity, b: Severity): boolean {
  return SEVERITY_LEVELS.indexOf(a) < SEVERITY_LEVELS.indexOf(b);
}
