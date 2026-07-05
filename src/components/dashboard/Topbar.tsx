import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFinanceData } from '../../hooks/useFinanceData';
import TransactionFormModal from '../common/TransactionFormModal';

interface Props {
  onOpenSidebar?: () => void;
  title?: string;
}

const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Topbar({ onOpenSidebar, title = 'Tableau de bord' }: Props) {
  const { user, logout } = useAuth();
  const { addTransaction } = useFinanceData();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);

  const firstName = user?.name?.split(' ')[0] || user?.name || 'là';

  return (
    <>
      <header className="sticky top-0 z-30 bg-ink-950/90 backdrop-blur-md border-b hairline">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {onOpenSidebar && (
              <button
                type="button"
                onClick={onOpenSidebar}
                className="lg:hidden p-2 rounded-lg border hairline text-paper-dim hover:text-paper hover:bg-ink-850"
                aria-label="Ouvrir le menu"
              >
                <Menu size={18} />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="font-display text-lg text-paper truncate">{title}</h1>
              <p className="text-xs text-paper-faint capitalize hidden sm:block">{weekday.format(new Date())}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-1.5 bg-brass text-ink-950 text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-brass/90 transition-colors"
            >
              <Plus size={16} strokeWidth={2.25} />
              <span className="hidden sm:inline">Ajouter</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l hairline">
              <span className="text-sm text-paper-dim truncate max-w-[120px]">Bonjour, {firstName}</span>
            </div>

            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="p-2 rounded-lg text-paper-faint hover:text-loss hover:bg-loss-soft transition-colors"
              aria-label="Déconnexion"
              title="Déconnexion"
            >
              <LogOut size={17} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <TransactionFormModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSubmit={addTransaction} />
    </>
  );
}
