import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Pill,
  MapPin,
  ShieldCheck,
  Loader2,
  Sparkles,
  Info,
} from 'lucide-react';
import { DiseaseDetectionResult } from '../types';

export const DiseaseDetectionView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Tur (Pigeon Pea)');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseDetectionResult | null>({
    diseaseName: 'Tur Pod Borer & Wilt Advisory (Helicoverpa armigera)',
    scientificName: 'Helicoverpa armigera / Fusarium udum',
    confidence: 94.2,
    severity: 'Moderate',
    cause: 'Lepidopteran larvae feeding on developing pods combined with soil-borne fungal spore activity favored by monsoon humidity.',
    symptoms: [
      'Bored entry holes in developing pods with frass deposits',
      'Yellowing and drooping of terminal branches during flowering',
      'Xylem vessel black discoloration visible on splitting stem',
    ],
    treatment: [
      'Spray Neem Bio-shield (10,000 PPM) @ 3.0ml / Liter water',
      'Apply Chlorantraniliprole 18.5% SC @ 0.3ml / Liter water for larval control',
      'Install 5 pheromone traps per acre for pest population monitoring',
    ],
    medicines: [
      { name: 'Neem Bio-shield 10,000 PPM', dosage: '3.0ml / Liter of water', type: 'Botanical Insecticide' },
      { name: 'Chlorantraniliprole 18.5% SC', dosage: '0.3ml / Liter of water', type: 'Targeted Larvicide' },
      { name: 'Trichoderma viride 1% WP', dosage: '5.0g / kg seed treatment', type: 'Bio-Fungicide' },
    ],
    prevention: [
      'Intercropping Tur with Sorghum (Jowar) or Bajra in 1:4 row ratio',
      'Deep summer plowing to expose pupae to solar heat',
      'Cultivate wilt-resistant BSMR-736 or GRG-811 Tur varieties',
    ],
    nearbySupport: [
      { name: 'KVK Kalaburagi Pathology Lab', contact: '+91 (08472) 245123', distanceKm: 12.4, address: 'KVK Complex, Aland Road, Kalaburagi, KA' },
      { name: 'UAS Raichur Plant Health Clinic', contact: '+91 (08532) 220154', distanceKm: 45.2, address: 'University Campus, Lingasugur Road, Raichur, KA' },
    ],
  });

  const sampleImages = [
    {
      name: 'Tur Pod Borer & Leaf Rust',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb16425?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Cotton Bacterial Leaf Blight',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Healthy Pulse & Grain Leaves',
      url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        runDiagnosis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (url: string) => {
    setPreviewImage(url);
    runDiagnosis(url);
  };

  const runDiagnosis = async (imgData: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/disease/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imgData, cropType: selectedCrop }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Disease scan failed:', err);
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
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">AI Crop Pathology & Disease Scanner</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini Vision AI
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Upload leaf photo or choose a sample scan. Multimodal vision models identify plant pathogens, severities & treatments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="w-4 h-4 text-emerald-400" /> Image Scanner Upload
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Focus Crop Variety</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Tomato">Tomato</option>
                <option value="Maize">Maize / Corn</option>
                <option value="Wheat">Wheat</option>
                <option value="Potato">Potato</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-950/60 cursor-pointer relative transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Crop preview"
                  className="w-full h-40 object-cover rounded-xl border border-slate-700"
                />
              ) : (
                <div className="space-y-2">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-slate-300 font-semibold">Click or drag crop leaf photo</p>
                  <p className="text-[10px] text-slate-500">Supports PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            {/* Preset Samples */}
            <div>
              <span className="text-slate-400 text-[11px] font-semibold block mb-2">Or select sample crop scan:</span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(s.url)}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] text-slate-300 font-medium text-center transition-all"
                  >
                    <img src={s.url} alt={s.name} className="w-full h-12 object-cover rounded-lg mb-1" />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <p className="text-white font-bold text-base">Gemini Vision AI Analyzing Leaf Pathology...</p>
              <p className="text-xs text-slate-400">Scanning cellular lesion patterns, spore densities & chlorophyll distribution</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Diagnosis Headline */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Detected Pathology</span>
                    <h3 className="text-2xl font-bold text-white mt-0.5">{result.diseaseName}</h3>
                    <span className="text-xs text-slate-400 font-mono italic">{result.scientificName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Vision Confidence</span>
                      <span className="text-2xl font-black text-emerald-400">{result.confidence}%</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      result.severity === 'Severe' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {result.severity} Severity
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300">
                  <span className="font-bold text-slate-200 block">Root Cause & Environmental Drivers:</span>
                  <p className="mt-0.5">{result.cause}</p>
                </div>

                {/* Treatment & Medicines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actionable Treatment Plan
                    </h4>
                    <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
                      {result.treatment.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-teal-400" /> Prescribed Agri-Medicines
                    </h4>
                    <div className="space-y-1.5">
                      {result.medicines.map((m, idx) => (
                        <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                          <span className="font-bold text-emerald-300">{m.name}</span>
                          <p className="text-[10px] text-slate-400">Dosage: {m.dosage} • Type: {m.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nearby Agricultural Support Centers */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Nearby Extension & Agronomy Centers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.nearbySupport.map((c, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-white">{c.name}</div>
                      <p className="text-slate-400">{c.address}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-emerald-400 font-semibold">{c.contact}</span>
                        <span className="text-slate-500">{c.distanceKm} km away</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
