import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import KpiCard from '../components/dashboard/KpiCard';
import AccountChip from '../components/dashboard/AccountChip';
import LineChartFinance from '../components/dashboard/LineChartFinance';
import PieChartFinance from '../components/dashboard/PieChartFinance';
import EmptyState from '../components/common/EmptyState';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import { useFinanceData } from '../hooks/useFinanceData';
import { useBudgets } from '../hooks/useBudgets';
import { useAccounts } from '../hooks/useAccounts';
import { useCountUp } from '../hooks/useCountUp';
import { getDashboardRecommendation } from '../utils/dashboardInsights';

function monthWindow(list: { createdAt: string; amount: number }[]) {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  return list.filter((t) => {
    const d = new Date(t.createdAt);
    return d >= prevMonth && d <= endPrev;
  }).reduce((a, t) => a + t.amount, 0);
}

export default function DashboardPage() {
  const { income, expenses, stats, loading } = useFinanceData();
  const { budgets } = useBudgets();
  const { accounts } = useAccounts();

  const totalIncome = useMemo(() => income.reduce((a, i) => a + i.amount, 0), [income]);
  const totalExpenses = useMemo(() => expenses.reduce((a, e) => a + e.amount, 0), [expenses]);
  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  const animatedBalance = useCountUp(balance, 900);

  const previousMonthIncome = useMemo(() => monthWindow(income), [income]);
  const previousMonthExpenses = useMemo(() => monthWindow(expenses), [expenses]);
  const incomeChange = previousMonthIncome > 0 ? Math.round(((totalIncome - previousMonthIncome) / previousMonthIncome) * 100) : 0;
  const expenseChange = previousMonthExpenses > 0 ? Math.round(((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100) : 0;

  const budgetStatus = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthExpenses = expenses.filter((t) => {
      const d = new Date(t.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === currentMonth;
    });
    const map: Record<string, number> = {};
    currentMonthExpenses.forEach((e) => {
      const cat = e.category || 'Autre';
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return budgets
      .map((b) => {
        const spent = map[b.category] || 0;
        const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
        return { ...b, spent, pct };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);
  }, [budgets, expenses]);

  const recommendation = useMemo(
    () => getDashboardRecommendation({ balance, totalIncome, totalExpenses, budgetStatus }),
    [balance, totalIncome, totalExpenses, budgetStatus],
  );

  const chartData = useMemo(() => {
    if (stats?.monthlyStats && stats.monthlyStats.length > 0) return stats.monthlyStats;
    return [
      { month: 'Revenus', revenu: totalIncome, depense: 0 },
      { month: 'Dépenses', revenu: 0, depense: totalExpenses },
    ];
  }, [stats, totalIncome, totalExpenses]);

  const pieData = useMemo(() => {
    if (stats?.expensesByCategory && stats.expensesByCategory.length > 0) return stats.expensesByCategory;
    return expenses.map((e) => ({ name: e.description, value: e.amount }));
  }, [stats, expenses]);

  const recentTransactions = useMemo(
    () => [...income, ...expenses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6),
    [income, expenses],
  );

  const recommendationTone = {
    gain: 'border-gain/25 bg-gain/10 text-gain',
    loss: 'border-loss/25 bg-loss/10 text-loss',
    neutral: 'border-brass/25 bg-brass/10 text-brass',
  }[recommendation.tone];

  return (
    <DashboardLayout title="Tableau de bord">
      {loading ? (
        <div className="mb-4 text-sm text-paper-dim animate-pulse-soft">Chargement des données…</div>
      ) : (
        <div className="space-y-5">
          <div className="relative animate-float-slow overflow-hidden rounded-[1.5rem] border border-ink-border bg-[linear-gradient(135deg,rgba(200,155,74,0.16),rgba(23,28,42,0.95)_45%,rgba(10,13,20,1))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] animate-rise sm:p-8">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brass/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-info/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-brass/25 bg-ink-900/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-brass">
                  <Sparkles size={14} /> Vue d’ensemble
                </div>
                <h1 className="mt-4 font-display text-3xl text-paper sm:text-4xl">
                  Votre finance se porte mieux que jamais.
                </h1>
                <p className="mt-2 max-w-xl text-sm text-paper-dim">
                  Un tableau de bord plus vivant, plus clair et plus motivant pour piloter votre quotidien.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1.5 text-gain">
                    <ArrowUpRight size={15} /> {totalIncome.toLocaleString('fr-FR')} F de revenus
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1.5 text-loss">
                    <ArrowDownRight size={15} /> {totalExpenses.toLocaleString('fr-FR')} F de dépenses
                  </span>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-ink-950/70 px-4 py-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-paper-dim">Solde total</p>
                <p className="mt-2 font-display text-3xl text-paper sm:text-4xl">
                  {Math.round(animatedBalance).toLocaleString('fr-FR')} <span className="text-lg text-paper-faint">F CFA</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <WeatherWidget />
            <div className="panel relative overflow-hidden p-5 sm:p-6 animate-rise stagger-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(62,207,142,0.14),_transparent_50%)]" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-paper-dim">
                  <ShieldCheck size={16} className="text-gain" /> Recommandation
                </div>
                <h2 className="mt-3 font-display text-xl text-paper">{recommendation.title}</h2>
                <p className="mt-2 text-sm leading-6 text-paper-dim">{recommendation.body}</p>
                <div className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-sm ${recommendationTone}`}>
                  {recommendation.tone === 'gain' ? 'Équilibre renforcé' : recommendation.tone === 'loss' ? 'Attention requise' : 'Suivi simple'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="animate-rise stagger-1">
              <KpiCard label="Revenus du mois" value={totalIncome} trendPct={incomeChange} tone="gain" size="lg" icon={<ArrowUpRight size={16} className="text-gain" />} />
            </div>
            <div className="animate-rise stagger-2">
              <KpiCard label="Dépenses du mois" value={totalExpenses} trendPct={expenseChange ? -Math.abs(expenseChange) * (expenseChange > 0 ? 1 : -1) : 0} tone="loss" size="lg" icon={<ArrowDownRight size={16} className="text-loss" />} />
            </div>
          </div>

          <div className="animate-rise stagger-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base text-paper">Comptes</h2>
              <Link to="/accounts" className="inline-flex items-center gap-1 text-xs font-medium text-brass transition-colors hover:text-brass/80">
                Gérer <ArrowRight size={13} />
              </Link>
            </div>
            {accounts.length === 0 ? (
              <div className="panel">
                <EmptyState
                  icon={Landmark}
                  title="Aucun compte enregistré"
                  description="Ajoutez un compte pour suivre son solde et le relier à vos transactions."
                  action={
                    <Link to="/accounts" className="text-sm font-medium text-brass hover:text-brass/80">
                      Créer un compte →
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {accounts.map((a) => <AccountChip key={a.id} account={a} />)}
              </div>
            )}
          </div>

          {budgetStatus.length > 0 && (
            <div className="panel animate-rise p-5 sm:p-6 stagger-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base text-paper">Budgets du mois</h3>
                <Link to="/budgets" className="text-xs font-medium text-brass transition-colors hover:text-brass/80">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-4">
                {budgetStatus.map((b) => (
                  <div key={b.id}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-paper">{b.category}</span>
                      <span className="font-mono-figures text-paper-dim">
                        {b.spent.toLocaleString('fr-FR')} / {b.amount.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-850">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          b.pct >= 100 ? 'bg-loss' : b.pct >= 80 ? 'bg-brass' : 'bg-info'
                        }`}
                        style={{ width: `${Math.min(100, b.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="animate-rise stagger-5"><LineChartFinance data={chartData} /></div>
            <div className="animate-rise stagger-6"><PieChartFinance data={pieData} /></div>
          </div>

          <div className="panel animate-rise p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base text-paper">Activité récente</h2>
              <Link to="/transactions" className="inline-flex items-center gap-1 text-xs font-medium text-brass transition-colors hover:text-brass/80">
                Gérer les transactions <ArrowRight size={13} />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <EmptyState
                icon={ArrowUpRight}
                title="Aucune transaction"
                description="Utilisez le bouton « Ajouter » en haut de l'écran pour créer votre première transaction."
              />
            ) : (
              <div className="divide-y hairline">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      t.type === 'income' ? 'bg-gain-soft text-gain' : 'bg-loss-soft text-loss'
                    }`}>
                      {t.type === 'income' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-paper">{t.description}</p>
                      <p className="text-xs text-paper-faint">{t.category || 'Sans catégorie'}</p>
                    </div>
                    <span className={`shrink-0 font-mono-figures text-sm tabular-nums ${t.type === 'income' ? 'text-gain' : 'text-loss'}`}>
                      {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('fr-FR')} F
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
