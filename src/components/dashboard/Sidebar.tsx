import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Landmark, PieChart, Target, UserRound, ArrowLeft,
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const links = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/accounts', label: 'Comptes', icon: Landmark },
  { to: '/budgets', label: 'Budgets', icon: PieChart },
  { to: '/savings-goals', label: "Objectifs d'épargne", icon: Target },
  { to: '/profile', label: 'Profil', icon: UserRound },
];

export default function Sidebar({ open, onClose }: Props) {
  const nav = (
    <>
      <div className="px-2 mb-8">
        <span className="font-display font-semibold text-xl text-paper tracking-tight">
          Finance<span className="text-gradient-brass">Flow</span>
        </span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150',
                    isActive
                      ? 'bg-ink-800 text-paper font-medium'
                      : 'text-paper-dim hover:text-paper hover:bg-ink-850',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-1 h-4 rounded-full shrink-0 transition-colors ${
                        isActive ? 'bg-brass' : 'bg-transparent'
                      }`}
                    />
                    <Icon size={17} strokeWidth={1.75} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-4 mt-4 border-t hairline">
        <NavLink
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-paper-faint hover:text-paper-dim hover:bg-ink-850 transition-colors"
        >
          <ArrowLeft size={17} strokeWidth={1.75} />
          Retour au site
        </NavLink>
      </div>
    </>
  );

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade"
          aria-label="Fermer le menu"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-ink-950 border-r hairline
          px-4 py-6 flex flex-col
          transform transition-transform duration-200 ease-out
          lg:translate-x-0 lg:shrink-0
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {nav}
      </aside>
    </>
  );
}
