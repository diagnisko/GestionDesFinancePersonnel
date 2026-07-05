import { Landmark, PiggyBank, Wallet, CreditCard } from 'lucide-react';
import type { AccountDTO } from '../../services/api';

const iconByType: Record<AccountDTO['type'], typeof Landmark> = {
  checking: Landmark,
  savings: PiggyBank,
  cash: Wallet,
  credit: CreditCard,
};

const labelByType: Record<AccountDTO['type'], string> = {
  checking: 'Compte courant',
  savings: 'Épargne',
  cash: 'Espèces',
  credit: 'Crédit',
};

export default function AccountChip({ account }: { account: AccountDTO }) {
  const Icon = iconByType[account.type];

  return (
    <div className="panel panel-hover shrink-0 w-52 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-paper-dim">
        <Icon size={15} strokeWidth={1.75} />
        <span className="text-xs uppercase tracking-wide">{labelByType[account.type]}</span>
      </div>
      <p className="text-sm text-paper font-medium truncate">{account.name}</p>
      <p className="font-mono-figures text-lg text-paper tabular-nums">
        {account.balance.toLocaleString('fr-FR')} <span className="text-xs text-paper-faint">{account.currency}</span>
      </p>
    </div>
  );
}
