import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

interface Props {
  label: string;
  value: number;
  trendPct?: number;
  tone?: 'default' | 'gain' | 'loss';
  icon?: ReactNode;
  size?: 'lg' | 'md';
}

const toneText: Record<string, string> = {
  default: 'text-paper',
  gain: 'text-gain',
  loss: 'text-loss',
};

export default function KpiCard({ label, value, trendPct, tone = 'default', icon, size = 'md' }: Props) {
  const animated = useCountUp(value);
  const trendUp = (trendPct ?? 0) >= 0;

  return (
    <div className="panel panel-hover p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-paper-dim uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <p className={`font-display font-mono-figures tabular-nums ${toneText[tone]} ${size === 'lg' ? 'text-4xl' : 'text-2xl'}`}>
        {Math.round(animated).toLocaleString('fr-FR')} <span className="text-base text-paper-faint font-sans">F</span>
      </p>
      {trendPct !== undefined && trendPct !== 0 && (
        <div className={`inline-flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-gain' : 'text-loss'}`}>
          {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {trendUp ? '+' : ''}{trendPct}% vs mois dernier
        </div>
      )}
    </div>
  );
}
