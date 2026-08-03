import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { Farm } from '../types';

interface AnalyticsViewProps {
  farms?: Farm[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ farms = [] }) => {
  const yieldData = [
    { year: '2022', 'Jowar (Sorghum)': 320, Cotton: 280, 'Tur (Pigeon Pea)': 410 },
    { year: '2023', 'Jowar (Sorghum)': 380, Cotton: 310, 'Tur (Pigeon Pea)': 460 },
    { year: '2024', 'Jowar (Sorghum)': 410, Cotton: 350, 'Tur (Pigeon Pea)': 490 },
    { year: '2025', 'Jowar (Sorghum)': 450, Cotton: 380, 'Tur (Pigeon Pea)': 520 },
  ];

  // Dynamically calculate land acreage allocation percentages
  const totalAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0) || 100;
  
  const cropAcresMap: Record<string, number> = {};
  farms.forEach((f) => {
    const crop = f.currentCrop || 'Other';
    cropAcresMap[crop] = (cropAcresMap[crop] || 0) + f.areaAcres;
  });

  const colors = ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#8b5cf6'];
  const cropDistribution = Object.keys(cropAcresMap).length > 0
    ? Object.entries(cropAcresMap).map(([name, acres], idx) => ({
        name,
        value: Math.round((acres / totalAcres) * 100),
        acres,
        color: colors[idx % colors.length],
      }))
    : [
        { name: 'Tur (Pigeon Pea)', value: 45, acres: 225, color: '#10b981' },
        { name: 'Cotton', value: 30, acres: 150, color: '#14b8a6' },
        { name: 'Jowar (Sorghum)', value: 15, acres: 75, color: '#06b6d4' },
        { name: 'Sugarcane', value: 10, acres: 50, color: '#f59e0b' },
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" /> Platform & Farm Analytics Dashboard
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Multi-season harvest yield metrics, crop allocation percentages, and ML prediction accuracy benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yield History Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Multi-Year Crop Yield Comparison (Quintals)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="Tur (Pigeon Pea)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cotton" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Jowar (Sorghum)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <PieIcon className="w-4 h-4 text-emerald-400" /> Land Acreage Allocation %
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cropDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {cropDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
