import { chromium } from 'playwright';
import { A11yIssue, AffectedNode, AuditOptions, AuditResult, IssueSeverity } from './types';

const FIX_SUGGESTIONS: Record<string, string> = {
  'color-contrast': 'Increase the contrast ratio between foreground and background colors to at least 4.5:1 for normal text.',
  'image-alt': 'Add a descriptive `alt` attribute to all <img> elements. Use alt="" for decorative images.',
  'label': 'Associate every form input with a <label> element using `for`/`id` or wrap the input inside the label.',
  'link-name': 'Ensure all <a> elements have discernible text content or an aria-label attribute.',
  'button-name': 'Ensure all <button> elements have discernible text content or an aria-label attribute.',
  'html-has-lang': 'Add a `lang` attribute to the <html> element (e.g., lang="en").',
  'document-title': 'Add a descriptive <title> element inside <head>.',
  'landmark-one-main': 'Ensure the page contains exactly one <main> landmark element.',
};

function getFixSuggestion(ruleId: string): string {
  return FIX_SUGGESTIONS[ruleId] ?? `Review the rule "${ruleId}" in the WCAG documentation and apply the recommended fix.`;
}

export async function runAudit(options: AuditOptions): Promise<AuditResult> {
  const { url, timeout = 30000 } = options;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout });
    await page.addScriptTag({ path: require.resolve('axe-core') });

    const axeResults = await page.evaluate(async () => {
      // @ts-ignore axe is injected at runtime
      return await axe.run();
    });

    const issues: A11yIssue[] = axeResults.violations.map((v: any) => {
      const affectedNodes: AffectedNode[] = v.nodes.map((n: any) => ({
        html: n.html,
        selector: n.target.join(', '),
        failureSummary: n.failureSummary,
      }));

      return {
        id: v.id,
        description: v.description,
        severity: v.impact as IssueSeverity,
        wcagCriteria: v.tags.filter((t: string) => t.startsWith('wcag')),
        affectedNodes,
        fixSuggestion: getFixSuggestion(v.id),
      };
    });

    const issuesBySeverity = issues.reduce(
      (acc, issue) => { acc[issue.severity] = (acc[issue.severity] ?? 0) + 1; return acc; },
      {} as Record<IssueSeverity, number>
    );

    return {
      url,
      auditedAt: new Date().toISOString(),
      totalIssues: issues.length,
      issuesBySeverity,
      issues,
    };
  } finally {
    await browser.close();
  }
}
