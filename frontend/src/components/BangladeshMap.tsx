'use client';

import { useRef, useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const GEO_URL = '/bd-divisions.geojson';

// Division risk data — keys match GADM NAME_1 field (old English spellings)
const DIVISION_DATA: Record<string, {
  risk_score: number;
  total_cases: number;
  new_cases: number;
  high_risk_group: string;
}> = {
  Dhaka:       { risk_score: 92, total_cases: 412, new_cases: 45, high_risk_group: 'MSM' },
  Chittagong:  { risk_score: 74, total_cases: 289, new_cases: 29, high_risk_group: 'Migrant' },
  Sylhet:      { risk_score: 61, total_cases: 178, new_cases: 18, high_risk_group: 'Migrant' },
  Rajshahi:    { risk_score: 48, total_cases: 134, new_cases: 12, high_risk_group: 'PWID' },
  Khulna:      { risk_score: 55, total_cases: 156, new_cases: 14, high_risk_group: 'FSW' },
  Barisal:     { risk_score: 38, total_cases: 98,  new_cases: 8,  high_risk_group: 'General' },
  Mymensingh:  { risk_score: 44, total_cases: 112, new_cases: 10, high_risk_group: 'PWID' },
  Rangpur:     { risk_score: 35, total_cases: 87,  new_cases: 7,  high_risk_group: 'General' },
};

// Directions each division flies in from (CSS px offset from final position)
const DIVISION_DIRECTIONS: Record<string, { x: number; y: number }> = {
  Rangpur:    { x: -280, y: -280 },
  Mymensingh: { x:  120, y: -320 },
  Sylhet:     { x:  360, y: -200 },
  Rajshahi:   { x: -360, y:  -60 },
  Dhaka:      { x:   60, y: -280 },
  Khulna:     { x: -360, y:  200 },
  Barisal:    { x:   60, y:  360 },
  Chittagong: { x:  360, y:  120 },
};

// Division labels with approximate centroids in lng/lat for display outside SVG
const DIVISION_LABELS: Record<string, { emoji: string }> = {
  Rangpur:    { emoji: '🟢' },
  Mymensingh: { emoji: '🟣' },
  Sylhet:     { emoji: '🟡' },
  Rajshahi:   { emoji: '🟠' },
  Dhaka:      { emoji: '🔴' },
  Khulna:     { emoji: '🔵' },
  Barisal:    { emoji: '🟤' },
  Chittagong: { emoji: '⚫' },
};

function getRiskColor(score: number): string {
  if (score >= 85) return '#ef4444';
  if (score >= 65) return '#f97316';
  if (score >= 45) return '#eab308';
  return '#22c55e';
}

function getRiskLabel(score: number): string {
  if (score >= 85) return 'Very High';
  if (score >= 65) return 'High';
  if (score >= 45) return 'Medium';
  return 'Low';
}

export default function BangladeshMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const [hoveredDiv, setHoveredDiv] = useState<string | null>(null);
  // Cursor position relative to the map container
  const [popupPos, setPopupPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const divData = selectedDiv ? DIVISION_DATA[selectedDiv] : null;

  const handleDivClick = useCallback(
    (divName: string, e: React.MouseEvent) => {
      if (!mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Clamp so the popup (≈260px wide, ≈220px tall) stays inside the container
      const x = Math.min(Math.max(rawX, 140), rect.width  - 140);
      const y = Math.min(Math.max(rawY, 120), rect.height - 30);

      setPopupPos({ x, y });
      setSelectedDiv(divName === selectedDiv ? null : divName);
    },
    [selectedDiv],
  );

  return (
    <div ref={ref} className="relative w-full flex flex-col gap-4">

      {/* ── Scroll hint ── */}
      {!isInView && (
        <div className="text-center text-gray-400 text-sm animate-bounce py-2">
          ↓ Scroll to see Bangladesh divisions assemble
        </div>
      )}

      {/* ── Map container ── */}
      <div
        ref={mapContainerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0a0f1e' }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 3400, center: [90.35, 23.5] }}
          style={{ width: '100%', height: 'auto', background: 'transparent' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              // Group upazila features by their parent division (NAME_1)
              const groups: Record<string, typeof geographies> = {};
              geographies.forEach(geo => {
                const div: string = geo.properties.NAME_1 ?? 'Unknown';
                if (!groups[div]) groups[div] = [];
                groups[div].push(geo);
              });

              return Object.entries(groups).map(([divName, geos], idx) => {
                const dir = DIVISION_DIRECTIONS[divName] ?? { x: 0, y: -300 };
                const data = DIVISION_DATA[divName];
                const fillColor =
                  selectedDiv === divName ? '#ffffff55'
                  : hoveredDiv === divName ? '#ffffff33'
                  : data ? getRiskColor(data.risk_score)
                  : '#4ade80';

                return (
                  <motion.g
                    key={divName}
                    initial={{ x: dir.x, y: dir.y, opacity: 0 }}
                    animate={
                      isInView
                        ? { x: 0, y: 0, opacity: 1 }
                        : { x: dir.x, y: dir.y, opacity: 0 }
                    }
                    transition={{
                      duration: 1.5,
                      delay: idx * 0.12,
                      ease: [0.16, 1, 0.3, 1], // spring-like easeOut
                    }}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleDivClick(divName, e as unknown as React.MouseEvent)}
                    onMouseEnter={() => setHoveredDiv(divName)}
                    onMouseLeave={() => setHoveredDiv(null)}
                  >
                    {geos.map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#0a0f1e"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.25s ease' },
                          hover:   { outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))}
                  </motion.g>
                );
              });
            }}
          </Geographies>
        </ComposableMap>

        {/* ── Hover label ── */}
        <AnimatePresence>
          {hoveredDiv && (
            <motion.div
              key={hoveredDiv}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold pointer-events-none shadow-xl border border-white/10"
            >
              {DIVISION_LABELS[hoveredDiv]?.emoji ?? '📍'} <strong>{hoveredDiv}</strong> Division
              {DIVISION_DATA[hoveredDiv] && (
                <span className="ml-2 opacity-70">
                  — Risk: <strong style={{ color: getRiskColor(DIVISION_DATA[hoveredDiv].risk_score) }}>
                    {getRiskLabel(DIVISION_DATA[hoveredDiv].risk_score)}
                  </strong>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Legend ── */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-3 space-y-1.5 border border-white/10">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">HIV Risk</p>
          {[
            { color: '#ef4444', label: 'Very High  85+' },
            { color: '#f97316', label: 'High       65–84' },
            { color: '#eab308', label: 'Medium     45–64' },
            { color: '#22c55e', label: 'Low        < 45' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-gray-300 text-xs font-mono">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Division quick badges (bottom-right) ── */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
          {Object.entries(DIVISION_DATA).map(([name, data]) => (
            <button
              key={name}
              onClick={(e) => handleDivClick(name, e)}
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                selectedDiv === name
                  ? 'bg-white text-gray-900 border-white'
                  : 'bg-black/60 text-gray-300 border-white/20 hover:border-white/50'
              }`}
              style={{ borderLeftColor: getRiskColor(data.risk_score), borderLeftWidth: 3 }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* ── Cursor-anchored floating popup ── */}
        <AnimatePresence>
          {selectedDiv && divData && (
            <motion.div
              key={selectedDiv}
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{    opacity: 0, scale: 0.88, y: 8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: popupPos.x,
                top:  popupPos.y,
                transform: 'translate(-50%, -108%)',
                width: 264,
              }}
            >
              <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Coloured top stripe */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: getRiskColor(divData.risk_score) }}
                />

                <div className="p-4 space-y-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{DIVISION_LABELS[selectedDiv]?.emoji ?? '📍'}</span>
                      <div>
                        <p className="text-white font-bold text-sm leading-none">{selectedDiv}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Division · Bangladesh</p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: getRiskColor(divData.risk_score) + '33',
                        color: getRiskColor(divData.risk_score),
                      }}
                    >
                      {getRiskLabel(divData.risk_score)}
                    </span>
                  </div>

                  {/* Risk bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Risk Score</span>
                      <span className="font-mono font-bold" style={{ color: getRiskColor(divData.risk_score) }}>
                        {divData.risk_score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${divData.risk_score}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: getRiskColor(divData.risk_score) }}
                      />
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Total Cases',  value: divData.total_cases,      color: '#60a5fa' },
                      { label: 'New (4wk)',     value: divData.new_cases,        color: '#fb923c' },
                      { label: 'Primary Group', value: divData.high_risk_group,  color: '#a78bfa' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-gray-800/80 rounded-xl p-2 text-center">
                        <p className="text-xs text-gray-400 leading-tight mb-1">{label}</p>
                        <p className="text-xs font-bold" style={{ color }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caret / arrow pointing down */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45 bg-gray-900/95 border-r border-b border-white/10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes mapPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}
