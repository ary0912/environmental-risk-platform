import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import HeaderBar from "./components/HeaderBar";
import ControlPanel from "./components/ControlPanel";
import HeatmapLayer from "./components/HeatmapLayer";
import RiskOutput from "./components/RiskOutput";
import ScenarioPanel from "./components/ScenarioPanel";
import MapClickHandler from "./components/MapClickHandler";
import RiskTrendChart from "./components/RiskTrendChart";
import { getHeatmap } from "./services/api";
import "leaflet/dist/leaflet.css";
import "./index.css";

interface RiskPoint {
  latitude: number;
  longitude: number;
  risk_probability: number;
  created_at: string;
}

interface Driver {
  feature: string;
  contribution: number;
}

function App() {
  const [points, setPoints] = useState<RiskPoint[]>([]);
  const [probability, setProbability] = useState<number | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const loadHeatmap = async () => {
      const res = await getHeatmap();
      setPoints(res.data.results);
    };
    loadHeatmap();
  }, []);

  const refreshHeatmap = async () => {
    const res = await getHeatmap();
    setPoints(res.data.results);
  };

  return (
    <div>
      <HeaderBar />

      <div className="layout">

        {/* LEFT SIDEBAR */}
        <div className="left-column">
          <ControlPanel
            onNewPrediction={refreshHeatmap}
            setProbability={setProbability}
            setDrivers={setDrivers}
            setLoading={setLoading}
            selectedLocation={selectedLocation}
          />

          <ScenarioPanel />
        </div>

        {/* MAIN DASHBOARD */}
        <div className="right-column">

          <div className="map-container">
            <MapContainer
              center={[51.4545, -2.5879]}
              zoom={10}
              style={{ height: "450px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <HeatmapLayer points={points} />

              <MapClickHandler
                onLocationSelect={(lat, lng) =>
                  setSelectedLocation({ lat, lng })
                }
              />
            </MapContainer>
          </div>

          <RiskOutput
            probability={probability}
            drivers={drivers}
            loading={loading}
          />

          <RiskTrendChart points={points} />
        </div>
      </div>
    </div>
  );
}

export default App;