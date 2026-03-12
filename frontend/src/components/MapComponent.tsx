'use client';

import { useEffect, useState } from 'react';
import { MapContainer, Popup, CircleMarker, Tooltip, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Case {
  lat: number;
  lng: number;
  district: string;
  age_group: string;
  risk_group: string;
  year: number;
}

interface Hotspot {
  district: string;
  risk_score: number;
  predicted_new_cases: number;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  cases: Case[];
  hotspots: Hotspot[];
}

const BANGLADESH_BOUNDS: [[number, number], [number, number]] = [
  [20.3756, 88.0075],
  [26.6382, 92.6804],
];

const BANGLADESH_CENTER: [number, number] = [23.685, 90.3563];

export default function MapComponent({ cases, hotspots }: MapComponentProps) {
  const [bangladeshBoundary, setBangladeshBoundary] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBoundary = async () => {
      try {
        const response = await fetch('/bangladesh.geo.json');
        const data = await response.json();

        if (isMounted) {
          setBangladeshBoundary(data);
        }
      } catch (error) {
        console.error('Failed to load Bangladesh boundary:', error);
      }
    };

    loadBoundary();

    return () => {
      isMounted = false;
    };
  }, []);

  const getHotspotColor = (riskScore: number) => {
    if (riskScore >= 85) return '#dc2626'; // red-600
    if (riskScore >= 70) return '#ea580c'; // orange-600
    if (riskScore >= 55) return '#ca8a04'; // yellow-600
    return '#16a34a'; // green-600
  };

  return (
    <div className="h-[500px] rounded-2xl overflow-hidden border border-emerald-200 bg-slate-50">
      <MapContainer
        center={BANGLADESH_CENTER}
        zoom={7}
        minZoom={6}
        maxZoom={10}
        maxBounds={BANGLADESH_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', background: '#f8fafc' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {bangladeshBoundary && (
          <GeoJSON
            data={bangladeshBoundary}
            style={() => ({
              fillColor: '#c7f9cc',
              fillOpacity: 0.9,
              color: '#16a34a',
              weight: 2,
            })}
          />
        )}

        {/* Hotspot circles */}
        {hotspots.map((hotspot, idx) => (
          <CircleMarker
            key={`hotspot-${idx}`}
            center={[hotspot.lat, hotspot.lng]}
            radius={hotspot.risk_score / 5}
            pathOptions={{
              fillColor: getHotspotColor(hotspot.risk_score),
              fillOpacity: 0.7,
              color: getHotspotColor(hotspot.risk_score),
              weight: 2,
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-bold">{hotspot.district}</span>
            </Tooltip>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{hotspot.district}</h3>
                <p className="text-sm">Risk Score: <strong>{hotspot.risk_score}</strong></p>
                <p className="text-sm">Predicted Cases: <strong>{hotspot.predicted_new_cases}</strong></p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Case markers (sample only first 100 for performance) */}
        {cases.slice(0, 100).map((case_, idx) => (
          <CircleMarker
            key={`case-${idx}`}
            center={[case_.lat, case_.lng]}
            radius={3}
            pathOptions={{
              fillColor: '#3b82f6',
              fillOpacity: 0.6,
              color: '#1e40af',
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p><strong>District:</strong> {case_.district}</p>
                <p><strong>Age Group:</strong> {case_.age_group}</p>
                <p><strong>Risk Group:</strong> {case_.risk_group}</p>
                <p><strong>Year:</strong> {case_.year}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
