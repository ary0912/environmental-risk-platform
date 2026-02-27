import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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
    if (prob > 0.7) return { label: "HIGH", color: "#ff4d4f" };
    if (prob > 0.4) return { label: "MEDIUM", color: "#faad14" };
    return { label: "LOW", color: "#52c41a" };
  };

  if (loading) {
    return <div className="output">Running model...</div>;
  }

  if (probability === null) {
    return (
      <div className="output">
        Click on the map and run the model to see risk analysis.
      </div>
    );
  }

  const risk = getRiskLevel(probability);

  const formattedDrivers = drivers.map((d) => ({
    feature: d.feature,
    contribution: Number(d.contribution.toFixed(4)),
  }));

  return (
    <div className="output">
      <h3>Risk Analysis Summary</h3>

      {/* 🔥 Probability + Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <p style={{ margin: 0 }}>
          Probability:{" "}
          <strong>
            {(probability * 100).toFixed(2)}%
          </strong>
        </p>

        <span
          style={{
            background: risk.color,
            color: "#ffffff",
            padding: "5px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {risk.label}
        </span>
      </div>

      {/* 🔥 Decision Insight */}
      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        {risk.label === "HIGH" &&
          "High wildfire propagation probability detected. Immediate mitigation and monitoring recommended."}

        {risk.label === "MEDIUM" &&
          "Moderate wildfire risk detected. Preventive control strategies advised."}

        {risk.label === "LOW" &&
          "Low wildfire propagation probability under current environmental conditions."}
      </p>
      <div style={{ 
  borderTop: "1px solid #e5e7eb",
  marginTop: "20px",
  paddingTop: "20px"
}}>

      {/* 🔥 SHAP Chart */}
      <h4 style={{ marginTop: "20px" }}>Feature Contributions</h4>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={formattedDrivers}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="contribution"
            fill="#ff4d4f"
          />
        </BarChart>
      </ResponsiveContainer>
    </div></div>
  );
}

export default RiskOutput;