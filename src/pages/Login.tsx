import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Landmark, PieChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Email ou mot de passe incorrect.'));
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = 'w-full px-4 py-3 rounded-lg bg-ink-850 border hairline focus:border-brass/50 outline-none text-paper placeholder:text-paper-faint transition-colors';

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl panel overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <Link to="/" className="inline-block mb-8 font-display font-semibold text-xl text-paper">
              Finance<span className="text-gradient-brass">Flow</span>
            </Link>

            <h1 className="font-display text-3xl text-paper mb-1">Connexion</h1>
            <p className="text-sm text-paper-dim mb-7">Accédez à votre tableau de bord.</p>

            {error && <div className="mb-5 p-3 text-loss bg-loss-soft border border-loss/30 rounded-lg text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-paper-dim mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@domaine.com" className={fieldClass} disabled={loading} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-medium text-paper-dim">Mot de passe</label>
                  <Link to="/forgot-password" className="text-xs text-brass hover:text-brass/80">Mot de passe oublié ?</Link>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={fieldClass} disabled={loading} />
              </div>
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-brass text-ink-950 font-medium py-3 rounded-lg hover:bg-brass/90 transition-colors disabled:opacity-50">
                {loading ? 'Connexion…' : 'Se connecter'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="text-paper-dim text-sm mt-6">
              Pas encore de compte ? <Link to="/register" className="text-brass font-medium hover:text-brass/80">S'inscrire</Link>
            </p>
          </div>

          <div className="hidden md:flex flex-col justify-center gap-5 p-10 bg-ink-850 border-l hairline">
            {[
              { icon: Landmark, text: 'Comptes multiples centralisés dans une seule interface.' },
              { icon: PieChart, text: 'Budgets par catégorie avec alertes de dépassement.' },
              { icon: ShieldCheck, text: 'Mots de passe hachés, données cloisonnées par compte.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-ink-900 border hairline flex items-center justify-center shrink-0">
                  <item.icon size={16} strokeWidth={1.75} className="text-brass" />
                </div>
                <p className="text-sm text-paper-dim leading-relaxed pt-1.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
