import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t hairline pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative panel p-10 mb-16 overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-50 bg-brass/[0.06] rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-display font-semibold text-3xl lg:text-4xl mb-3 text-paper">
              Commencez dès aujourd'hui.<br />
              <span className="text-gradient-brass">C'est gratuit.</span>
            </h2>
            <p className="text-paper-dim text-sm mb-8 max-w-sm mx-auto">
              Aucune carte bancaire requise. Créez votre compte en 2 minutes et commencez à suivre vos finances.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="inline-flex items-center gap-2 bg-brass text-ink-950 font-medium px-7 py-3.5 rounded-xl text-sm hover:bg-brass/90 transition-all hover:-translate-y-0.5">
                Créer mon compte gratuitement
                <ArrowRight size={14} />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 border hairline text-paper font-medium px-7 py-3.5 rounded-xl text-sm hover:bg-ink-850 transition-all">
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block font-display font-semibold text-lg mb-4 text-paper">
              Finance<span className="text-gradient-brass">Flow</span>
            </Link>
            <p className="text-xs text-paper-dim leading-relaxed">
              La plateforme de gestion des finances personnelles pensée pour l'Afrique de l'Ouest.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper-faint mb-4">Produit</p>
            <ul className="space-y-2.5">
              {["Fonctionnalités", "Comment ça marche", "Sécurité"].map((item) => (
                <li key={item}><a href="#" className="text-sm text-paper-dim hover:text-paper transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper-faint mb-4">Ressources</p>
            <ul className="space-y-2.5">
              {["Documentation", "Support"].map((item) => (
                <li key={item}><a href="#" className="text-sm text-paper-dim hover:text-paper transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper-faint mb-4">Légal</p>
            <ul className="space-y-2.5">
              {["Politique de confidentialité", "Conditions d'utilisation"].map((item) => (
                <li key={item}><a href="#" className="text-sm text-paper-dim hover:text-paper transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t hairline pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-paper-faint">© 2026 FinanceFlow. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
