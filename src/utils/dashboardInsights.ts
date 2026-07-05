export interface Recommendation {
  title: string;
  body: string;
  tone: 'gain' | 'loss' | 'neutral';
}

interface BudgetInsight {
  pct: number;
}

interface RecommendationParams {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  budgetStatus: BudgetInsight[];
}

export function getDashboardRecommendation({
  balance,
  totalIncome,
  totalExpenses,
  budgetStatus,
}: RecommendationParams): Recommendation {
  if (budgetStatus.some((budget) => budget.pct >= 100)) {
    return {
      title: 'Équilibrez vos budgets',
      body: 'Un budget est déjà dépassé cette semaine. Réduisez les dépenses non essentielles pour retrouver un rythme plus stable.',
      tone: 'loss',
    };
  }

  if (balance > 0 && totalIncome > 0 && totalExpenses <= totalIncome * 0.8) {
    return {
      title: 'Bonne dynamique financière',
      body: 'Votre structure reste saine. Pensez à mettre de côté une petite épargne pour couvrir les imprévus.',
      tone: 'gain',
    };
  }

  if (balance < 0) {
    return {
      title: 'Un peu de discipline',
      body: 'Le solde est négatif. Priorisez les achats essentiels et réajustez votre budget sur les prochaines semaines.',
      tone: 'loss',
    };
  }

  return {
    title: 'Restez régulier',
    body: 'Ajoutez une transaction récente pour garder un suivi plus précis de votre situation financière.',
    tone: 'neutral',
  };
}
