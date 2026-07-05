import { KeyRound, ShieldCheck, Fingerprint } from "lucide-react";

const points = [
  { icon: KeyRound, title: "Mots de passe hachés", desc: "Vos identifiants ne sont jamais stockés ni transmis en clair : le hachage se fait côté serveur avant tout enregistrement en base." },
  { icon: ShieldCheck, title: "Données cloisonnées par compte", desc: "Chaque transaction, budget et objectif est rattaché à votre compte et vérifié côté serveur avant toute lecture ou modification." },
  { icon: Fingerprint, title: "Sessions par jeton", desc: "L'authentification repose sur des jetons signés à durée limitée, renouvelés automatiquement sans jamais réexposer votre mot de passe." },
];

const Security = () => {
  return (
    <section id="security" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brass mb-4">Sécurité</p>
          <h2 className="font-display font-semibold text-4xl lg:text-5xl tracking-tight mb-4 text-paper">
            Vos finances vous appartiennent
          </h2>
          <p className="text-paper-dim text-base max-w-xl mx-auto">
            Une application de gestion financière traite des données sensibles. Voici, concrètement, comment elles sont protégées.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {points.map((p) => (
            <div key={p.title} className="panel p-6">
              <div className="w-11 h-11 bg-brass-soft rounded-xl flex items-center justify-center mb-5">
                <p.icon size={19} strokeWidth={1.6} className="text-brass" />
              </div>
              <h3 className="font-display font-medium text-base text-paper mb-2">{p.title}</h3>
              <p className="text-sm text-paper-dim leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
