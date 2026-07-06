import { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Tags, AlertTriangle, Target, PieChart, Landmark, ArrowRight } from "lucide-react";

const features = [
  { icon: LineChart, title: "Suivi en temps réel", desc: "Visualisez l'évolution de votre solde, vos revenus et vos dépenses jour après jour avec des graphiques interactifs." },
  { icon: Tags, title: "Catégories claires", desc: "Classez chaque transaction — alimentation, transport, logement, loisirs… — pour savoir précisément où part votre argent." },
  { icon: AlertTriangle, title: "Alertes budgétaires", desc: "Définissez un budget mensuel par catégorie. Un indicateur s'affiche dès que vous atteignez 80% de votre budget." },
  { icon: Target, title: "Objectifs d'épargne", desc: "Créez des objectifs concrets — voyage, voiture, urgence — et suivez votre progression jusqu'à l'objectif." },
  { icon: PieChart, title: "Statistiques mensuelles", desc: "Répartition des dépenses par catégorie et évolution sur 6 mois, calculées directement à partir de vos transactions." },
  { icon: Landmark, title: "Multi-comptes", desc: "Gérez plusieurs comptes — courant, épargne, espèces, crédit — avec un solde mis à jour à chaque transaction." },
];

const Features = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brass mb-4">Fonctionnalités</p>
          <h2 className="font-display font-semibold text-4xl lg:text-5xl tracking-tight mb-4 text-paper">
            Tout ce dont vous avez besoin<br />
            <span className="text-paper-dim">pour maîtriser votre argent</span>
          </h2>
          <p className="text-paper-dim text-base max-w-xl mx-auto">
            Des outils pensés pour comprendre, planifier et suivre votre santé financière au quotidien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`panel p-6 cursor-default transition-all duration-300 ${hovered === i ? 'border-brass/30 -translate-y-1' : ''}`}
            >
              <div className={`w-11 h-11 bg-brass-soft rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 ${hovered === i ? 'scale-110' : ''}`}>
                <f.icon size={19} strokeWidth={1.6} className="text-brass" />
              </div>
              <h3 className="font-display font-medium text-base text-paper mb-2">{f.title}</h3>
              <p className="text-sm text-paper-dim leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 panel p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-semibold text-xl text-paper mb-1">Prêt à transformer vos finances ?</h3>
            <p className="text-paper-dim text-sm">Créez votre compte et ajoutez votre première transaction en moins de deux minutes.</p>
          </div>
          <Link to="/register" className="shrink-0 inline-flex items-center gap-2 bg-brass text-ink-950 font-medium px-6 py-3 rounded-xl text-sm hover:bg-brass/90 transition-all duration-200 hover:-translate-y-0.5">
            Démarrer maintenant — c'est gratuit
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
