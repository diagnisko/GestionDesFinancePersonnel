import { useMemo, useState } from 'react';
import { Search, Download, Pencil, Trash2, Check, X, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useFinanceData, CATEGORIES } from '../hooks/useFinanceData';
import { transactionsApi } from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';
import TransactionFormModal from '../components/common/TransactionFormModal';
import EmptyState from '../components/common/EmptyState';

export default function TransactionsPage() {
  const { income, expenses, addTransaction, deleteTransaction, updateTransaction } = useFinanceData();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<'income' | 'expense'>('expense');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const rows = useMemo(() => {
    let list = [
      ...income.map((i) => ({ id: i.id, description: i.description, amount: i.amount, type: 'income' as const, category: i.category || '', createdAt: i.createdAt })),
      ...expenses.map((e) => ({ id: e.id, description: e.description, amount: e.amount, type: 'expense' as const, category: e.category || '', createdAt: e.createdAt })),
    ];
    if (filterType !== 'all') list = list.filter((r) => r.type === filterType);
    if (filterCategory) list = list.filter((r) => r.category === filterCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.description.toLowerCase().includes(q));
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [income, expenses, search, filterType, filterCategory]);

  const startEdit = (row: typeof rows[0]) => {
    setEditingId(row.id);
    setEditDesc(row.description);
    setEditAmount(String(row.amount));
    setEditCategory(row.category);
    setEditType(row.type);
  };

  const cancelEdit = () => {
    setEditingId(null); setEditDesc(''); setEditAmount(''); setEditCategory(''); setEditType('expense');
  };

  const saveEdit = async () => {
    if (!editingId || !editDesc.trim() || !editAmount) return;
    try {
      await updateTransaction(editingId, { description: editDesc.trim(), amount: parseFloat(editAmount), type: editType, category: editCategory || undefined });
      cancelEdit();
    } catch { /* silencieux, le formulaire reste ouvert */ }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await deleteTransaction(deleteId); setDeleteId(null); } catch { /* silencieux */ }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const csv = await transactionsApi.exportCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'transactions.csv';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch { /* silencieux */ } finally { setExporting(false); }
  };

  const editingRow = rows.find((r) => r.id === editingId);
  const fieldClass = 'bg-ink-850 border hairline rounded px-2 py-1.5 text-xs text-paper w-full outline-none focus:border-brass/50';

  return (
    <DashboardLayout title="Transactions">
      <div className="panel p-4 sm:p-6">
        {/* Filtres + actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une transaction…"
              className="w-full bg-ink-850 border hairline rounded-lg pl-9 pr-3 py-2 text-sm text-paper placeholder:text-paper-faint outline-none focus:border-brass/50"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="bg-ink-850 border hairline rounded-lg px-3 py-2 text-sm text-paper outline-none focus:border-brass/50"
          >
            <option value="all">Tous les types</option>
            <option value="income">Revenus</option>
            <option value="expense">Dépenses</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-ink-850 border hairline rounded-lg px-3 py-2 text-sm text-paper outline-none focus:border-brass/50"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center justify-center gap-1.5 bg-brass text-ink-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-brass/90 transition-colors shrink-0"
          >
            <Plus size={15} strokeWidth={2.25} /> Ajouter
          </button>
        </div>

        <div className="flex justify-between items-center mb-3">
          <p className="text-paper-dim text-xs">{rows.length} transaction{rows.length !== 1 ? 's' : ''}</p>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting || rows.length === 0}
            className="inline-flex items-center gap-1.5 text-xs text-paper-dim hover:text-paper border hairline px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download size={13} /> {exporting ? 'Export…' : 'CSV'}
          </button>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={ArrowUpRight}
            title="Aucune transaction"
            description="Ajoutez votre première transaction pour commencer à suivre vos finances."
            action={
              <button type="button" onClick={() => setShowAdd(true)} className="text-sm font-medium text-brass hover:text-brass/80">
                + Ajouter une transaction
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-paper">
              <thead>
                <tr className="border-b hairline text-paper-faint text-xs uppercase tracking-wide">
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Libellé</th>
                  <th className="py-3 pr-4 font-medium hidden sm:table-cell">Catégorie</th>
                  <th className="py-3 pr-4 font-medium hidden md:table-cell">Date</th>
                  <th className="py-3 text-right font-medium">Montant</th>
                  <th className="py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.type}-${r.id}`} className="border-b hairline last:border-0">
                    {editingId === r.id && editingRow ? (
                      <>
                        <td className="py-2.5 pr-4">
                          <select value={editType} onChange={(e) => setEditType(e.target.value as 'income' | 'expense')} className={fieldClass}>
                            <option value="income">Revenu</option>
                            <option value="expense">Dépense</option>
                          </select>
                        </td>
                        <td className="py-2.5 pr-4"><input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className={fieldClass} /></td>
                        <td className="py-2.5 pr-4 hidden sm:table-cell">
                          <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={fieldClass}>
                            <option value="">—</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="py-2.5 pr-4 text-paper-faint hidden md:table-cell text-xs">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="py-2.5 text-right"><input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className={`${fieldClass} text-right`} /></td>
                        <td className="py-2.5 text-right whitespace-nowrap">
                          <button type="button" onClick={saveEdit} className="text-gain hover:text-gain/80 p-1.5" title="Sauvegarder"><Check size={15} /></button>
                          <button type="button" onClick={cancelEdit} className="text-paper-faint hover:text-paper p-1.5" title="Annuler"><X size={15} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${r.type === 'income' ? 'text-gain' : 'text-loss'}`}>
                            {r.type === 'income' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                            {r.type === 'income' ? 'Revenu' : 'Dépense'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{r.description}</td>
                        <td className="py-3 pr-4 text-paper-dim hidden sm:table-cell">{r.category || '—'}</td>
                        <td className="py-3 pr-4 text-paper-faint hidden md:table-cell text-xs">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className={`py-3 text-right font-mono-figures tabular-nums ${r.type === 'income' ? 'text-gain' : 'text-loss'}`}>
                          {r.type === 'income' ? '+' : '-'}{r.amount.toLocaleString('fr-FR')} F
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <button type="button" onClick={() => startEdit(r)} className="text-info hover:text-info/80 p-1.5" title="Modifier"><Pencil size={14} /></button>
                          <button type="button" onClick={() => setDeleteId(r.id)} className="text-loss hover:text-loss/80 p-1.5" title="Supprimer"><Trash2 size={14} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionFormModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSubmit={addTransaction} />

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Supprimer la transaction"
        message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Supprimer"
        variant="danger"
      />
    </DashboardLayout>
  );
}
