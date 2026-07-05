import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ChartCompareRow } from './LineChartFinance';

interface Props {
  data: ChartCompareRow[];
}

export default function BarChartFinance({ data }: Props) {
  const chartData = data.length > 0 ? data : [{ month: '—', revenu: 0, depense: 0 }];
  const tickStyle = { fill: '#8a93a8', fontSize: 11, fontFamily: 'Inter' };

  return (
    <div className="panel p-5 min-h-[18rem] flex flex-col">
      <h2 className="font-display text-base text-paper mb-4 shrink-0">Revenus vs dépenses</h2>
      <div className="flex-1 min-h-[13rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#171c2a" vertical={false} />
            <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: '#232a3a' }} tickLine={false} />
            <YAxis tick={tickStyle} tickFormatter={(v) => `${Number(v) / 1000}k`} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ color: '#edeff3', backgroundColor: '#141926', border: '1px solid #232a3a', borderRadius: 10, fontSize: 12 }}
              formatter={(value) => (typeof value === 'number' ? value.toLocaleString('fr-FR') : String(value ?? ''))}
            />
            <Bar dataKey="revenu" name="Revenus" fill="#3ecf8e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="depense" name="Dépenses" fill="#ff6b57" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
