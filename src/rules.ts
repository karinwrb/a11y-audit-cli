import { AuditResult, Severity } from './types';

export interface Rule {
  id: string;
  description: string;
  severity: Severity;
  wcagCriteria: string;
  check: (html: string) => RuleViolation[];
}

export interface RuleViolation {
  ruleId: string;
  message: string;
  selector?: string;
  severity: Severity;
  wcagCriteria: string;
}

export const rules: Rule[] = [
  {
    id: 'img-alt',
    description: 'Images must have alt text',
    severity: 'critical',
    wcagCriteria: '1.1.1',
    check: (html: string): RuleViolation[] => {
      const violations: RuleViolation[] = [];
      const imgRegex = /<img(?![^>]*alt=)[^>]*>/gi;
      const matches = html.match(imgRegex) || [];
      matches.forEach(() => {
        violations.push({
          ruleId: 'img-alt',
          message: 'Image is missing alt attribute',
          selector: 'img',
          severity: 'critical',
          wcagCriteria: '1.1.1',
        });
      });
      return violations;
    },
  },
  {
    id: 'label-for-input',
    description: 'Form inputs must have associated labels',
    severity: 'serious',
    wcagCriteria: '1.3.1',
    check: (html: string): RuleViolation[] => {
      const violations: RuleViolation[] = [];
      const inputRegex = /<input(?![^>]*aria-label)(?![^>]*id=)[^>]*>/gi;
      const matches = html.match(inputRegex) || [];
      matches.forEach(() => {
        violations.push({
          ruleId: 'label-for-input',
          message: 'Input is missing a label or aria-label',
          selector: 'input',
          severity: 'serious',
          wcagCriteria: '1.3.1',
        });
      });
      return violations;
    },
  },
  {
    id: 'html-lang',
    description: 'HTML element must have a lang attribute',
    severity: 'serious',
    wcagCriteria: '3.1.1',
    check: (html: string): RuleViolation[] => {
      if (!/<html[^>]*lang=/i.test(html)) {
        return [{
          ruleId: 'html-lang',
          message: 'HTML element is missing lang attribute',
          selector: 'html',
          severity: 'serious',
          wcagCriteria: '3.1.1',
        }];
      }
      return [];
    },
  },
];

export function runRules(html: string): RuleViolation[] {
  return rules.flatMap(rule => rule.check(html));
}
