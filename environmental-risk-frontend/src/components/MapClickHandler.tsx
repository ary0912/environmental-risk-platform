import { useState } from "react";
import { useMapEvents, Marker } from "react-leaflet";

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
}

export default MapClickHandler;