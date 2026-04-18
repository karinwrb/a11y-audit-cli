#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import { runAudit } from './auditor';
import { AuditResult, IssueSeverity } from './types';

const SEVERITY_COLORS: Record<IssueSeverity, chalk.Chalk> = {
  critical: chalk.red.bold,
  serious: chalk.red,
  moderate: chalk.yellow,
  minor: chalk.cyan,
};

function printTextReport(result: AuditResult): void {
  console.log(chalk.bold(`\n🔍 Audit Report for: ${result.url}`));
  console.log(chalk.gray(`Audited at: ${result.auditedAt}`));
  console.log(chalk.bold(`Total issues: ${result.totalIssues}\n`));

  if (result.totalIssues === 0) {
    console.log(chalk.green('✅ No accessibility issues found!'));
    return;
  }

  for (const issue of result.issues) {
    const color = SEVERITY_COLORS[issue.severity] ?? chalk.white;
    console.log(color(`[${issue.severity.toUpperCase()}] ${issue.id}: ${issue.description}`));
    console.log(chalk.gray(`  WCAG: ${issue.wcagCriteria.join(', ') || 'N/A'}`));
    console.log(chalk.green(`  Fix: ${issue.fixSuggestion}`));
    console.log(chalk.gray(`  Affected nodes: ${issue.affectedNodes.length}\n`));
  }
}

const program = new Command();

program
  .name('a11y-audit')
  .description('Run accessibility checks on a URL and get structured fix suggestions')
  .version('0.1.0')
  .requiredOption('-u, --url <url>', 'URL to audit')
  .option('-f, --format <format>', 'Output format: json or text', 'text')
  .option('-o, --output <file>', 'Write report to a file')
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds', '30000')
  .action(async (opts) => {
    try {
      console.log(chalk.blue(`Auditing ${opts.url}...`));
      const result = await runAudit({
        url: opts.url,
        timeout: parseInt(opts.timeout, 10),
        outputFormat: opts.format,
        outputFile: opts.output,
      });

      if (opts.format === 'json') {
        const json = JSON.stringify(result, null, 2);
        if (opts.output) {
          fs.writeFileSync(opts.output, json, 'utf-8');
          console.log(chalk.green(`Report saved to ${opts.output}`));
        } else {
          console.log(json);
        }
      } else {
        printTextReport(result);
        if (opts.output) {
          fs.writeFileSync(opts.output, JSON.stringify(result, null, 2), 'utf-8');
          console.log(chalk.green(`\nReport also saved to ${opts.output}`));
        }
      }

      process.exit(result.totalIssues > 0 ? 1 : 0);
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(2);
    }
  });

program.parse();
