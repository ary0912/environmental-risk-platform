import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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
  if (!points.length) return null;

  const formattedData = points.map((p) => ({
    time: new Date(p.created_at).toLocaleTimeString(),
    risk: Number((p.risk_probability * 100).toFixed(2)),
  }));

  return (
    <div className="panel">
      <h3>Risk Trend Over Time</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#1e3a8a"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskTrendChart;