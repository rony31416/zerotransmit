'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { geomapAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// SSR disabled — react-simple-maps + framer-motion use browser APIs
const BangladeshMap = dynamic(() => import('@/components/BangladeshMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
      <div className="text-center space-y-4">
        <div className="text-7xl animate-bounce">🗺️</div>
        <p className="text-gray-300 font-semibold text-lg">Loading Bangladesh Map…</p>
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  ),
});

interface CaseItem {
  district: string;
  risk_group: string;
  year: number;
}

export default function GeomapPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [casesData, forecastData] = await Promise.all([
          geomapAPI.getCases(),
          geomapAPI.getForecast(),
        ]);
        setCases(casesData.cases ?? []);
        setForecast(forecastData);
      } catch {
        // silently ignore — map still works with hardcoded division data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build risk-group bar chart data from API cases
  const groupStats = cases.reduce((acc: Record<string, number>, c) => {
    acc[c.risk_group] = (acc[c.risk_group] ?? 0) + 1;
    return acc;
  }, {});
  const groupChartData = Object.entries(groupStats).map(([name, value]) => ({ name, value }));

  const forecastChartData = forecast
    ? forecast.weeks.map((week: string, i: number) => ({
        week,
        cases: forecast.predicted_cases[i],
      }))
    : [];

  return (
    <div className="space-y-10 pb-16">

      {/* ── Hero header ── */}
      <div className="text-center space-y-3 pt-10">
        <div className="text-6xl">🗺️</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          Geographic Analytics
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          HIV risk score across Bangladesh divisions — scroll down to see the map
          assemble, then click any division for detailed statistics.
        </p>
      </div>

      {/* ── Animated Bangladesh Map ── */}
      <Card className="border-2 border-gray-800 shadow-2xl bg-gray-950">
        <CardHeader className="border-b border-gray-800 bg-gray-900/60">
          <CardTitle className="text-white flex items-center gap-3 text-xl">
            <span className="text-2xl">🏳️</span>
            Bangladesh Divisions — Interactive Heatmap
          </CardTitle>
          <p className="text-gray-400 text-sm mt-1">
            Divisions fly in as you scroll. Click any division to explore its HIV risk data.
          </p>
        </CardHeader>
        <CardContent className="p-6 bg-gray-950">
          <BangladeshMap />
        </CardContent>
      </Card>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* 4-week forecast */}
        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📈</span> 4-Week Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {forecastChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={forecastChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cases"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                {forecast?.high_risk_districts && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-xl">
                    <p className="text-xs font-bold text-yellow-800 flex items-center gap-1">
                      <span>⚠️</span> High-risk districts:
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {forecast.high_risk_districts.join(', ')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">
                {loading ? 'Loading forecast…' : 'No forecast data available'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk group distribution */}
        <Card className="border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b-2 border-purple-200">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <span className="text-2xl">👥</span> Risk Group Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {groupChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={groupChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">
                {loading ? 'Loading case data…' : 'No case data available'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Summary stats ── */}
      <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-xl">
        <CardHeader className="border-b-2 border-teal-200">
          <CardTitle className="text-2xl text-teal-900 flex items-center gap-3">
            <span className="text-3xl">📊</span> Dataset Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Cases',  value: cases.length || 500,                  color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
              { label: 'Divisions',    value: 8,                                    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
              { label: 'Districts',    value: 64,                                   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
              { label: 'Risk Groups',  value: Object.keys(groupStats).length || 7,  color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} className={`text-center p-6 ${bg} border-2 ${border} rounded-2xl shadow-md hover:scale-105 transition-all`}>
                <div className={`text-5xl font-bold ${color} mb-2`}>{value}</div>
                <div className={`text-sm font-semibold ${color.replace('600', '800')}`}>{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
