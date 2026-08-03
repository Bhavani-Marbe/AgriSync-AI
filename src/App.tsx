import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sprout,
  BrainCircuit,
  Camera,
  Droplets,
  CloudSun,
  Bot,
  TrendingUp,
  FileText,
  BarChart3,
  Server,
  BookOpen,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ArchitectureDocModal } from './components/ArchitectureDocModal';
import { DashboardView } from './components/DashboardView';
import { FarmsView } from './components/FarmsView';
import { CropRecommendationView } from './components/CropRecommendationView';
import { DiseaseDetectionView } from './components/DiseaseDetectionView';
import { IrrigationFertilizerView } from './components/IrrigationFertilizerView';
import { WeatherView } from './components/WeatherView';
import { AiAssistantView } from './components/AiAssistantView';
import { MarketView } from './components/MarketView';
import { ReportsView } from './components/ReportsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminView } from './components/AdminView';

import {
  INITIAL_USER,
  INITIAL_FARMS,
  INITIAL_MARKET_TRENDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_METRICS,
} from './data/mockData';
import { UserRole, Farm, WeatherData, AppNotification } from './types';

export default function App() {
  const [role, setRole] = useState<UserRole>('FARMER');
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [selectedFarmId, setSelectedFarmId] = useState<string>(INITIAL_FARMS[0].id);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  const [weatherData, setWeatherData] = useState<WeatherData>({
    city: 'Kalaburagi, Karnataka',
    currentTemp: 32.5,
    condition: 'Partly Cloudy',
    humidity: 68,
    windSpeedKmH: 16.5,
    rainProbabilityPercent: 45,
    uvIndex: 7,
    forecast7Days: [
      { day: 'Sun (Today)', tempHigh: 33, tempLow: 22, condition: 'Partly Cloudy', rainProb: 45 },
      { day: 'Mon', tempHigh: 31, tempLow: 21, condition: 'Monsoon Showers', rainProb: 85 },
      { day: 'Tue', tempHigh: 30, tempLow: 20, condition: 'Light Rain', rainProb: 60 },
      { day: 'Wed', tempHigh: 32, tempLow: 22, condition: 'Sunny Spells', rainProb: 20 },
      { day: 'Thu', tempHigh: 34, tempLow: 23, condition: 'Warm & Humid', rainProb: 10 },
      { day: 'Fri', tempHigh: 35, tempLow: 24, condition: 'Hot', rainProb: 5 },
      { day: 'Sat', tempHigh: 34, tempLow: 23, condition: 'Sunny', rainProb: 15 },
    ],
    farmingSuggestions: [
      'Monsoon showers forecasted for Monday (85% probability, 45mm in Kalaburagi). Hold off on urea top-dressing.',
      'Optimal window for Tur & Cotton foliar spray is Wednesday through Friday under clear skies.',
      'Maintain borewell pump automation on Sunday morning to protect root moisture in Black Cotton soil.',
    ],
  });

  // Role-Based Menu Item Configuration
  const getNavItemsForRole = (userRole: UserRole) => {
    switch (userRole) {
      case 'FARM_MANAGER':
        return [
          { id: 'dashboard', label: 'Manager Dashboard', icon: LayoutDashboard },
          { id: 'farms', label: 'Farms & Laborers', icon: Sprout },
          { id: 'irrigation', label: 'Fertigation & Pumps', icon: Droplets },
          { id: 'disease-scanner', label: 'Field Disease Logs', icon: Camera },
          { id: 'analytics', label: 'Farm Yield Analytics', icon: BarChart3 },
          { id: 'reports', label: 'Worklog PDF Export', icon: FileText },
        ];
      case 'AGRONOMIST':
        return [
          { id: 'dashboard', label: 'Agronomist Desk', icon: LayoutDashboard },
          { id: 'ai-assistant', label: 'Farmer Consultations', icon: Bot },
          { id: 'disease-scanner', label: 'Pathology Diagnostics', icon: Camera },
          { id: 'crop-engine', label: 'Crop ML Engine', icon: BrainCircuit },
          { id: 'irrigation', label: 'Soil & Fertigation', icon: Droplets },
          { id: 'analytics', label: 'Outbreak Heatmaps', icon: BarChart3 },
          { id: 'reports', label: 'Agronomy PDF Reports', icon: FileText },
        ];
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'admin', label: 'Platform & Security Ops', icon: Server },
          { id: 'analytics', label: 'Telemetry & Usage', icon: BarChart3 },
          { id: 'farms', label: 'Farms Audit', icon: Sprout },
          { id: 'reports', label: 'System Audit Logs', icon: FileText },
        ];
      default: // FARMER
        return [
          { id: 'dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard },
          { id: 'farms', label: 'My Farms', icon: Sprout },
          { id: 'crop-engine', label: 'Crop Recommendation', icon: BrainCircuit },
          { id: 'disease-scanner', label: 'Disease Scanner', icon: Camera },
          { id: 'irrigation', label: 'Smart Irrigation', icon: Droplets },
          { id: 'weather', label: 'Weather Radar', icon: CloudSun },
          { id: 'ai-assistant', label: 'AI Agronomist', icon: Bot },
          { id: 'market', label: 'APMC Mandi Prices', icon: TrendingUp },
          { id: 'reports', label: 'PDF Reports', icon: FileText },
        ];
    }
  };

  const navItems = getNavItemsForRole(role);

  const handleAddFarm = (newFarm: Farm) => {
    setFarms([...farms, newFarm]);
    setSelectedFarmId(newFarm.id);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Auto-switch activeTab if unauthorized when role changes
  useEffect(() => {
    const isAllowed = navItems.some((item) => item.id === activeTab);
    if (!isAllowed) {
      setActiveTab('dashboard');
    }
  }, [role, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentRole={role}
        onRoleChange={setRole}
        farms={farms}
        selectedFarmId={selectedFarmId}
        onSelectFarm={setSelectedFarmId}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onDeleteNotification={handleDeleteNotification}
        weather={weatherData}
        onOpenArchitectureDoc={() => setShowArchModal(true)}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
      />

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 shrink-0 space-y-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1 shadow-lg sticky top-20">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-1.5 block">
              SaaS Navigation
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-800/80 mt-2 px-1">
              <button
                onClick={() => setShowArchModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-900/40 transition-all"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" /> Systems Docs
                </span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">ERD</span>
              </button>
            </div>
          </div>
        </aside>

        {/* View Component Switcher */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              farm={selectedFarm}
              weather={weatherData}
              marketTrends={INITIAL_MARKET_TRENDS}
              notifications={notifications}
              role={role}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'farms' && (
            <FarmsView
              farms={farms}
              onAddFarm={handleAddFarm}
              onSelectFarm={setSelectedFarmId}
              selectedFarmId={selectedFarmId}
            />
          )}

          {activeTab === 'crop-engine' && <CropRecommendationView farm={selectedFarm} />}

          {activeTab === 'disease-scanner' && <DiseaseDetectionView />}

          {activeTab === 'irrigation' && <IrrigationFertilizerView farm={selectedFarm} />}

          {activeTab === 'weather' && <WeatherView weather={weatherData} />}

          {activeTab === 'ai-assistant' && <AiAssistantView />}

          {activeTab === 'market' && <MarketView marketTrends={INITIAL_MARKET_TRENDS} />}

          {activeTab === 'reports' && <ReportsView farm={selectedFarm} marketTrends={INITIAL_MARKET_TRENDS} />}

          {activeTab === 'analytics' && <AnalyticsView farms={farms} />}

          {activeTab === 'admin' && <AdminView metrics={INITIAL_SYSTEM_METRICS} auditLogs={INITIAL_AUDIT_LOGS} />}
        </main>
      </div>

      {/* Systems Blueprint Architecture Modal */}
      <ArchitectureDocModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
    </div>
  );
}
