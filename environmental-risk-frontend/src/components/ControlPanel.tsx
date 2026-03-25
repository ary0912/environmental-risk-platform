import { useState } from "react";
import { predictRisk, explainRisk } from "../services/api";

interface Driver {
  feature: string;
  contribution: number;
}

interface Props {
  onNewPrediction: () => void;
  setProbability: (p: number | null) => void;
  setDrivers: (d: Driver[]) => void;
  setLoading: (l: boolean) => void;
  selectedLocation: { lat: number; lng: number } | null;
}

function ControlPanel({
  onNewPrediction,
  setProbability,
  setDrivers,
  setLoading,
  selectedLocation,
}: Props) {
  const [temperature, setTemperature] = useState<number>(30);
  const [humidity, setHumidity] = useState<number>(40);
  const [windSpeed, setWindSpeed] = useState<number>(15);

  const runModel = async () => {
    if (!selectedLocation) return;

    try {
      setLoading(true);
      setProbability(null);
      setDrivers([]);

      const { lat, lng } = selectedLocation;
      const prediction = await predictRisk({
        temperature,
        humidity,
        wind_speed: windSpeed,
        latitude: lat,
        longitude: lng,
      });

      setProbability(prediction.data.risk_probability);

      const explanation = await explainRisk({
        temperature,
        humidity,
        wind_speed: windSpeed,
        latitude: lat,
        longitude: lng,
      });

      setDrivers(explanation.data.feature_contributions || []);
      onNewPrediction();
    } catch (error) {
      console.error("Model execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Model Inputs</h3>
        <p className="text-muted">Adjust environmental variables for simulation.</p>
      </div>

      <div style={{
        padding: '12px',
        background: 'var(--bg-main)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        opacity: selectedLocation ? 1 : 0.5,
        transition: 'opacity 0.2s ease'
      }}>
        <span className="label">Geospatial Target</span>
        {selectedLocation ? (
          <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#ef4444' }}>Select location on map...</div>
        )}
      </div>

      <div className="input-group">
        <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Temperature</span>
          <span style={{ color: 'var(--text-main)' }}>{temperature}°C</span>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Relative Humidity</span>
          <span style={{ color: 'var(--text-main)' }}>{humidity}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={humidity}
          onChange={(e) => setHumidity(Number(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Surface Wind</span>
          <span style={{ color: 'var(--text-main)' }}>{windSpeed} km/h</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={windSpeed}
          onChange={(e) => setWindSpeed(Number(e.target.value))}
        />
      </div>

      <button
        onClick={runModel}
        disabled={!selectedLocation}
        style={{ width: '100%', marginTop: '8px' }}
      >
        EXECUTE SIMULATION
      </button>
    </div>
  );
}

export default ControlPanel;