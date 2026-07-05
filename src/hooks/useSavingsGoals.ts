import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { savingsGoalsApi, type SavingsGoalDTO, type CreateSavingsGoalPayload } from '../services/api';

export function useSavingsGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoalDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) {
      setGoals([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await savingsGoalsApi.list();
      setGoals(data);
    } catch {
      setError('Impossible de charger les objectifs.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (payload: CreateSavingsGoalPayload) => {
    try {
      const created = await savingsGoalsApi.create(payload);
      setGoals((prev) => [created, ...prev]);
      return created;
    } catch {
      throw new Error('Erreur lors de la création de l\'objectif.');
    }
  }, []);

  const updateGoal = useCallback(async (id: number, payload: Partial<CreateSavingsGoalPayload>) => {
    try {
      const updated = await savingsGoalsApi.update(id, payload);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      return updated;
    } catch {
      throw new Error('Erreur lors de la modification.');
    }
  }, []);

  const removeGoal = useCallback(async (id: number) => {
    try {
      await savingsGoalsApi.remove(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch {
      throw new Error('Erreur lors de la suppression.');
    }
  }, []);

  const refresh = useCallback(() => fetchGoals(), [fetchGoals]);

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    removeGoal,
    refresh,
  };
}
