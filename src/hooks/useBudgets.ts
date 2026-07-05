import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { budgetsApi, type BudgetDTO, type CreateBudgetPayload, type BudgetAlert } from '../services/api';

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BudgetDTO[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user?.id) {
      setBudgets([]);
      setAlerts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [budgetsData, alertsData] = await Promise.all([
        budgetsApi.list(),
        budgetsApi.alerts(),
      ]);
      setBudgets(budgetsData);
      setAlerts(alertsData);
    } catch {
      setError('Impossible de charger les budgets.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(async (payload: CreateBudgetPayload) => {
    try {
      const created = await budgetsApi.create(payload);
      setBudgets((prev) => [...prev, created]);
      return created;
    } catch {
      throw new Error('Erreur lors de la création du budget.');
    }
  }, []);

  const updateBudget = useCallback(async (id: number, payload: Partial<CreateBudgetPayload>) => {
    try {
      const updated = await budgetsApi.update(id, payload);
      setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch {
      throw new Error('Erreur lors de la modification.');
    }
  }, []);

  const removeBudget = useCallback(async (id: number) => {
    try {
      await budgetsApi.remove(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch {
      throw new Error('Erreur lors de la suppression.');
    }
  }, []);

  const refresh = useCallback(() => fetchBudgets(), [fetchBudgets]);

  return {
    budgets,
    alerts,
    loading,
    error,
    addBudget,
    updateBudget,
    removeBudget,
    refresh,
  };
}
