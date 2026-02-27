import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface RiskPoint {
  latitude: number;
  longitude: number;
  risk_probability: number;
}

interface Props {
  points: RiskPoint[];
}

type HeatLatLngTuple = [number, number, number];

interface HeatLayerOptions extends L.LayerOptions {
  radius?: number;
  blur?: number;
  maxZoom?: number;
  minOpacity?: number;
  gradient?: { [key: number]: string };
}

declare module "leaflet" {
  function heatLayer(
    latlngs: HeatLatLngTuple[],
    options?: HeatLayerOptions
  ): L.Layer;
}

function HeatmapLayer({ points }: Props) {
  const map = useMap();
  const heatLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!points.length) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    const maxRisk = Math.max(
      ...points.map((p) => p.risk_probability)
    );

    const heatPoints: HeatLatLngTuple[] = points.map((p) => {
      const intensity =
        maxRisk > 0 ? p.risk_probability / maxRisk : 0;

      return [p.latitude, p.longitude, intensity];
    });

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 55,
      blur: 35,
      maxZoom: 17,
      minOpacity: 0.4,
      gradient: {
        0.2: "#2f54eb",
        0.4: "#13c2c2",
        0.6: "#fadb14",
        0.8: "#fa8c16",
        1.0: "#cf1322",
      },
    }).addTo(map);

    heatLayerRef.current = heatLayer;

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [points, map]);

  return null;
}

export default HeatmapLayer;