import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

function Heat({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const heatLayer = L.heatLayer(points, { radius: 25 }).addTo(map);
    return () => { map.removeLayer(heatLayer); };
  }, [map, points]);
  return null;
}

export default function HeatmapMap({ points }) {
  const center = points.length ? [points[0][0], points[0][1]] : [20.5937, 78.9629]; // India center if empty
  return (
    <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Heat points={points} />
    </MapContainer>
  );
}
