import { useState } from "react";
import { predictScenario } from "../services/api";

interface ScenarioResult {
  scenario: string;
  risk_probability: number;
}

function ScenarioPanel() {
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  const scenarios = [
    "baseline",
    "heatwave",
    "high_wind",
    "decarbonised",
  ];

  const getRiskLevel = (prob: number) => {
    if (prob > 0.7) return { label: "HIGH", color: "#cf1322" };
    if (prob > 0.4) return { label: "MEDIUM", color: "#fa8c16" };
    return { label: "LOW", color: "#389e0d" };
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
    <div className="panel">
      <h3>Scenario Comparison</h3>

      <p
        style={{
          fontSize: "13px",
          color: "#6b7280",
          marginBottom: "16px",
        }}
      >
        Evaluate wildfire propagation risk under predefined
        environmental scenarios.
      </p>

      {/* Scenario Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => runScenario(scenario)}
            disabled={loadingScenario === scenario}
            style={{
              background: "#1e3a8a",
              opacity:
                loadingScenario === scenario ? 0.6 : 1,
            }}
          >
            {loadingScenario === scenario
              ? "Running..."
              : scenario.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Scenario Results */}
      {results.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          {results.map((result) => {
            const risk = getRiskLevel(
              result.risk_probability
            );

            return (
              <div
                key={result.scenario}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <strong>
                    {result.scenario
                      .replace("_", " ")
                      .toUpperCase()}
                  </strong>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    {(result.risk_probability * 100).toFixed(2)}%
                  </div>
                </div>

                <span
                  style={{
                    background: risk.color,
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
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