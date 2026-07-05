import { describe, expect, it } from 'vitest';
import { getDashboardRecommendation } from '../utils/dashboardInsights';

describe('getDashboardRecommendation', () => {
  it('recommends reducing spending when a budget is exceeded', () => {
    const recommendation = getDashboardRecommendation({
      balance: 120000,
      totalIncome: 300000,
      totalExpenses: 180000,
      budgetStatus: [{ pct: 100 }],
    });

    expect(recommendation.title).toBe('Équilibrez vos budgets');
    expect(recommendation.tone).toBe('loss');
  });

  it('returns a positive recommendation when finances are healthy', () => {
    const recommendation = getDashboardRecommendation({
      balance: 50000,
      totalIncome: 250000,
      totalExpenses: 200000,
      budgetStatus: [{ pct: 55 }],
    });

    expect(recommendation.tone).toBe('gain');
  });
});
