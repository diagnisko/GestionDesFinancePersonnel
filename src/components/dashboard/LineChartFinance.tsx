import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface ChartCompareRow {
  month: string;
  revenu: number;
  depense: number;
}

interface Props {
  data: ChartCompareRow[];
}

export default function LineChartFinance({ data }: Props) {
  const chartData = data.length > 0 ? data : [{ month: '—', revenu: 0, depense: 0 }];
  const tickStyle = { fill: '#8a93a8', fontSize: 11, fontFamily: 'Inter' };

  return (
    <div className="panel p-5 min-h-[18rem] flex flex-col">
      <h2 className="font-display text-base text-paper mb-4 shrink-0">Évolution mensuelle</h2>
      <div className="flex-1 min-h-[13rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gainFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ecf8e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3ecf8e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b57" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ff6b57" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#171c2a" vertical={false} />
            <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: '#232a3a' }} tickLine={false} />
            <YAxis tick={tickStyle} tickFormatter={(v) => `${Number(v) / 1000}k`} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ color: '#edeff3', backgroundColor: '#141926', border: '1px solid #232a3a', borderRadius: 10, fontSize: 12 }}
              formatter={(value) => (typeof value === 'number' ? value.toLocaleString('fr-FR') : String(value ?? ''))}
            />
            <Area type="monotone" dataKey="revenu" name="Revenus" stroke="#3ecf8e" strokeWidth={2} fill="url(#gainFill)" />
            <Area type="monotone" dataKey="depense" name="Dépenses" stroke="#ff6b57" strokeWidth={2} fill="url(#lossFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
