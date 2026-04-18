export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

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
