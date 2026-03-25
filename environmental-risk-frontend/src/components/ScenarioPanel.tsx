import { useState } from "react";
import { predictScenario } from "../services/api";

interface ScenarioResult {
  scenario: string;
  risk_probability: number;
}

function ScenarioPanel() {
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  const scenarios = ["baseline", "heatwave", "high_wind", "decarbonised"];

  const getRiskLevel = (prob: number) => {
    if (prob > 0.7) return { label: "CRITICAL", color: "#ef4444" };
    if (prob > 0.4) return { label: "ELEVATED", color: "#f59e0b" };
    return { label: "STABLE", color: "#10b981" };
  };

  const runScenario = async (scenario: string) => {
    try {
      setLoadingScenario(scenario);
      const res = await predictScenario(scenario);
      setResults((prev) => [
        ...prev.filter((r) => r.scenario !== scenario),
        res.data,
      ]);
    } catch (err) {
      console.error("Scenario error:", err);
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Scenario Simulation</h3>
        <p className="text-muted">Test risk propagation under preset environmental conditions.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => runScenario(scenario)}
            disabled={loadingScenario === scenario}
            style={{
              flex: '1 1 calc(50% - 4px)',
              fontSize: '11px',
              padding: '8px',
              background: loadingScenario === scenario ? 'var(--bg-main)' : 'var(--bg-main)',
              border: `1px solid ${loadingScenario === scenario ? 'var(--primary)' : 'var(--border)'}`,
              color: loadingScenario === scenario ? 'var(--primary)' : 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
          >
            {loadingScenario === scenario ? "PROCESSING..." : scenario.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '8px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          {results.map((result) => {
            const risk = getRiskLevel(result.risk_probability);
            return (
              <div
                key={result.scenario}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: '8px 12px',
                  background: 'var(--bg-main)',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${risk.color}`
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {result.scenario.replace("_", " ").toUpperCase()}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    PROB: {(result.risk_probability * 100).toFixed(1)}%
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: risk.color }}>
                  {risk.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ScenarioPanel;