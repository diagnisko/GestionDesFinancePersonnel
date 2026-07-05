import { useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import KpiCard from '../components/dashboard/KpiCard';
import LineChartFinance from '../components/dashboard/LineChartFinance';
import BarChartFinance from '../components/dashboard/BarChartFinance';
import PieChartFinance from '../components/dashboard/PieChartFinance';
import { useFinanceData } from '../hooks/useFinanceData';
import { PERIODS, type Period, isInPeriod, formatFcfa } from '../utils/format';

function periodPreviousStart(period: Period, now: Date) {
  switch (period) {
    case 'week': return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);
    case 'month': return new Date(now.getFullYear(), now.getMonth() - 1, 1);
    case 'quarter': return new Date(now.getFullYear(), now.getMonth() - 5, 1);
    case 'year': return new Date(now.getFullYear() - 1, 0, 1);
    default: return new Date(0);
  }
}

export default function StatisticsPage() {
  const { income, expenses, stats } = useFinanceData();
  const [period, setPeriod] = useState<Period>('month');

  const filteredIncome = useMemo(() => income.filter((t) => isInPeriod(new Date(t.createdAt), period)), [income, period]);
  const filteredExpenses = useMemo(() => expenses.filter((t) => isInPeriod(new Date(t.createdAt), period)), [expenses, period]);

  const totalIncome = useMemo(() => filteredIncome.reduce((a, i) => a + i.amount, 0), [filteredIncome]);
  const totalExpenses = useMemo(() => filteredExpenses.reduce((a, e) => a + e.amount, 0), [filteredExpenses]);
  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const previousPeriodIncome = useMemo(() => {
    const now = new Date();
    const prevStart = periodPreviousStart(period, now);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
    return income.filter((t) => { const d = new Date(t.createdAt); return d >= prevStart && d <= prevEnd; }).reduce((a, t) => a + t.amount, 0);
  }, [income, period]);

  const previousPeriodExpenses = useMemo(() => {
    const now = new Date();
    const prevStart = periodPreviousStart(period, now);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
    return expenses.filter((t) => { const d = new Date(t.createdAt); return d >= prevStart && d <= prevEnd; }).reduce((a, t) => a + t.amount, 0);
  }, [expenses, period]);

  const incomeChange = previousPeriodIncome > 0 ? Math.round(((totalIncome - previousPeriodIncome) / previousPeriodIncome) * 100) : 0;
  const expenseChange = previousPeriodExpenses > 0 ? Math.round(((totalExpenses - previousPeriodExpenses) / previousPeriodExpenses) * 100) : 0;

  const chartData = useMemo(() => {
    if (stats?.monthlyStats && stats.monthlyStats.length > 0) return stats.monthlyStats;
    return [{ month: 'Revenus', revenu: totalIncome, depense: 0 }, { month: 'Dépenses', revenu: 0, depense: totalExpenses }];
  }, [stats, totalIncome, totalExpenses]);

  const pieData = useMemo(() => {
    if (stats?.expensesByCategory && stats.expensesByCategory.length > 0) return stats.expensesByCategory;
    return filteredExpenses.map((e) => ({ name: e.description, value: e.amount }));
  }, [stats, filteredExpenses]);

  return (
    <DashboardLayout title="Statistiques">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <p className="text-paper-dim text-sm">Vue synthétique de vos indicateurs et graphiques.</p>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="bg-ink-850 border hairline rounded-lg px-3 py-2 text-sm text-paper outline-none focus:border-brass/50"
        >
          {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <KpiCard label="Solde" value={balance} />
        <KpiCard label="Revenus" value={totalIncome} trendPct={incomeChange} tone="gain" />
        <KpiCard label="Dépenses" value={totalExpenses} trendPct={expenseChange} tone="loss" />
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Transactions', value: String(filteredIncome.length + filteredExpenses.length) },
            { label: 'Catégories utilisées', value: String(stats.expensesByCategory.length) },
            {
              label: 'Moy. dépenses / mois',
              value: stats.monthlyStats.length > 0
                ? formatFcfa(Math.round(stats.monthlyStats.reduce((a, m) => a + m.depense, 0) / stats.monthlyStats.length))
                : '—',
            },
          ].map((item) => (
            <div key={item.label} className="panel p-4 text-center">
              <p className="text-xs text-paper-dim mb-1">{item.label}</p>
              <p className="text-lg font-mono-figures text-paper">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChartFinance data={chartData} />
        <BarChartFinance data={chartData} />
        <div className="lg:col-span-2"><PieChartFinance data={pieData} /></div>
      </div>
    </DashboardLayout>
  );
}
