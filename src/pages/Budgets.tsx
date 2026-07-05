import { useState, useMemo } from 'react';
import { AlertTriangle, PieChart, Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import EmptyState from '../components/common/EmptyState';
import { useBudgets } from '../hooks/useBudgets';
import { useFinanceData, CATEGORIES } from '../hooks/useFinanceData';

export default function BudgetsPage() {
  const { budgets, alerts, loading, error, addBudget } = useBudgets();
  const { expenses } = useFinanceData();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Autre';
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;
    try { await addBudget({ category, amount: parseFloat(amount) }); setCategory(''); setAmount(''); } catch { /* silencieux */ }
  };

  const barColor = (pct: number) => (pct >= 100 ? 'bg-loss' : pct >= 80 ? 'bg-brass' : 'bg-info');
  const badgeClass = (pct: number) =>
    pct >= 100 ? 'bg-loss-soft text-loss' : pct >= 80 ? 'bg-brass-soft text-brass' : 'bg-info-soft text-info';
  const fieldClass = 'w-full bg-ink-850 border hairline rounded-lg px-3 py-2.5 text-sm text-paper outline-none focus:border-brass/50 transition-colors';

  return (
    <DashboardLayout title="Budgets & alertes">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5 h-fit">
          <form onSubmit={handleSubmit} className="panel p-5 sm:p-6">
            <h2 className="font-display text-base text-paper mb-4">Nouveau budget</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-paper-dim mb-1.5">Catégorie</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
                  <option value="">Sélectionner…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-paper-dim mb-1.5">Montant mensuel (F)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" min="1" required className={`${fieldClass} font-mono-figures`} />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-1.5 bg-brass text-ink-950 font-medium py-2.5 rounded-lg hover:bg-brass/90 transition-colors text-sm">
                <Plus size={15} strokeWidth={2.25} /> Créer le budget
              </button>
            </div>
          </form>

          {alerts.length > 0 && (
            <div className="panel p-5 sm:p-6" style={{ borderColor: 'color-mix(in srgb, var(--color-loss) 30%, transparent)' }}>
              <h3 className="text-loss font-medium text-sm mb-3 flex items-center gap-2">
                <AlertTriangle size={15} /> Alertes budget
              </h3>
              <ul className="space-y-2">
                {alerts.map((a) => (
                  <li key={a.category} className="text-sm text-paper">
                    <span className="font-medium">{a.category}</span>
                    <span className="text-paper-dim font-mono-figures"> · {a.spent.toLocaleString('fr-FR')} / {a.budget.toLocaleString('fr-FR')} F ({a.percentage}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {error && <p className="text-loss mb-4 text-sm">{error}</p>}

          {loading && budgets.length === 0 ? (
            <p className="text-paper-dim text-sm">Chargement…</p>
          ) : budgets.length === 0 ? (
            <div className="panel"><EmptyState icon={PieChart} title="Aucun budget défini" description="Créez un budget mensuel par catégorie avec le formulaire ci-contre." /></div>
          ) : (
            <div className="space-y-4">
              {budgets.map((b) => {
                const spent = spentByCategory[b.category] || 0;
                const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
                return (
                  <div key={b.id} className="panel p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-paper font-medium text-sm">{b.category}</h3>
                        <p className="text-xs text-paper-faint">Budget : {b.amount.toLocaleString('fr-FR')} F / mois</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-md font-mono-figures ${badgeClass(pct)}`}>{pct}%</span>
                    </div>
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-paper-dim">Dépensé</span>
                      <span className="font-mono-figures text-paper tabular-nums">{spent.toLocaleString('fr-FR')} / {b.amount.toLocaleString('fr-FR')} F</span>
                    </div>
                    <div className="w-full bg-ink-850 rounded-full h-2 overflow-hidden">
                      <div className={`${barColor(pct)} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    {pct >= 80 && (
                      <p className="mt-2 text-xs text-brass flex items-center gap-1.5">
                        <AlertTriangle size={12} /> {pct >= 100 ? 'Budget dépassé' : 'Vous approchez de la limite'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
