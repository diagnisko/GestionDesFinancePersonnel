import { UserPlus, Landmark, Target, TrendingUp, Check } from "lucide-react";

const steps = [
  { title: "Créez votre compte", desc: "Inscription en moins de 2 minutes, sans carte bancaire.", icon: UserPlus },
  { title: "Ajoutez vos comptes", desc: "Créez vos comptes — courant, épargne, espèces, crédit — avec leur solde de départ.", icon: Landmark },
  { title: "Catégorisez & planifiez", desc: "Définissez un budget par catégorie. FinanceFlow compare vos dépenses réelles et signale les dépassements.", icon: Target },
  { title: "Atteignez vos objectifs", desc: "Suivez vos progrès et ajustez vos habitudes grâce aux statistiques mensuelles.", icon: TrendingUp },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brass mb-4">Comment ça marche</p>
          <h2 className="font-display font-semibold text-4xl lg:text-5xl tracking-tight mb-4 text-paper">
            Démarrez en 4 étapes simples
          </h2>
          <p className="text-paper-dim text-base max-w-md mx-auto">
            Pas besoin d'être expert en finance. FinanceFlow vous guide pas à pas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-ink-border" />

          {steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-[72px] h-[72px] bg-ink-900 border hairline rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5">
                  <step.icon size={24} strokeWidth={1.5} className="text-brass" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-semibold text-ink-950 bg-brass">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-medium text-base text-paper mb-2">{step.title}</h3>
              <p className="text-sm text-paper-dim leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="panel p-6 space-y-3">
            <p className="text-xs text-paper-dim font-medium mb-4 uppercase tracking-widest">Vue budget mensuel</p>
            {[
              { cat: "Alimentation", budget: 150000, spent: 112000 },
              { cat: "Transport", budget: 60000, spent: 58000 },
              { cat: "Loisirs", budget: 50000, spent: 71000 },
              { cat: "Logement", budget: 200000, spent: 200000 },
              { cat: "Santé", budget: 30000, spent: 8500 },
            ].map((item) => {
              const pct = Math.min((item.spent / item.budget) * 100, 100);
              const over = item.spent > item.budget;
              return (
                <div key={item.cat}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-paper">{item.cat}</span>
                    <span className={`text-xs font-mono-figures ${over ? "text-loss" : "text-paper-dim"}`}>
                      {item.spent.toLocaleString("fr-FR")} / {item.budget.toLocaleString("fr-FR")} F
                    </span>
                  </div>
                  <div className="h-1.5 bg-ink-850 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: over ? '#ff6b57' : '#c89b4a' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <span className="inline-block bg-brass-soft text-brass text-xs font-medium px-3 py-1 rounded-full mb-4">
              Budgets intelligents
            </span>
            <h2 className="font-display font-semibold text-3xl tracking-tight mb-4 leading-tight text-paper">
              Ne dépassez plus jamais<br />votre budget
            </h2>
            <p className="text-paper-dim text-sm leading-relaxed mb-6">
              Visualisez en un coup d'œil les catégories où vous êtes en dépassement, avec un indicateur dès que vous approchez de la limite.
            </p>
            <ul className="space-y-3">
              {[
                "Définissez des budgets par catégorie en quelques secondes",
                "Indicateur visuel à 80% et 100% du budget",
                "Historique des dépassements mois par mois",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-paper-dim">
                  <span className="w-5 h-5 rounded-full bg-brass-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-brass" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
