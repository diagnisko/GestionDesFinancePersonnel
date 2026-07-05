import { useEffect, useState } from 'react';
import { UserRound, LogOut } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { usersApi } from '../services/api';

interface UserProfile {
  id: string | number;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

const fieldClass = 'mt-1 w-full bg-ink-850 border hairline rounded-lg px-3 py-2 text-sm text-paper outline-none focus:border-brass/50 transition-colors';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await usersApi.me();
        setProfile(data);
        setFirstname(data.firstname || '');
        setLastname(data.lastname || '');
        setPhone(data.phone || '');
      } catch {
        setProfile(user);
        setFirstname((user?.name || '').split(' ')[0] || '');
        setLastname((user?.name || '').split(' ').slice(1).join(' ') || '');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      const updated = await usersApi.updateMe({ firstname, lastname, phone });
      setProfile(updated);
      setEditing(false);
      setMessage('Profil mis à jour');
      setTimeout(() => setMessage(''), 2500);
    } catch {
      setMessage('Erreur lors de la mise à jour.');
    }
  };

  const initials = `${(profile?.firstname || user?.name || '?')[0] || ''}${(profile?.lastname || '')[0] || ''}`.toUpperCase();

  if (loading) {
    return (
      <DashboardLayout title="Profil">
        <div className="panel p-6 max-w-lg">
          <p className="text-paper-dim animate-pulse-soft text-sm">Chargement…</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profil">
      <div className="panel p-6 sm:p-8 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brass-soft border border-brass/30 flex items-center justify-center shrink-0">
            <span className="font-display text-lg text-brass">{initials || <UserRound size={20} />}</span>
          </div>
          <div>
            <h2 className="font-display text-lg text-paper">{profile?.firstname || user?.name || 'Utilisateur'} {profile?.lastname || ''}</h2>
            <p className="text-xs text-paper-faint">{profile?.email || user?.email}</p>
          </div>
        </div>

        {message && <p className="mb-4 text-sm text-gain">{message}</p>}

        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium text-paper-dim uppercase tracking-wide">E-mail</dt>
            <dd className="mt-1 text-sm text-paper">{profile?.email || user?.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-paper-dim uppercase tracking-wide">Prénom</dt>
            {editing ? (
              <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} className={fieldClass} />
            ) : (
              <dd className="mt-1 text-sm text-paper">{profile?.firstname || '—'}</dd>
            )}
          </div>
          <div>
            <dt className="text-xs font-medium text-paper-dim uppercase tracking-wide">Nom</dt>
            {editing ? (
              <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className={fieldClass} />
            ) : (
              <dd className="mt-1 text-sm text-paper">{profile?.lastname || '—'}</dd>
            )}
          </div>
          <div>
            <dt className="text-xs font-medium text-paper-dim uppercase tracking-wide">Téléphone</dt>
            {editing ? (
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
            ) : (
              <dd className="mt-1 text-sm text-paper">{profile?.phone || '—'}</dd>
            )}
          </div>
          <div>
            <dt className="text-xs font-medium text-paper-dim uppercase tracking-wide">Identifiant</dt>
            <dd className="mt-1 text-sm font-mono-figures text-paper-dim">{profile?.id || user?.id || '—'}</dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button type="button" onClick={handleSave} className="bg-brass text-ink-950 font-medium text-sm py-2 px-4 rounded-lg hover:bg-brass/90 transition-colors">
                Sauvegarder
              </button>
              <button type="button" onClick={() => setEditing(false)} className="border hairline text-paper text-sm py-2 px-4 rounded-lg hover:bg-ink-850 transition-colors">
                Annuler
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="bg-brass text-ink-950 font-medium text-sm py-2 px-4 rounded-lg hover:bg-brass/90 transition-colors">
              Modifier
            </button>
          )}
        </div>

        <button type="button" onClick={logout} className="mt-5 text-sm text-loss hover:text-loss/80 flex items-center gap-1.5 transition-colors">
          <LogOut size={14} /> Se déconnecter
        </button>
      </div>
    </DashboardLayout>
  );
}
