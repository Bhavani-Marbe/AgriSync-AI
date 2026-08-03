import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Award,
  Layers,
  Info,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { Farm, CropRecommendationRequest, CropRecommendationResult } from '../types';

interface CropRecommendationViewProps {
  farm: Farm;
}

export const CropRecommendationView: React.FC<CropRecommendationViewProps> = ({ farm }) => {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<CropRecommendationRequest>({
    temperature: 28.5,
    humidity: 62,
    rainfall: 480,
    nitrogen: farm.soilHealth.nitrogen,
    phosphorus: farm.soilHealth.phosphorus,
    potassium: farm.soilHealth.potassium,
    ph: farm.soilHealth.ph,
    location: farm.location,
    season: 'Kharif',
  });

  const [result, setResult] = useState<CropRecommendationResult | null>({
    recommendedCrop: 'Tur (Pigeon Pea)',
    confidenceScore: 94.5,
    alternativeCrops: [
      { crop: 'Jowar (Sorghum)', confidence: 88.2, yieldEstimate: '4.2 Quintals/Acre' },
      { crop: 'Groundnut', confidence: 84.5, yieldEstimate: '3.1 Quintals/Acre' },
      { crop: 'Cotton', confidence: 79.0, yieldEstimate: '3.5 Quintals/Acre' },
    ],
    riskLevel: 'LOW',
    expectedYieldTonsPerAcre: 4.8,
    profitEstimationINRPerAcre: 148000,
    explainableAI: {
      primaryReason: 'Optimal NPK soil balance and pH level matching thermal heat units in Kalaburagi district.',
      advantages: [
        'High nitrogen utilization efficiency in Black Cotton soil',
        'Favorable APMC Kalaburagi market price trend (+3.2% growth)',
        'Low risk of root rot under borewell drip irrigation schedule',
      ],
      possibleRisks: [
        'Mid-monsoon humidity spikes require monitoring for Tur Pod Borer',
        'Monitor for wilt symptoms if heavy rainfall occurs in Afzalpur block',
      ],
      featureImportances: [
        { feature: 'Soil Nitrogen (N)', importance: 0.35, description: 'Vegetative leaf strength' },
        { feature: 'Monsoon / Irrigation', importance: 0.25, description: 'Root hydration retention' },
        { feature: 'Soil pH', importance: 0.20, description: 'Micronutrient absorption gate' },
        { feature: 'Temperature', importance: 0.12, description: 'Flower setting retention' },
        { feature: 'Potassium (K)', importance: 0.08, description: 'Fruit disease immunity' },
      ],
      soilSuitability: '96/100 Soil Compatibility Score for Black Cotton soil',
      climateFit: 'Optimal seasonal thermal window in North Karnataka',
    },
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/crops/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to calculate recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">ML Crop Recommendation Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Explainable AI (XAI)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Machine Learning model trained on multi-spectral soil, weather, NPK parameters, and economic yield data.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Form Inputs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-emerald-400" /> Agronomic Feature Inputs
          </h3>

          <form onSubmit={handlePredict} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.temperature}
                  onChange={(e) => setInputs({ ...inputs, temperature: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Humidity (%)</label>
                <input
                  type="number"
                  value={inputs.humidity}
                  onChange={(e) => setInputs({ ...inputs, humidity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  value={inputs.rainfall}
                  onChange={(e) => setInputs({ ...inputs, rainfall: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Season</label>
                <select
                  value={inputs.season}
                  onChange={(e) => setInputs({ ...inputs, season: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                  <option value="Whole Year">Whole Year</option>
                </select>
              </div>
            </div>

            {/* Soil NPK Inputs */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold text-[11px] block">Soil Chemistry (NPK & pH)</span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">N</span>
                  <input
                    type="number"
                    value={inputs.nitrogen}
                    onChange={(e) => setInputs({ ...inputs, nitrogen: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-center font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">P</span>
                  <input
                    type="number"
                    value={inputs.phosphorus}
                    onChange={(e) => setInputs({ ...inputs, phosphorus: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-center font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">K</span>
                  <input
                    type="number"
                    value={inputs.potassium}
                    onChange={(e) => setInputs({ ...inputs, potassium: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-center font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">pH</span>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.ph}
                    onChange={(e) => setInputs({ ...inputs, ph: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{loading ? 'Running ML Pipeline...' : 'Run Crop ML Prediction'}</span>
            </button>
          </form>
        </div>

        {/* Prediction Results & Explainable AI */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* Top Result Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Primary ML Recommendation
                    </span>
                    <h3 className="text-3xl font-black text-white mt-1 flex items-center gap-2">
                      {result.recommendedCrop}
                      <Award className="w-6 h-6 text-emerald-400" />
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Model Confidence</span>
                      <span className="text-2xl font-black text-emerald-400">{result.confidenceScore}%</span>
                    </div>
                    <div className="text-right pl-3 border-l border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Risk Rating</span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        result.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {result.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Expected Yield</span>
                    <span className="text-base font-bold text-white mt-0.5 block">{result.expectedYieldTonsPerAcre} Tons / Acre</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Estimated Revenue Profit</span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5 block">₹{(result.profitEstimationINRPerAcre || (result as any).profitEstimationUSDPerAcre * 80 || 148000).toLocaleString()} / Acre</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] uppercase">Climate Match</span>
                    <span className="text-xs font-semibold text-teal-300 mt-1 block">{result.explainableAI.climateFit}</span>
                  </div>
                </div>

                {/* Explainable AI Primary Reason */}
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Explainable AI Reasoning:</span>
                    <p className="mt-0.5">{result.explainableAI.primaryReason}</p>
                  </div>
                </div>
              </div>

              {/* SHAP Feature Importance Visualization */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" /> SHAP Feature Weight Contributions
                    </h4>
                    <p className="text-xs text-slate-400">Mathematical breakdown of parameters driving crop selection decision</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.explainableAI.featureImportances.map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{item.feature} ({item.description})</span>
                        <span className="font-mono text-emerald-400">{(item.importance * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${item.importance * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Crops Options */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h4 className="font-bold text-white text-sm">Alternative Crop Options</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.alternativeCrops.map((alt, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-white">{alt.crop}</div>
                      <div className="text-slate-400">Confidence: <span className="text-emerald-400 font-bold">{alt.confidence}%</span></div>
                      <div className="text-slate-500 text-[11px]">Yield: {alt.yieldEstimate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
