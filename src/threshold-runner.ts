import { AuditReport } from './types';
import { getThresholdConfig, isThresholdEnabled } from './threshold-config';

export interface ThresholdResult {
  passed: boolean;
  reasons: string[];
}

export function checkThreshold(report: AuditReport): ThresholdResult {
  if (!isThresholdEnabled()) {
    return { passed: true, reasons: [] };
  }

  const config = getThresholdConfig();
  const reasons: string[] = [];

  if (report.score < config.minScore) {
    reasons.push(
      `Score ${report.score} is below minimum threshold of ${config.minScore}`
    );
  }

  if (config.failOnViolation && report.results.some((r) => r.violations.length > 0)) {
    reasons.push('One or more violations found and failOnViolation is enabled');
  }

  return { passed: reasons.length === 0, reasons };
}

export function applyThreshold(report: AuditReport): void {
  const result = checkThreshold(report);
  if (!result.passed) {
    throw new Error(
      `Threshold check failed:\n${result.reasons.map((r) => `  - ${r}`).join('\n')}`
    );
  }
}
