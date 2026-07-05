import { useState } from 'react';
import Modal from './Modal';
import { CATEGORIES } from '../../hooks/useFinanceData';
import { useAccounts } from '../../hooks/useAccounts';
import { getErrorMessage, type CreateTransactionPayload } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTransactionPayload) => Promise<unknown>;
}

/**
 * Formulaire de création de transaction, présenté en modale.
 * Accessible depuis n'importe quelle page via le bouton "Ajouter" de la
 * barre supérieure — il n'appartient donc à aucune page en particulier,
 * dashboard compris.
 */
export default function TransactionFormModal({ isOpen, onClose, onSubmit }: Props) {
  const { accounts } = useAccounts();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setDesc(''); setAmount(''); setType('expense'); setCategory(''); setAccountId(''); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError('');
    if (!desc.trim() || !amount.trim() || Number(amount) <= 0) {
      setError('Saisissez une description et un montant valides.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        description: desc.trim(),
        amount: Number(amount),
        type,
        currency: 'XOF',
        category: category || undefined,
        accountId: accountId ? Number(accountId) : undefined,
      });
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err, "Erreur lors de l'ajout."));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = 'w-full bg-ink-850 border hairline rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-paper-faint focus:border-brass/50 transition-colors outline-none';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nouvelle transaction" maxWidthClass="max-w-lg">
      <div className="flex gap-2 mb-4 mt-2">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === t
                ? t === 'income' ? 'bg-gain-soft text-gain border border-gain/30' : 'bg-loss-soft text-loss border border-loss/30'
                : 'bg-ink-850 text-paper-dim border hairline hover:text-paper'
            }`}
          >
            {t === 'income' ? 'Revenu' : 'Dépense'}
          </button>
        ))}
      </div>

      {error && <p className="mb-3 text-sm text-loss">{error}</p>}

      <div className="space-y-3">
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          disabled={submitting}
          className={fieldClass}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant (F)"
          min="1"
          disabled={submitting}
          className={`${fieldClass} font-mono-figures`}
        />
        <div className="grid grid-cols-2 gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={submitting} className={fieldClass}>
            <option value="">Catégorie</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)} disabled={submitting} className={fieldClass}>
            <option value="">Aucun compte</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-5 w-full py-2.5 rounded-lg bg-brass text-ink-950 font-medium text-sm hover:bg-brass/90 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Ajout en cours…' : 'Ajouter la transaction'}
      </button>
    </Modal>
  );
}
