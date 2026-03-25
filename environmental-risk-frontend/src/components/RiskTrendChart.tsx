import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RiskPoint {
  created_at: string;
  risk_probability: number;
}

interface Props {
  points: RiskPoint[];
}

function RiskTrendChart({ points }: Props) {
  if (!points.length) return (
    <div className="panel" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p className="text-muted">Insufficient telemetry for trend analysis.</p>
    </div>
  );

  const formattedData = [...points].reverse().map((p) => ({
    time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    risk: Number((p.risk_probability * 100).toFixed(1)),
  }));

  return (
    <div className="panel">
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Temporal Risk Vector</h3>
        <p className="text-muted">Historical simulation trends from the current session.</p>
      </div>

      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
            />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRisk)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskTrendChart;