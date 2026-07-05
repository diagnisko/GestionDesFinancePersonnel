import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface PieSlice {
  name: string;
  value: number;
}

interface Props {
  data: PieSlice[];
}

const COLORS = ['#c89b4a', '#6c8cff', '#3ecf8e', '#ff6b57', '#a78bfa', '#38bdf8', '#f4a340', '#e879b9'];

const formatAmount = (value: number) => `${value.toLocaleString('fr-FR')} F`;

export default function PieChartFinance({ data }: Props) {
  const empty = data.length === 0;
  const chartData = empty ? [{ name: 'Aucune dépense', value: 1 }] : data;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="panel p-5 min-h-[18rem] flex flex-col">
      <h2 className="font-display text-base text-paper mb-0.5 shrink-0">Répartition des dépenses</h2>
      <p className="text-xs text-paper-faint mb-3 shrink-0">
        {empty ? 'Aucune donnée pour le moment.' : `Total : ${formatAmount(total)}`}
      </p>
      <div className="flex-1 min-h-[12rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={2}
              label={empty ? false : ({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
              labelLine={false}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={empty ? '#232a3a' : COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: '#171c2a' }}
              contentStyle={{ color: '#edeff3', backgroundColor: '#141926', border: '1px solid #232a3a', borderRadius: 10, fontSize: 12 }}
              formatter={(value, name) => [typeof value === 'number' ? formatAmount(value) : String(value ?? ''), String(name ?? '')]}
              labelFormatter={(_, payload) => (payload && payload.length > 0 ? String(payload[0].name ?? '') : '')}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
