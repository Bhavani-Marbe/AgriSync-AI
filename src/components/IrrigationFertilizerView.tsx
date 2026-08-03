import React, { useState } from 'react';
import {
  Droplets,
  FlaskConical,
  Calendar,
  Sun,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Loader2,
} from 'lucide-react';
import { Farm, SmartIrrigationRecommendation, FertilizerRecommendation } from '../types';

interface IrrigationFertilizerViewProps {
  farm: Farm;
}

export const IrrigationFertilizerView: React.FC<IrrigationFertilizerViewProps> = ({ farm }) => {
  const [activeSubTab, setActiveSubTab] = useState<'irrigation' | 'fertilizer'>('irrigation');
  const [loading, setLoading] = useState(false);

  const [irrigation, setIrrigation] = useState<SmartIrrigationRecommendation>({
    waterQuantityLitersPerAcre: 1850,
    recommendedTimeOfDay: '05:30 AM - 07:30 AM (Minimum Evaporation Loss)',
    irrigationFrequencyDays: 2,
    nextScheduledDate: '2026-08-03',
    weatherAdjustments: 'Reduced overall water application volume by 15% in anticipation of light rainfall on Monday.',
    moistureDeficitPercentage: 28,
    actionRequired: true,
  });

  const [fertilizer, setFertilizer] = useState<FertilizerRecommendation>({
    targetCrop: farm.currentCrop || 'Tur (Pigeon Pea)',
    deficienciesDetected: ['Nitrogen (N) Deficit (-25 kg/ha below optimal baseline)'],
    recommendedFertilizers: [
      { name: 'Urea (46% N)', quantityKgPerAcre: '45 kg', timing: 'At Vegetative Growth Stage (Day 25)', method: 'Soil Broadcast prior to Drip Run' },
      { name: 'Di-Ammonium Phosphate (DAP 18-46-0)', quantityKgPerAcre: '30 kg', timing: 'At Basal Dressing', method: 'Band placement 5cm below seed' },
      { name: 'Muriate of Potash (MOP 60% K2O)', quantityKgPerAcre: '25 kg', timing: 'At Flowering Stage', method: 'Fertigation via drip system' },
    ],
    applicationSchedule: [
      { day: 'Day 1', task: 'Basal Soil Dressing', details: 'Incorporate DAP into topsoil prior to planting' },
      { day: 'Day 25', task: 'First Nitrogen Fertigation', details: 'Inject dissolved Urea into drip fertigation tank' },
      { day: 'Day 45', task: 'Potassium Boost', details: 'Apply MOP during flowering to improve pod filling & yield' },
    ],
    scientificReasoning: 'Soil nutrient test indicates nitrogen level is 140 ppm, which is 20% below optimal vegetative growth requirements for pulse crops. Splitting fertilizer into 3 fertigation events maximizes absorption efficiency and prevents leaching.',
  });

  return (
    <div className="space-y-6">
      {/* Header with Subtab Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-teal-400" /> Smart Irrigation & Fertilizer Advisory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Weather-adjusted water management & soil-specific NPK fertigation schedule
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('irrigation')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'irrigation'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-4 h-4" /> Smart Irrigation
          </button>
          <button
            onClick={() => setActiveSubTab('fertilizer')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'fertilizer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" /> Fertilizer Schedule
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SMART IRRIGATION */}
      {activeSubTab === 'irrigation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Droplets className="w-4 h-4 text-teal-400" /> Farm Hydration Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Active Farm</span>
                <span className="font-bold text-white text-sm">{farm.name}</span>
                <p className="text-slate-400">{farm.areaAcres} Acres • {farm.waterSource}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Moisture Deficit</span>
                <div className="text-xl font-bold text-teal-400">{irrigation.moistureDeficitPercentage}%</div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-teal-400 h-full rounded-full" style={{ width: `${irrigation.moistureDeficitPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Recommended Water Dosage</span>
                  <div className="text-3xl font-black text-white mt-1">
                    {irrigation.waterQuantityLitersPerAcre} <span className="text-xs font-normal text-slate-400">Liters / Acre</span>
                  </div>
                  <p className="text-xs text-teal-400 mt-1">
                    Total Volume for {farm.areaAcres} Acres: <span className="font-bold">{(irrigation.waterQuantityLitersPerAcre * farm.areaAcres).toLocaleString()} Liters</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Schedule Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Optimal Water Window
                  </span>
                  <span className="font-bold text-white text-xs block mt-1">{irrigation.recommendedTimeOfDay}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Irrigation Frequency
                  </span>
                  <span className="font-bold text-white text-xs block mt-1">Every {irrigation.irrigationFrequencyDays} Days (Next: {irrigation.nextScheduledDate})</span>
                </div>
              </div>

              <div className="p-3.5 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs text-teal-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Weather Adjusted Calculation:</span>
                  <p className="mt-0.5">{irrigation.weatherAdjustments}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FERTILIZER SCHEDULE */}
      {activeSubTab === 'fertilizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FlaskConical className="w-4 h-4 text-emerald-400" /> Nutrient Deficiencies
            </h3>

            <div className="space-y-2 text-xs">
              {fertilizer.deficienciesDetected.map((def, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 font-semibold">
                  {def}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                Prescribed NPK Fertilizers & Application Dosage
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {fertilizer.recommendedFertilizers.map((fert, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-300 text-sm block">{fert.name}</span>
                    <p className="text-white font-bold">{fert.quantityKgPerAcre} / Acre</p>
                    <p className="text-slate-400">{fert.timing}</p>
                    <p className="text-slate-500 text-[11px]">{fert.method}</p>
                  </div>
                ))}
              </div>

              {/* Fertigation Calendar */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Application Schedule
                </h4>
                <div className="space-y-2">
                  {fertilizer.applicationSchedule.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.day}: {item.task}</span>
                        <p className="text-slate-400 mt-0.5">{item.details}</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">
                        Scheduled
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
