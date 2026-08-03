import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  MapPin,
  Droplets,
  FlaskConical,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Farm } from '../types';

interface FarmsViewProps {
  farms: Farm[];
  onAddFarm: (farm: Farm) => void;
  onSelectFarm: (farmId: string) => void;
  selectedFarmId: string;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  farms,
  onAddFarm,
  onSelectFarm,
  selectedFarmId,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaAcres: 50,
    soilType: 'Black Cotton' as const,
    waterSource: 'Borewell Drip' as const,
    currentCrop: 'Tur (Pigeon Pea)',
    nitrogen: 120,
    phosphorus: 40,
    potassium: 190,
    ph: 7.2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm: Farm = {
      id: 'farm_' + Date.now(),
      userId: 'usr_101',
      name: formData.name || 'Afzalpur Organic Farm',
      location: formData.location || 'Kalaburagi District, Karnataka',
      latitude: 17.3297,
      longitude: 76.8343,
      areaAcres: Number(formData.areaAcres),
      soilType: formData.soilType,
      waterSource: formData.waterSource,
      currentCrop: formData.currentCrop,
      cropHistory: [
        { year: 2024, crop: 'Jowar (Sorghum)', yieldTons: 180 },
        { year: 2025, crop: formData.currentCrop, yieldTons: 220 },
      ],
      soilHealth: {
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        ph: Number(formData.ph),
        organicCarbon: 1.2,
      },
    };
    onAddFarm(newFarm);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-400" /> Multi-Farm Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store location coordinates, acreage, soil nutrient profiles, and water sources across all properties.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Farm Property
        </button>
      </div>

      {/* Farms List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {farms.map((f) => {
          const isSelected = f.id === selectedFarmId;
          return (
            <div
              key={f.id}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all space-y-4 ${
                isSelected
                  ? 'border-emerald-500 shadow-xl shadow-emerald-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{f.name}</h3>
                    {isSelected && (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active Farm
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {f.location} ({f.latitude}, {f.longitude})
                  </p>
                </div>
                {!isSelected && (
                  <button
                    onClick={() => onSelectFarm(f.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
                  >
                    Select Farm
                  </button>
                )}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Farm Area</span>
                  <span className="font-bold text-white">{f.areaAcres} Acres</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Soil Classification</span>
                  <span className="font-bold text-emerald-400">{f.soilType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Water Irrigation</span>
                  <span className="font-bold text-teal-400">{f.waterSource}</span>
                </div>
              </div>

              {/* Soil Chemistry NPK Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-emerald-400" /> Soil Nutrient Test Profile (NPK)
                  </span>
                  <span className="text-slate-400">pH Level: <span className="text-emerald-400 font-bold">{f.soilHealth.ph}</span></span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Nitrogen (N)</span>
                    <span className="font-bold text-emerald-300">{f.soilHealth.nitrogen} ppm</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Phosphorus (P)</span>
                    <span className="font-bold text-teal-300">{f.soilHealth.phosphorus} ppm</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Potassium (K)</span>
                    <span className="font-bold text-cyan-300">{f.soilHealth.potassium} ppm</span>
                  </div>
                </div>
              </div>

              {/* Crop History Table */}
              <div className="border-t border-slate-800/80 pt-3 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Historical Crop Harvests
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {f.cropHistory.map((item, idx) => (
                    <span key={idx} className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">
                      <span className="text-slate-500 font-mono">{item.year}:</span> {item.crop} ({item.yieldTons} Tons)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" /> Register New Farm Property
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sunny Slope Organic Farm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Salinas Valley, CA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    required
                    value={formData.areaAcres}
                    onChange={(e) => setFormData({ ...formData, areaAcres: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Loam">Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silt">Silt</option>
                    <option value="Black Cotton">Black Cotton</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Water Source</label>
                  <select
                    value={formData.waterSource}
                    onChange={(e) => setFormData({ ...formData, waterSource: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Canal">Canal</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 border-t border-slate-800 pt-3">
                <div>
                  <label className="block text-slate-400 mb-1">N (ppm)</label>
                  <input
                    type="number"
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">P (ppm)</label>
                  <input
                    type="number"
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">K (ppm)</label>
                  <input
                    type="number"
                    value={formData.potassium}
                    onChange={(e) => setFormData({ ...formData, potassium: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
