import { getCostConfig, isCostTrackingEnabled } from './cost-config';
import { AuditResult } from './types';

export interface CostReport {
  totalRequests: number;
  totalCost: number;
  currency: string;
  withinBudget: boolean;
  budgetRemaining: number;
}

export function computeCost(requestCount: number): CostReport {
  const config = getCostConfig();
  const totalCost = requestCount * config.costPerRequest;
  const withinBudget = totalCost <= config.maxCostPerRun;
  const budgetRemaining = Math.max(0, config.maxCostPerRun - totalCost);

  return {
    totalRequests: requestCount,
    totalCost: Math.round(totalCost * 10000) / 10000,
    currency: config.currency,
    withinBudget,
    budgetRemaining: Math.round(budgetRemaining * 10000) / 10000,
  };
}

export function checkBudget(requestCount: number): boolean {
  if (!isCostTrackingEnabled()) return true;
  const { withinBudget } = computeCost(requestCount);
  return withinBudget;
}

export function formatCostSummary(report: CostReport): string {
  const status = report.withinBudget ? '✓ within budget' : '✗ over budget';
  return [
    `Cost Summary (${status}):`,
    `  Requests : ${report.totalRequests}`,
    `  Total    : ${report.totalCost} ${report.currency}`,
    `  Remaining: ${report.budgetRemaining} ${report.currency}`,
  ].join('\n');
}

export function trackCosts(results: AuditResult[]): CostReport | null {
  if (!isCostTrackingEnabled()) return null;
  const uniqueUrls = new Set(results.map((r) => r.url)).size;
  return computeCost(uniqueUrls);
}
