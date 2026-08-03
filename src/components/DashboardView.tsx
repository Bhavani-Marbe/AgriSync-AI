import React, { useState } from 'react';
import {
  TrendingUp,
  Sprout,
  Droplets,
  AlertCircle,
  CloudRain,
  CheckCircle2,
  PlusCircle,
  Camera,
  Bot,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Sun,
  ShieldCheck,
  Users,
  Tractor,
  Package,
  Activity,
  FileCheck2,
  MessageSquare,
  AlertTriangle,
  Database,
  Cpu,
  Server,
  Terminal,
  ShieldAlert,
} from 'lucide-react';
import { Farm, WeatherData, MarketPriceTrend, AppNotification, UserRole } from '../types';

interface DashboardViewProps {
  farm: Farm;
  weather: WeatherData;
  marketTrends: MarketPriceTrend[];
  notifications: AppNotification[];
  role?: UserRole;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farm,
  weather,
  marketTrends,
  notifications,
  role = 'FARMER',
  onNavigateTab,
}) => {
  // Farmer Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Apply Urea & DAP basal dose in Afzalpur Tur Block', completed: false, category: 'Fertilizer' },
    { id: 2, title: 'Scan Tur leaves for Pod Borer symptoms', completed: true, category: 'Disease Scan' },
    { id: 3, title: 'Run borewell drip pump for 45 mins at 05:30 AM', completed: false, category: 'Irrigation' },
    { id: 4, title: `Check APMC Kalaburagi Tur Mandi rates (₹7,920/qtl)`, completed: true, category: 'Market' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTaskTitle.trim(), completed: false, category: 'General' },
    ]);
    setNewTaskTitle('');
  };

  const topMarket = marketTrends[0];
  const estimatedRevenueINR = Math.round(farm.areaAcres * 85000);

  // Render role-specific dashboard content
  if (role === 'FARM_MANAGER') {
    return (
      <div className="space-y-6">
        {/* Manager Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                👨‍💼 Role: Farm Manager Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome, Shivappa & Basavaraj (Managers)
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Managing 3 Properties across Kalaburagi, Raichur & Bidar • 360 Acres under supervision
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onNavigateTab('irrigation')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
                <Droplets className="w-4 h-4" /> Manage Fertigation
              </button>
              <button onClick={() => onNavigateTab('reports')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> Export Worklogs
              </button>
            </div>
          </div>
        </div>

        {/* Manager KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Supervised Workforce</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">18 <span className="text-xs text-slate-400 font-normal">Active Laborers</span></div>
            <p className="text-[11px] text-emerald-400 mt-1">5 Workers assigned to Afzalpur Block</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Machinery & Pumps</span>
              <Tractor className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">6/6 <span className="text-xs text-slate-400 font-normal">Operational</span></div>
            <p className="text-[11px] text-slate-400 mt-1">2 Mahindra Tractors • 4 Drip Controllers</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Fertilizer Inventory</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">45 Bags <span className="text-xs text-slate-400 font-normal">Urea / DAP</span></div>
            <p className="text-[11px] text-amber-400 mt-1">Reorder threshold: Neem oil low (15L remaining)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Weekly Farm Expenses</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">₹1,55,000</div>
            <p className="text-[11px] text-emerald-400 mt-1">Labor: ₹85k • Diesel: ₹28k • Fertigation: ₹42k</p>
          </div>
        </div>

        {/* Manager Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Tractor className="w-5 h-5 text-blue-400" /> Field Operations & Shift Logs
            </h3>
            <div className="space-y-3">
              {[
                { time: '06:00 AM', location: 'Afzalpur Block #1', action: 'Borewell Pump #2 initiated drip fertigation with 19-19-19 NPK.', status: 'COMPLETED' },
                { time: '08:30 AM', location: 'Sindhanur Cotton Field', action: 'Workforce (8 laborers) completed weeding and soil aerating.', status: 'COMPLETED' },
                { time: '01:00 PM', location: 'Humnabad Sugarcane', action: 'Canal sluice intake checked. Water table depth verified at 42ft.', status: 'IN_PROGRESS' },
                { time: '04:30 PM', location: 'Kalaburagi Yard', action: 'Receive 50 bags Neem-coated Urea from APMC input dealer.', status: 'SCHEDULED' },
              ].map((log, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-blue-400">{log.time}</span> • <span className="text-slate-300 font-semibold">{log.location}</span>
                    <p className="text-slate-400 mt-0.5">{log.action}</p>
                  </div>
                  <span className={`px-2 py-1 rounded font-bold text-[10px] ${
                    log.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : log.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Field Worker Roster
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Shivappa (Head Manager)', farm: 'Afzalpur Tur Farm', status: 'On Duty' },
                { name: 'Basavaraj (Irrigation Tech)', farm: 'Afzalpur Tur Farm', status: 'On Duty' },
                { name: 'Mahadev (Tractor Driver)', farm: 'Sindhanur Estate', status: 'In Transit' },
                { name: 'Ashwini (Pest Inspector)', farm: 'Bidar Sugarcane', status: 'On Duty' },
                { name: 'Kiran (Store Keeper)', farm: 'Central Input Store', status: 'On Duty' },
              ].map((w, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">{w.name}</span>
                    <span className="text-[10px] text-slate-400">{w.farm}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-semibold">{w.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'AGRONOMIST') {
    return (
      <div className="space-y-6">
        {/* Agronomist Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                🧪 Role: Senior Agronomist Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome, Dr. Prakash Patil & Dr. Meera Joshi
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                University of Agricultural Sciences (UAS) Raichur & KVK Kalaburagi Advisory Wing
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onNavigateTab('agronomist')} className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
                <Bot className="w-4 h-4" /> AI Diagnostics Queue
              </button>
              <button onClick={() => onNavigateTab('disease-scanner')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" /> Review Scans
              </button>
            </div>
          </div>
        </div>

        {/* Agronomist KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Pending Consultations</span>
              <MessageSquare className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">12 <span className="text-xs text-slate-400 font-normal">Farmers Waiting</span></div>
            <p className="text-[11px] text-amber-400 mt-1">Queries from Bhavani Marbe, Ramesh Patil, Suresh Gowda</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Pathology AI Scans Reviewed</span>
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">148 <span className="text-xs text-slate-400 font-normal">This Week</span></div>
            <p className="text-[11px] text-emerald-400 mt-1">96.2% Vision AI agreement rate</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Soil Chemistry Tests</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">32 <span className="text-xs text-slate-400 font-normal">Black Cotton Soil Samples</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Kalaburagi & Bidar soil testing labs</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>High Risk Outbreaks</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 mt-2">2 <span className="text-xs text-slate-400 font-normal">Alerts Issued</span></div>
            <p className="text-[11px] text-rose-400 mt-1">Tur Pod Borer & Cotton Bacterial Blight</p>
          </div>
        </div>

        {/* Agronomist Advisory Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-400" /> Active Pathology Cases & Prescription Desk
            </h3>
            <div className="space-y-3">
              {[
                { farmer: 'Bhavani Marbe (Afzalpur)', crop: 'Tur (Pigeon Pea)', issue: 'Pod borer marks & wilt detected via Vision AI', prescription: 'Apply Neem Bio-shield + Chlorantraniliprole 18.5% SC @ 0.3ml/L.', status: 'VERIFIED' },
                { farmer: 'Ramesh Patil (Raichur)', crop: 'Cotton', issue: 'Bacterial Leaf Blight spots on lower leaves', prescription: 'Streptocycline 6g + Copper Oxychloride 50g in 60L water.', status: 'ACTION_REQUIRED' },
                { farmer: 'Suresh Gowda (Bidar)', crop: 'Sugarcane', issue: 'Iron chlorosis yellowing due to high alkaline soil pH (8.1)', prescription: 'Foliar spray of Ferrous Sulphate 0.5% + Citric Acid 0.1%.', status: 'VERIFIED' },
              ].map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{c.farmer}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      c.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-300"><strong className="text-teal-400">Crop & Symptom:</strong> {c.crop} • {c.issue}</p>
                  <p className="text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800"><strong className="text-emerald-400">Agronomist Recommendation:</strong> {c.prescription}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Regional Outbreak Heatmap
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { region: 'Kalaburagi (Afzalpur / Sedam)', pathogen: 'Tur Pod Borer (Helicoverpa)', risk: 'HIGH' },
                { region: 'Raichur (Sindhanur / Manvi)', pathogen: 'Cotton Pink Bollworm', risk: 'MEDIUM' },
                { region: 'Bidar (Humnabad / Basavakalyan)', pathogen: 'Sugarcane Woolly Aphid', risk: 'LOW' },
                { region: 'Vijayapura (Indi / Sindagi)', pathogen: 'Grape Downy Mildew', risk: 'HIGH' },
              ].map((h, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">{h.region}</span>
                    <span className="text-[10px] text-slate-400">{h.pathogen}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    h.risk === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : h.risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {h.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'ADMIN') {
    return (
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ⚡ Role: Super Admin & System Operations
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                AgriSync Platform Control Center
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Managing Multi-Tenant RBAC, Redis Caching, Celery Async Queues & ML Infrastructure
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onNavigateTab('admin')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
                <Server className="w-4 h-4" /> System Telemetry
              </button>
              <button onClick={() => onNavigateTab('analytics')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" /> Platform Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Admin Infrastructure Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Platform Users</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">1,240 <span className="text-xs text-slate-400 font-normal">Active Farmers</span></div>
            <p className="text-[11px] text-emerald-400 mt-1">45 Managers • 18 Agronomists • 2 Admins</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Celery Async Workers</span>
              <Terminal className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2">8 / 8 <span className="text-xs text-slate-400 font-normal">Active</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Queue latency: 12ms • Zero backpressure</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Redis Cache Hit Rate</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 mt-2">94.2%</div>
            <p className="text-[11px] text-cyan-400 mt-1">APMC mandi price queries served from cache</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>ML Inferences Served</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">18,450</div>
            <p className="text-[11px] text-emerald-400 mt-1">Gemini Vision AI + XGBoost Crop Engine</p>
          </div>
        </div>

        {/* User Management & Security Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" /> Registered System Users & RBAC Permissions
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Bhavani Marbe', email: 'bhavani.marbe@agrisync.in', role: 'FARMER', farm: 'Kalaburagi Tur Farm (125 Acres)', status: 'VERIFIED' },
                { name: 'Shivappa & Basavaraj', email: 'manager.shivappa@agrisync.in', role: 'FARM_MANAGER', farm: 'Supervising 3 Karnataka Farms', status: 'VERIFIED' },
                { name: 'Dr. Prakash Patil', email: 'dr.patil.agronomy@agrisync.in', role: 'AGRONOMIST', farm: 'UAS Raichur & KVK Kalaburagi', status: 'VERIFIED' },
                { name: 'System Admin', email: 'admin@agrisync.in', role: 'ADMIN', farm: 'Platform Governance & Cloud Ops', status: 'VERIFIED' },
              ].map((u, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">{u.name} ({u.email})</span>
                    <span className="text-[11px] text-slate-400">{u.farm}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold rounded-lg text-[10px]">
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" /> Security & API Audit Log
            </h4>
            <div className="space-y-2 text-[11px]">
              {[
                { time: '08:32 AM', email: 'bhavani.marbe@agrisync.in', endpoint: 'POST /api/crops/recommend', status: '200 OK' },
                { time: '08:15 AM', email: 'bhavani.marbe@agrisync.in', endpoint: 'POST /api/disease/diagnose', status: '200 OK' },
                { time: '07:50 AM', email: 'admin@agrisync.in', endpoint: 'PUT /api/admin/models/v3', status: '200 OK' },
                { time: '06:10 AM', email: 'bhavani.marbe@agrisync.in', endpoint: 'POST /api/auth/refresh', status: '200 OK' },
              ].map((log, idx) => (
                <div key={idx} className="p-2 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">{log.time}</span> • <span className="text-slate-200 font-mono">{log.endpoint}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT FARMER DASHBOARD
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Active Farm: {farm.name}
              </span>
              <span className="text-xs text-slate-400">• {farm.location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Namaste, Bhavani Marbe! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              AI models predict optimal growing conditions for <span className="text-emerald-400 font-semibold">{farm.currentCrop}</span> in {weather.city}. Role: <span className="text-emerald-400 font-semibold uppercase">FARMER</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('crop-engine')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all"
            >
              <Sprout className="w-4 h-4" /> Get Crop Prediction
            </button>
            <button
              onClick={() => onNavigateTab('disease-scanner')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" /> Scan Leaf Disease
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Farm Area</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{farm.areaAcres} <span className="text-xs text-slate-400 font-normal">Acres</span></div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Soil: {farm.soilType} • {farm.waterSource}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Estimated Season Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">₹{estimatedRevenueINR.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Based on {farm.areaAcres} Acres @ current market yield
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Soil NPK Health</span>
            <Droplets className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {farm.soilHealth.nitrogen} <span className="text-xs text-slate-400 font-normal">N-P-K ({farm.soilHealth.ph} pH)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Optimal for Tur (Pigeon Pea) Kharif cycle
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Alerts</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{notifications.length} <span className="text-xs text-slate-400 font-normal">Active</span></div>
          <p className="text-[11px] text-amber-400 mt-1">
            1 High Priority Monsoon Alert
          </p>
        </div>
      </div>

      {/* Main Content Grid: Tasks & Weather/Market Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Today's Action Plan
              </h3>
              <p className="text-xs text-slate-400">Automated task schedule based on weather and soil data</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  task.completed
                    ? 'bg-slate-950/60 border-slate-800 text-slate-500 line-through'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-emerald-500/50 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    task.completed ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  {task.category}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Add new farm task or action item..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Task
            </button>
          </form>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onNavigateTab('irrigation')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
            >
              <Droplets className="w-4 h-4 text-teal-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">Smart Irrigation</div>
              <div className="text-[10px] text-slate-400">Schedule run</div>
            </button>

            <button
              onClick={() => onNavigateTab('ai-assistant')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
            >
              <Bot className="w-4 h-4 text-emerald-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">AI Agronomist</div>
              <div className="text-[10px] text-slate-400">Ask questions</div>
            </button>

            <button
              onClick={() => onNavigateTab('market')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
            >
              <TrendingUp className="w-4 h-4 text-amber-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">Market Prices</div>
              <div className="text-[10px] text-slate-400">Trends & Mandis</div>
            </button>

            <button
              onClick={() => onNavigateTab('reports')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">Generate PDF</div>
              <div className="text-[10px] text-slate-400">Farm report</div>
            </button>
          </div>
        </div>

        {/* Sidebar Cards: Weather & Top Market */}
        <div className="space-y-4">
          {/* Weather Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" /> {weather.city} Weather Intelligence
              </h4>
              <button
                onClick={() => onNavigateTab('weather')}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                7-Day Forecast <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-extrabold text-white">{weather.currentTemp}°C</div>
                <div className="text-xs text-slate-400 mt-0.5">{weather.condition}</div>
              </div>
              <div className="text-right text-xs space-y-1 text-slate-300">
                <p>Humidity: <span className="font-semibold">{weather.humidity}%</span></p>
                <p>Rain Prob: <span className="font-semibold text-teal-400">{weather.rainProbabilityPercent}%</span></p>
                <p>Wind: <span className="font-semibold">{weather.windSpeedKmH} km/h</span></p>
              </div>
            </div>
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
              <CloudRain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>{weather.farmingSuggestions[0]}</p>
            </div>
          </div>

          {/* Top Market Commodity Ticker */}
          {topMarket && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Market Price Radar
                </h4>
                <button
                  onClick={() => onNavigateTab('market')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  All Markets <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-400">{topMarket.crop}</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    ₹{topMarket.currentPricePerQuintalINR} <span className="text-xs font-normal text-slate-400">/ Quintal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg">
                    +{topMarket.priceChange24hPercent}% (24h)
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{topMarket.bestSellingTime}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
