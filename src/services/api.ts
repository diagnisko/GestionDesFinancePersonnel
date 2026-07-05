import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('financeflow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('financeflow-refresh');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken });
          const { access_token, refresh_token } = res.data;
          localStorage.setItem('financeflow-token', access_token);
          if (refresh_token) localStorage.setItem('financeflow-refresh', refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('financeflow-token');
          localStorage.removeItem('financeflow-refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

/** Extrait un message d'erreur lisible depuis une erreur axios ou générique. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    const data = err.response.data as { message?: string | string[] };
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(' ');
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

// --- Auth ---
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { email, password, firstname: name }).then((r) => r.data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }).then((r) => r.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};

export interface UpdateMePayload {
  firstname?: string;
  lastname?: string;
  phone?: string;
  avatar?: string;
}

// --- Users ---
export const usersApi = {
  me: () => api.get('/users/me').then((r) => r.data),
  updateMe: (data: UpdateMePayload) => api.patch('/users/me', data).then((r) => r.data),
};

// --- Accounts ---
export interface AccountDTO {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'cash' | 'credit';
  balance: number;
  currency: string;
  createdAt: string;
}

export interface CreateAccountPayload {
  name: string;
  type: 'checking' | 'savings' | 'cash' | 'credit';
  balance?: number;
  currency?: string;
}

export const accountsApi = {
  list: () => api.get<AccountDTO[]>('/accounts').then((r) => r.data),
  create: (data: CreateAccountPayload) =>
    api.post<AccountDTO>('/accounts', data).then((r) => r.data),
  update: (id: number, data: Partial<CreateAccountPayload>) =>
    api.patch<AccountDTO>(`/accounts/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete(`/accounts/${id}`).then((r) => r.data),
};

// --- Transactions ---
export interface TransactionDTO {
  id: number;
  description: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  category: string | null;
  createdAt: string;
  account?: AccountDTO | null;
}

export interface CreateTransactionPayload {
  description: string;
  amount: number;
  currency?: string;
  type?: 'income' | 'expense';
  category?: string;
  accountId?: number;
}

export interface StatsResponse {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: { name: string; value: number }[];
  monthlyStats: { month: string; revenu: number; depense: number }[];
}

export const transactionsApi = {
  list: () => api.get<TransactionDTO[]>('/transactions').then((r) => r.data),
  create: (data: CreateTransactionPayload) =>
    api.post<TransactionDTO>('/transactions', data).then((r) => r.data),
  update: (id: number, data: Partial<CreateTransactionPayload>) =>
    api.patch<TransactionDTO>(`/transactions/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete(`/transactions/${id}`).then((r) => r.data),
  stats: () => api.get<StatsResponse>('/transactions/stats').then((r) => r.data),
  exportCsv: () => api.get('/transactions/export', { responseType: 'text' }).then((r) => r.data),
};

export interface SavingsGoalDTO {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  createdAt: string;
}

export interface CreateSavingsGoalPayload {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
}

export const savingsGoalsApi = {
  list: () => api.get<SavingsGoalDTO[]>('/savings-goals').then((r) => r.data),
  create: (data: CreateSavingsGoalPayload) =>
    api.post<SavingsGoalDTO>('/savings-goals', data).then((r) => r.data),
  update: (id: number, data: Partial<CreateSavingsGoalPayload>) =>
    api.patch<SavingsGoalDTO>(`/savings-goals/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete(`/savings-goals/${id}`).then((r) => r.data),
};

export interface BudgetDTO {
  id: number;
  category: string;
  amount: number;
  createdAt: string;
}

export interface CreateBudgetPayload {
  category: string;
  amount: number;
}

export interface BudgetAlert {
  category: string;
  budget: number;
  spent: number;
  percentage: number;
}

export const budgetsApi = {
  list: () => api.get<BudgetDTO[]>('/budgets').then((r) => r.data),
  create: (data: CreateBudgetPayload) =>
    api.post<BudgetDTO>('/budgets', data).then((r) => r.data),
  update: (id: number, data: Partial<CreateBudgetPayload>) =>
    api.patch<BudgetDTO>(`/budgets/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete(`/budgets/${id}`).then((r) => r.data),
  alerts: () => api.get<BudgetAlert[]>('/budgets/alerts').then((r) => r.data),
};

export default api;
