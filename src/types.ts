export type IssueSeverity = 'critical' | 'serious' | 'moderate' | 'minor';

export interface A11yIssue {
  id: string;
  description: string;
  severity: IssueSeverity;
  wcagCriteria: string[];
  affectedNodes: AffectedNode[];
  fixSuggestion: string;
}

export interface AffectedNode {
  html: string;
  selector: string;
  failureSummary: string;
}

export interface AuditResult {
  url: string;
  auditedAt: string;
  totalIssues: number;
  issuesBySeverity: Record<IssueSeverity, number>;
  issues: A11yIssue[];
}

export interface AuditOptions {
  url: string;
  timeout?: number;
  outputFormat?: 'json' | 'text';
  outputFile?: string;
}
