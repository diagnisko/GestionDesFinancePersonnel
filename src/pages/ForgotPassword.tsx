import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { authApi, getErrorMessage } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Veuillez entrer votre email.'); return; }
    if (!email.includes('@')) { setError('Email invalide.'); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors de la demande.'));
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

            <h1 className="font-display text-3xl text-paper mb-1">Mot de passe oublié</h1>

            {submitted ? (
              <div className="space-y-6 mt-6">
                <div className="p-3.5 text-gain bg-gain-soft border border-gain/30 rounded-lg text-sm flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation a été envoyé.</span>
                </div>
                <p className="text-paper-dim text-sm">Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</p>
                <Link to="/login" className="inline-block w-full bg-brass text-ink-950 font-medium py-3 rounded-lg text-center hover:bg-brass/90 transition-colors">
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-paper-dim mb-6">Saisissez votre email, nous vous enverrons un lien de réinitialisation.</p>
                {error && <div className="mb-5 p-3 text-loss bg-loss-soft border border-loss/30 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@domaine.com" className={fieldClass} disabled={loading} />
                  <button type="submit" disabled={loading} className="w-full bg-brass text-ink-950 font-medium py-3 rounded-lg hover:bg-brass/90 transition-colors disabled:opacity-50">
                    {loading ? 'Envoi…' : 'Envoyer le lien'}
                  </button>
                </form>

                <p className="text-sm text-paper-dim mt-6">
                  <Link to="/login" className="text-brass hover:text-brass/80">Retour à la connexion</Link>
                </p>
              </>
            )}
          </div>

          <div className="hidden md:flex flex-col items-center justify-center gap-4 p-10 bg-ink-850 border-l hairline text-center">
            <div className="w-12 h-12 rounded-full bg-ink-900 border hairline flex items-center justify-center">
              <KeyRound size={20} strokeWidth={1.5} className="text-brass" />
            </div>
            <p className="text-sm text-paper-dim leading-relaxed max-w-xs">
              Un lien de réinitialisation sécurisé, à durée limitée, est envoyé à l'adresse associée à votre compte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
