import chalk from 'chalk';
import { AuditResult, AuditReport } from './types';
import { getOutputConfig } from './output-config';
import { formatSeverity, formatScore, formatViolationSummary, formatReportHeader } from './formatter';

function colorize(text: string, colorFn: (s: string) => string): string {
  return isColorEnabled() ? colorFn(text) : text;
}

function isColorEnabled(): boolean {
  return getOutputConfig().color;
}

export function renderResult(result: AuditResult): string {
  const { verbose } = getOutputConfig();
  const severity = formatSeverity(result.severity);
  const coloredSeverity = colorize(
    severity,
    result.severity === 'critical' || result.severity === 'serious'
      ? chalk.red
      : chalk.yellow
  );
  let out = `  [${coloredSeverity}] ${result.description} (${result.rule})\n`;
  if (verbose && result.fixSuggestion) {
    out += colorize(`    Fix: ${result.fixSuggestion}\n`, chalk.cyan);
  }
  if (verbose && result.element) {
    out += `    Element: ${result.element}\n`;
  }
  return out;
}

export function renderReport(report: AuditReport): string {
  const { verbose } = getOutputConfig();
  const header = formatReportHeader(report);
  const score = formatScore(report.score);
  const coloredScore = colorize(
    score,
    report.score >= 90 ? chalk.green : report.score >= 60 ? chalk.yellow : chalk.red
  );

  let out = colorize(header, chalk.bold) + '\n';
  out += `Score: ${coloredScore}\n`;
  out += `Violations: ${report.results.length}\n`;

  if (verbose) {
    out += `Audited at: ${new Date(report.timestamp).toLocaleString()}\n`;
  }

  out += '\n';
  for (const result of report.results) {
    out += renderResult(result);
  }

  if (report.results.length === 0) {
    out += colorize('  No violations found.\n', chalk.green);
  }

  return out;
}
