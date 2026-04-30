import {
  computeCost,
  checkBudget,
  formatCostSummary,
  trackCosts,
} from './cost-runner';
import { setCostConfig, resetCostConfig } from './cost-config';
import { AuditResult } from './types';

function makeResult(url: string): AuditResult {
  return {
    url,
    violations: [],
    score: 100,
    timestamp: new Date().toISOString(),
  } as unknown as AuditResult;
}

beforeEach(() => {
  resetCostConfig();
});

describe('computeCost', () => {
  it('calculates cost for given request count', () => {
    setCostConfig({ enabled: true, costPerRequest: 0.05, maxCostPerRun: 1.0 });
    const report = computeCost(10);
    expect(report.totalRequests).toBe(10);
    expect(report.totalCost).toBe(0.5);
    expect(report.withinBudget).toBe(true);
    expect(report.budgetRemaining).toBe(0.5);
  });

  it('marks over budget when cost exceeds max', () => {
    setCostConfig({ enabled: true, costPerRequest: 0.1, maxCostPerRun: 0.5 });
    const report = computeCost(10);
    expect(report.withinBudget).toBe(false);
    expect(report.budgetRemaining).toBe(0);
  });
});

describe('checkBudget', () => {
  it('returns true when cost tracking is disabled', () => {
    setCostConfig({ enabled: false });
    expect(checkBudget(1000)).toBe(true);
  });

  it('returns false when over budget', () => {
    setCostConfig({ enabled: true, costPerRequest: 1.0, maxCostPerRun: 5.0 });
    expect(checkBudget(10)).toBe(false);
  });
});

describe('formatCostSummary', () => {
  it('formats a within-budget report', () => {
    const report = { totalRequests: 5, totalCost: 0.05, currency: 'USD', withinBudget: true, budgetRemaining: 9.95 };
    const text = formatCostSummary(report);
    expect(text).toContain('within budget');
    expect(text).toContain('0.05 USD');
  });

  it('formats an over-budget report', () => {
    const report = { totalRequests: 20, totalCost: 2.0, currency: 'EUR', withinBudget: false, budgetRemaining: 0 };
    const text = formatCostSummary(report);
    expect(text).toContain('over budget');
  });
});

describe('trackCosts', () => {
  it('returns null when disabled', () => {
    setCostConfig({ enabled: false });
    expect(trackCosts([makeResult('https://a.com')])).toBeNull();
  });

  it('counts unique URLs for cost', () => {
    setCostConfig({ enabled: true, costPerRequest: 0.01, maxCostPerRun: 10 });
    const results = [makeResult('https://a.com'), makeResult('https://a.com'), makeResult('https://b.com')];
    const report = trackCosts(results);
    expect(report).not.toBeNull();
    expect(report!.totalRequests).toBe(2);
  });
});
