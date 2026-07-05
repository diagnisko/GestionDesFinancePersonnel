import { useState } from 'react';
import { Target, Pencil, Trash2, CheckCircle2, Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import EmptyState from '../components/common/EmptyState';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import ConfirmModal from '../components/common/ConfirmModal';

export default function SavingsGoalsPage() {
  const { goals, loading, error, addGoal, removeGoal, updateGoal } = useSavingsGoals();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    try {
      await addGoal({ name, targetAmount: parseFloat(targetAmount), currentAmount: parseFloat(currentAmount) || 0, deadline: deadline || undefined });
      setName(''); setTargetAmount(''); setCurrentAmount('0'); setDeadline('');
    } catch { /* silencieux */ }
  };

  const startEdit = (id: number, amount: number) => { setEditingId(id); setEditAmount(String(amount)); };
  const saveEdit = async () => {
    if (!editingId) return;
    try { await updateGoal(editingId, { currentAmount: parseFloat(editAmount) || 0 }); setEditingId(null); } catch { /* silencieux */ }
  };

  const progress = (g: typeof goals[0]) => (g.targetAmount <= 0 ? 0 : Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)));
  const fieldClass = 'w-full bg-ink-850 border hairline rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-paper-faint outline-none focus:border-brass/50 transition-colors';

  return (
    <DashboardLayout title="Objectifs d'épargne">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleSubmit} className="panel p-5 sm:p-6 lg:col-span-1 h-fit">
          <h2 className="font-display text-base text-paper mb-4">Nouvel objectif</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Nom</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Vacances, voiture…" className={fieldClass} />
            </div>
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Montant cible (F)</label>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0" min="1" required className={`${fieldClass} font-mono-figures`} />
            </div>
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Montant actuel (F)</label>
              <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} min="0" className={`${fieldClass} font-mono-figures`} />
            </div>
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Date limite (optionnel)</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={fieldClass} />
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-1.5 bg-brass text-ink-950 font-medium py-2.5 rounded-lg hover:bg-brass/90 transition-colors text-sm">
              <Plus size={15} strokeWidth={2.25} /> Créer l'objectif
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          {error && <p className="text-loss mb-4 text-sm">{error}</p>}

          {loading && goals.length === 0 ? (
            <p className="text-paper-dim text-sm">Chargement…</p>
          ) : goals.length === 0 ? (
            <div className="panel"><EmptyState icon={Target} title="Aucun objectif d'épargne" description="Créez un objectif — vacances, voiture, urgence — avec le formulaire ci-contre." /></div>
          ) : (
            <div className="space-y-4">
              {goals.map((g) => {
                const pct = progress(g);
                const isEditing = editingId === g.id;
                return (
                  <div key={g.id} className="panel p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-paper font-medium text-sm">{g.name}</h3>
                        <p className="text-xs text-paper-faint">
                          {g.deadline ? `Échéance : ${new Date(g.deadline).toLocaleDateString('fr-FR')}` : 'Sans échéance'}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => startEdit(g.id, g.currentAmount)} className="text-info hover:text-info/80 p-1.5" title="Modifier le montant"><Pencil size={14} /></button>
                        <button type="button" onClick={() => setDeleteId(g.id)} className="text-loss hover:text-loss/80 p-1.5" title="Supprimer"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mb-2">
                      <div>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            className="bg-ink-850 border border-brass/50 rounded-lg px-2 py-1 text-lg font-mono-figures text-paper w-32 tabular-nums outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="font-display font-mono-figures text-2xl text-paper tabular-nums">{g.currentAmount.toLocaleString('fr-FR')} F</span>
                        )}
                        <span className="text-paper-dim text-sm ml-2 font-mono-figures">/ {g.targetAmount.toLocaleString('fr-FR')} F</span>
                      </div>
                      <span className="text-sm font-medium text-brass font-mono-figures">{pct}%</span>
                    </div>

                    <div className="w-full bg-ink-850 rounded-full h-2 overflow-hidden">
                      <div className="bg-brass h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>

                    {pct >= 100 && (
                      <p className="mt-2 text-xs text-gain font-medium flex items-center gap-1.5"><CheckCircle2 size={13} /> Objectif atteint</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Supprimer l'objectif"
        message="Êtes-vous sûr de vouloir supprimer cet objectif d'épargne ?"
        onConfirm={async () => { if (deleteId) { await removeGoal(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
        confirmText="Supprimer"
        variant="danger"
      />
    </DashboardLayout>
  );
}
