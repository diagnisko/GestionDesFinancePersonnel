import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { transactionsApi, type TransactionDTO, type CreateTransactionPayload, type StatsResponse } from '../services/api';

// Catégories prédéfinies
export const CATEGORIES = [
  'Alimentation',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Éducation',
  'Vêtements',
  'Services',
  'Salaire',
  'Freelance',
  'Investissement',
  'Autre',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface TransactionWithMeta extends TransactionDTO {
  _kind: 'revenu' | 'depense';
}

const STORAGE_KEY = 'financeflow-transactions-cache';

function cacheTransactions(data: TransactionDTO[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function getCachedTransactions(): TransactionDTO[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useFinanceData() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) {
      setTransactions([]);
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Try API first
    try {
      const data = await transactionsApi.list();
      setTransactions(data);
      cacheTransactions(data);

      const statsData = await transactionsApi.stats();
      setStats(statsData);
    } catch {
      // Fallback to cache
      const cached = getCachedTransactions();
      if (cached) {
        setTransactions(cached);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch on mount & user change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (payload: CreateTransactionPayload) => {
    try {
      const created = await transactionsApi.create(payload);
      setTransactions((prev) => [created, ...prev]);
      // Refresh stats
      const statsData = await transactionsApi.stats();
      setStats(statsData);
      return created;
    } catch {
      throw new Error('Erreur lors de la création de la transaction.');
    }
  }, []);

  const updateTransaction = useCallback(async (id: number, payload: Partial<CreateTransactionPayload>) => {
    try {
      const updated = await transactionsApi.update(id, payload);
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      const statsData = await transactionsApi.stats();
      setStats(statsData);
      return updated;
    } catch {
      throw new Error('Erreur lors de la modification.');
    }
  }, []);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await transactionsApi.remove(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      const statsData = await transactionsApi.stats();
      setStats(statsData);
    } catch {
      throw new Error('Erreur lors de la suppression.');
    }
  }, []);

  const refresh = useCallback(() => fetchTransactions(), [fetchTransactions]);

  // Derive income/expense lists from transactions for backward compat
  const income = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  return {
    transactions,
    income,
    expenses,
    stats,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh,
  };
}
