import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const DashboardMockup = () => (
  <div className="relative animate-rise stagger-3">
    <div className="panel overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-850 border-b hairline">
        <span className="w-2.5 h-2.5 rounded-full bg-loss/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-brass/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-gain/60" />
        <span className="flex-1 mx-4 bg-ink-950 rounded-md px-3 py-1 text-[11px] text-paper-faint text-center">
          Aperçu du tableau de bord
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Solde", value: "482 000 F", color: "text-paper" },
            { label: "Revenus", value: "+120 000 F", color: "text-gain" },
            { label: "Dépenses", value: "-38 000 F", color: "text-loss" },
          ].map((card) => (
            <div key={card.label} className="bg-ink-850 rounded-xl p-3 border hairline">
              <span className="text-[10px] text-paper-faint uppercase tracking-widest block mb-2">{card.label}</span>
              <p className={`font-display font-mono-figures text-sm leading-tight ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-ink-850 rounded-xl p-4 border hairline">
          <p className="text-[11px] text-paper-faint mb-3">Évolution mensuelle</p>
          <div className="flex items-end gap-2 h-20">
            {[45, 62, 38, 78, 55, 90, 67, 85, 48, 72, 58, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background: i === 11 ? '#c89b4a' : 'rgba(200,155,74,0.22)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="bg-ink-850 rounded-xl p-4 border hairline">
          <p className="text-[11px] text-paper-faint mb-3">Transactions récentes</p>
          <div className="space-y-2.5">
            {[
              { name: "Supermarché", cat: "Alimentation", amt: "-18 500 F", neg: true },
              { name: "Salaire", cat: "Revenus", amt: "+120 000 F", neg: false },
              { name: "Loyer", cat: "Logement", amt: "-45 000 F", neg: true },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.neg ? '#ff6b57' : '#3ecf8e' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-paper truncate">{t.name}</p>
                  <p className="text-[10px] text-paper-faint">{t.cat}</p>
                </div>
                <span className={`text-xs font-mono-figures shrink-0 ${t.neg ? "text-loss" : "text-gain"}`}>{t.amt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="text-center text-[11px] text-paper-faint mt-3">Aperçu de l'interface — données d'exemple</p>
  </div>
);

const capabilities = [
  "Comptes multiples (courant, épargne, espèces, crédit)",
  "Budgets par catégorie avec alertes de dépassement",
  "Objectifs d'épargne avec suivi de progression",
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[560px] h-[560px] bg-brass/[0.05] rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brass-soft border border-brass/25 text-brass text-xs font-medium px-4 py-1.5 rounded-full mb-6 animate-rise">
              <span className="w-1.5 h-1.5 rounded-full bg-brass" />
              Gestion de finances personnelles
            </div>

            <h1 className="font-display font-semibold text-5xl lg:text-6xl leading-[1.08] tracking-tight mb-5 text-paper animate-rise stagger-1">
              Un seul endroit pour <span className="text-gradient-brass">suivre votre argent</span>
            </h1>

            <p className="text-paper-dim text-lg leading-relaxed mb-8 max-w-md animate-rise stagger-2">
              FinanceFlow centralise vos comptes, vos transactions et vos budgets pour que vous sachiez, à tout moment, où va votre argent.
            </p>

            <div className="flex flex-wrap gap-3 mb-12 animate-rise stagger-2">
              <Link to="/register" className="inline-flex items-center gap-2 bg-brass text-ink-950 font-medium px-6 py-3 rounded-xl text-sm hover:bg-brass/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                Créer un compte gratuit
                <ArrowRight size={15} />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 border hairline text-paper font-medium px-6 py-3 rounded-xl text-sm hover:bg-ink-850 transition-all duration-200">
                Se connecter
              </Link>
            </div>

            <ul className="space-y-3 animate-rise stagger-3">
              {capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-paper-dim">
                  <span className="w-5 h-5 rounded-full bg-brass-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-brass" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
