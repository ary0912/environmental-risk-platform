import { useState } from "react";
import {
  predictRisk,
  explainRisk,
} from "../services/api";

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

    if (!selectedLocation) {
      alert("Please select a location on the map first.");
      return;
    }

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

      const probability =
        prediction.data.risk_probability;

      setProbability(probability);

      const explanation = await explainRisk({
        temperature,
        humidity,
        wind_speed: windSpeed,
        latitude: lat,
        longitude: lng,
      });

      setDrivers(
        explanation.data.feature_contributions || []
      );

      onNewPrediction();

    } catch (error) {
      console.error("Model execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h3>Environmental Input Parameters</h3>

      {selectedLocation && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px",
            background: "#f3f4f6",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          <strong>Selected Location:</strong>
          <div>Lat: {selectedLocation.lat.toFixed(4)}</div>
          <div>Lng: {selectedLocation.lng.toFixed(4)}</div>
        </div>
      )}

      <label>
        Temperature: <strong>{temperature}°C</strong>
      </label>
      <input
        type="range"
        min="0"
        max="50"
        value={temperature}
        onChange={(e) =>
          setTemperature(Number(e.target.value))
        }
      />

      <label>
        Humidity: <strong>{humidity}%</strong>
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={humidity}
        onChange={(e) =>
          setHumidity(Number(e.target.value))
        }
      />

      <label>
        Wind Speed: <strong>{windSpeed} km/h</strong>
      </label>
      <input
        type="range"
        min="0"
        max="50"
        value={windSpeed}
        onChange={(e) =>
          setWindSpeed(Number(e.target.value))
        }
      />

      <button onClick={runModel}>
        Run Risk Model
      </button>
    </div>
  );
}

export default ControlPanel;