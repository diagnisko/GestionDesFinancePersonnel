import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-12 h-12 rounded-full bg-ink-850 border hairline flex items-center justify-center mb-4">
        <Icon size={20} strokeWidth={1.5} className="text-paper-faint" />
      </div>
      <h3 className="font-display text-base text-paper mb-1.5">{title}</h3>
      <p className="text-sm text-paper-dim max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
