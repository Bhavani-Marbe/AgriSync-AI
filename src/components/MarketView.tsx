import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MarketPriceTrend } from '../types';

interface MarketViewProps {
  marketTrends: MarketPriceTrend[];
}

export const MarketView: React.FC<MarketViewProps> = ({ marketTrends }) => {
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const activeTrend = marketTrends[selectedCropIndex] || marketTrends[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Commodity Market Intelligence & Mandi Radar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time wholesale market trends, demand forecasts & optimal harvest selling windows.
          </p>
        </div>

        {/* Commodity Selector */}
        <div className="flex flex-wrap gap-1.5">
          {marketTrends.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCropIndex(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCropIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {m.crop}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Price Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">5-Day Price Movement</span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {activeTrend.crop} — ₹{activeTrend.currentPricePerQuintalINR || (activeTrend as any).currentPricePerQuintalUSD * 80 || 7850} <span className="text-xs font-normal text-slate-400">/ Quintal</span>
              </h3>
            </div>

            <div className="text-right">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                activeTrend.priceChange24hPercent >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {activeTrend.priceChange24hPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {activeTrend.priceChange24hPercent >= 0 ? '+' : ''}{activeTrend.priceChange24hPercent}%
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Demand: {activeTrend.demandStatus}</span>
            </div>
          </div>

          {/* Recharts Price Graph */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeTrend.historicalPrices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">AI Demand Forecast:</span>
              <p className="mt-0.5">{activeTrend.forecastNextMonth}</p>
            </div>
          </div>
        </div>

        {/* Nearby Mandis & Wholesale Hubs */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-emerald-400" /> Nearby Wholesale Hubs
            </h3>

            <div className="space-y-3 text-xs">
              {activeTrend.nearbyMarkets.map((mkt, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{mkt.marketName}</span>
                    <span className="text-emerald-400">₹{mkt.priceINR || (mkt as any).priceUSD * 80 || 7920}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {mkt.distanceKm} km away</span>
                    <span className="text-slate-500">Live Price</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Recommended Harvest Window</span>
            <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> {activeTrend.bestSellingTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
