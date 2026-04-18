import * as fs from 'fs';
import * as path from 'path';
import { AuditResult, AuditReport } from './types';

export function generateJsonReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}

export function generateMarkdownReport(report: AuditReport): string {
  const lines: string[] = [];

  lines.push(`# Accessibility Audit Report`);
  lines.push(``);
  lines.push(`**URL:** ${report.url}`);
  lines.push(`**Date:** ${new Date(report.timestamp).toLocaleString()}`);
  lines.push(`**Score:** ${report.score}/100`);
  lines.push(`**Violations:** ${report.violations.length}`);
  lines.push(``);

  if (report.violations.length === 0) {
    lines.push(`✅ No accessibility violations found.`);
    return lines.join('\n');
  }

  lines.push(`## Violations`);
  lines.push(``);

  for (const violation of report.violations) {
    lines.push(`### ${violation.id}: ${violation.description}`);
    lines.push(`- **Impact:** ${violation.impact}`);
    lines.push(`- **WCAG:** ${violation.wcagCriteria.join(', ')}`);
    lines.push(`- **Fix:** ${violation.fixSuggestion}`);
    lines.push(`- **Nodes affected:** ${violation.nodes.length}`);
    lines.push(``);
  }

  return lines.join('\n');
}

export function saveReport(
  content: string,
  outputPath: string,
  format: 'json' | 'markdown'
): void {
  const ext = format === 'json' ? '.json' : '.md';
  const filePath = outputPath.endsWith(ext) ? outputPath : `${outputPath}${ext}`;
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Report saved to: ${filePath}`);
}

export function exportReport(
  report: AuditReport,
  outputPath: string,
  format: 'json' | 'markdown'
): void {
  const content =
    format === 'json'
      ? generateJsonReport(report)
      : generateMarkdownReport(report);
  saveReport(content, outputPath, format);
}
