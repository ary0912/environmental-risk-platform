import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Driver {
  feature: string;
  contribution: number;
}

interface Props {
  probability: number | null;
  drivers: Driver[];
  loading: boolean;
}

function RiskOutput({ probability, drivers, loading }: Props) {
  const getRiskLevel = (prob: number) => {
    if (prob > 0.7) return { label: "CRITICAL", color: "#ef4444", bg: "#450a0a" };
    if (prob > 0.4) return { label: "ELEVATED", color: "#f59e0b", bg: "#451a03" };
    return { label: "STABLE", color: "#10b981", bg: "#064e3b" };
  };

  if (loading) {
    return (
      <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="spinner" style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span className="text-muted">Analyzing Environmental Vectors...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (probability === null) {
    return (
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', borderStyle: 'dashed' }}>
        <p className="text-muted">Awaiting geospatial targeting...</p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Select a coordinate on the global map to begin.</p>
      </div>
    );
  }

  const risk = getRiskLevel(probability);
  const formattedDrivers = drivers.map((d) => ({
    feature: d.feature.toUpperCase(),
    contribution: Number(d.contribution.toFixed(4)),
  }));

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Analysis Results</h3>
          <p className="text-muted">Probabilistic risk assessment based on current vectors.</p>
        </div>
        <div style={{
          padding: '4px 12px',
          borderRadius: '20px',
          background: risk.bg,
          border: `1px solid ${risk.color}44`,
          color: risk.color,
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.05em'
        }}>
          {risk.label}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <span className="label">Risk Probability</span>
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {(probability * 100).toFixed(1)}<span style={{ fontSize: '24px', color: 'var(--text-muted)', fontWeight: 400 }}>%</span>
          </div>
        </div>
        <div style={{ flex: 2, padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
            {risk.label === "CRITICAL" && "High wildfire propagation potential. Vectors indicate extreme atmospheric vulnerability. Immediate intervention recommended."}
            {risk.label === "ELEVATED" && "Moderate risk detected. Trends suggest increasing volatility. Monitor atmospheric moisture levels closely."}
            {risk.label === "STABLE" && "Environmental conditions within 95% confidence interval for stability. No immediate risk detected."}
          </p>
        </div>
      </div>

      <div>
        <span className="label" style={{ marginBottom: '16px' }}>Feature Contributions (SHAP)</span>
        <div style={{ height: '200px', width: '100%', marginTop: '12px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedDrivers} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={100} />
              <Tooltip
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
              />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]} barSize={12}>
                {formattedDrivers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? 'var(--primary)' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RiskOutput;