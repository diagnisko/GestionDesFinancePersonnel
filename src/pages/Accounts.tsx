import { useState } from 'react';
import { Landmark, PiggyBank, Wallet, CreditCard, Trash2, Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import EmptyState from '../components/common/EmptyState';
import { useAccounts } from '../hooks/useAccounts';
import type { AccountDTO } from '../services/api';

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Compte courant', icon: Landmark },
  { value: 'savings', label: 'Épargne', icon: PiggyBank },
  { value: 'cash', label: 'Espèces', icon: Wallet },
  { value: 'credit', label: 'Crédit', icon: CreditCard },
] as const;

export default function AccountsPage() {
  const { accounts, loading, error, addAccount, removeAccount } = useAccounts();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountDTO['type']>('checking');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('XOF');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addAccount({ name: name.trim(), type, balance: parseFloat(balance) || 0, currency });
      setName(''); setBalance(''); setCurrency('XOF');
    } catch { /* silencieux */ }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const fieldClass = 'w-full bg-ink-850 border hairline rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-paper-faint outline-none focus:border-brass/50 transition-colors';

  return (
    <DashboardLayout title="Comptes">
      <div className="panel p-6 mb-5">
        <p className="text-xs font-medium text-paper-dim uppercase tracking-wide mb-2">Solde total</p>
        <p className="font-display font-mono-figures text-3xl text-paper tabular-nums">
          {totalBalance.toLocaleString('fr-FR')} <span className="text-base text-paper-faint font-sans">{currency}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleSubmit} className="panel p-5 sm:p-6 lg:col-span-1 h-fit">
          <h2 className="font-display text-base text-paper mb-4">Nouveau compte</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Nom</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Compte courant" className={fieldClass} />
            </div>
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as AccountDTO['type'])} className={fieldClass}>
                {ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Solde initial (F)</label>
              <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" className={`${fieldClass} font-mono-figures`} />
            </div>
            <div>
              <label className="block text-xs text-paper-dim mb-1.5">Devise</label>
              <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className={fieldClass} />
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-1.5 bg-brass text-ink-950 font-medium py-2.5 rounded-lg hover:bg-brass/90 transition-colors text-sm">
              <Plus size={15} strokeWidth={2.25} /> Créer le compte
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          {error && <p className="text-loss mb-4 text-sm">{error}</p>}

          {loading && accounts.length === 0 ? (
            <p className="text-paper-dim text-sm">Chargement…</p>
          ) : accounts.length === 0 ? (
            <div className="panel"><EmptyState icon={Landmark} title="Aucun compte enregistré" description="Créez votre premier compte avec le formulaire ci-contre." /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map((a) => {
                const Icon = ACCOUNT_TYPES.find((t) => t.value === a.type)?.icon || Landmark;
                return (
                  <div key={a.id} className="panel panel-hover p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-ink-850 flex items-center justify-center">
                        <Icon size={16} strokeWidth={1.75} className="text-brass" />
                      </div>
                      <button type="button" onClick={() => removeAccount(a.id)} className="text-paper-faint hover:text-loss p-1 transition-colors" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="text-paper font-medium text-sm mb-0.5">{a.name}</h3>
                    <p className="text-xs text-paper-faint mb-3">
                      {ACCOUNT_TYPES.find((t) => t.value === a.type)?.label || a.type} · {a.currency}
                    </p>
                    <p className="font-mono-figures text-xl text-paper tabular-nums">
                      {a.balance.toLocaleString('fr-FR')} <span className="text-xs text-paper-faint">{a.currency}</span>
                    </p>
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
