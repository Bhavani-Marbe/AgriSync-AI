import React from 'react';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  CloudSun,
  ShieldAlert,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherViewProps {
  weather: WeatherData;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ weather }) => {
  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Live Weather Radar
              </span>
              <span className="text-xs text-slate-400">• {weather.city}</span>
            </div>
            <div className="flex items-baseline gap-4 mt-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white">{weather.currentTemp}°C</h2>
              <span className="text-xl font-semibold text-blue-300">{weather.condition}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
              </span>
              <span className="font-bold text-white text-base mt-1 block">{weather.humidity}%</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-teal-400" /> Rain Prob
              </span>
              <span className="font-bold text-teal-400 text-base mt-1 block">{weather.rainProbabilityPercent}%</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Speed
              </span>
              <span className="font-bold text-white text-base mt-1 block">{weather.windSpeedKmH} km/h</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 block flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> UV Index
              </span>
              <span className="font-bold text-amber-400 text-base mt-1 block">{weather.uvIndex} (Moderate)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Farming Suggestions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" /> Automated Weather Farming Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weather.farmingSuggestions.map((sug, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>{sug}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Calendar className="w-5 h-5 text-blue-400" /> 7-Day Weather Forecast
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast7Days.map((f, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">{f.day}</span>
              <div className="my-1">
                {f.rainProb > 40 ? (
                  <CloudRain className="w-6 h-6 text-teal-400 mx-auto" />
                ) : (
                  <Sun className="w-6 h-6 text-amber-400 mx-auto" />
                )}
              </div>
              <div className="font-bold text-white">{f.tempHigh}° / {f.tempLow}°</div>
              <p className="text-[10px] text-slate-400">{f.condition}</p>
              <div className="text-[10px] text-teal-400 font-semibold">{f.rainProb}% Rain</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
