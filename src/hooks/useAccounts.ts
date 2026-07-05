import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { accountsApi, type AccountDTO, type CreateAccountPayload } from '../services/api';

export function useAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!user?.id) {
      setAccounts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await accountsApi.list();
      setAccounts(data);
    } catch {
      setError('Impossible de charger les comptes.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = useCallback(async (payload: CreateAccountPayload) => {
    try {
      const created = await accountsApi.create(payload);
      setAccounts((prev) => [...prev, created]);
      return created;
    } catch {
      throw new Error('Erreur lors de la création du compte.');
    }
  }, []);

  const updateAccount = useCallback(async (id: number, payload: Partial<CreateAccountPayload>) => {
    try {
      const updated = await accountsApi.update(id, payload);
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch {
      throw new Error('Erreur lors de la modification.');
    }
  }, []);

  const removeAccount = useCallback(async (id: number) => {
    try {
      await accountsApi.remove(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      throw new Error('Erreur lors de la suppression.');
    }
  }, []);

  const refresh = useCallback(() => fetchAccounts(), [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    removeAccount,
    refresh,
  };
}
