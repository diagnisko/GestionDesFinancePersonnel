export function formatCurrency(amount: number, currency = 'XOF'): string {
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
}

export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} F`;
}

export function parseAmount(value: string): number | null {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

export const PERIODS = [
  { value: 'week', label: '7 derniers jours' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: '3 derniers mois' },
  { value: 'year', label: 'Cette année' },
  { value: 'all', label: 'Tout' },
] as const;

export type Period = typeof PERIODS[number]['value'];

export function getPeriodBounds(period: Period): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let start: Date;

  switch (period) {
    case 'week':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      break;
    case 'quarter':
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      break;
    default:
      start = new Date(0);
  }

  return { start, end };
}

export function isInPeriod(date: Date, period: Period): boolean {
  const { start, end } = getPeriodBounds(period);
  return date >= start && date <= end;
}
