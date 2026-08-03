import React, { useState } from 'react';
import {
  Sprout,
  Bell,
  BookOpen,
  CloudSun,
  Shield,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { UserRole, Farm, AppNotification } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  farms: Farm[];
  selectedFarmId: string;
  onSelectFarm: (farmId: string) => void;
  notifications: AppNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  weather?: { city: string; currentTemp: number };
  onOpenArchitectureDoc: () => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  farms,
  selectedFarmId,
  onSelectFarm,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  weather,
  onOpenArchitectureDoc,
  activeTab,
  onNavigateTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigateTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-900/40">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  AgriSync AI
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  SaaS v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Intelligent Farm Management Platform</p>
            </div>
          </div>

          {/* Active Farm Selector */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-slate-400 text-xs font-medium">Farm:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => onSelectFarm(e.target.value)}
              className="bg-transparent text-emerald-300 font-semibold focus:outline-none cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-slate-200">
                  {f.name} ({f.areaAcres} Acres)
                </option>
              ))}
            </select>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Architecture Doc Blueprint Trigger */}
            <button
              onClick={onOpenArchitectureDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-semibold transition-all shadow-sm"
              title="View Architecture, ERD, API Specs & Roadmap"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Architecture & Docs</span>
            </button>

            {/* Role Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <Shield className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {(['FARMER', 'FARM_MANAGER', 'AGRONOMIST', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleChange(r)}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                    currentRole === r
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Weather Quick Widget */}
            <button
              onClick={() => onNavigateTab('weather')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/60 border border-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
            >
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>{weather ? `${weather.currentTemp}°C ${weather.city.split(',')[0]}` : '32°C Kalaburagi'}</span>
            </button>

            {/* Notifications Modal Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" /> Notifications ({unreadCount} Unread)
                    </h4>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && onMarkAllNotificationsRead && (
                        <button
                          onClick={onMarkAllNotificationsRead}
                          className="text-[10px] text-emerald-400 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto my-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications available</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`py-2.5 flex items-start gap-3 ${
                            n.isRead ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.priority === 'HIGH' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                              <div className="flex items-center gap-1">
                                {!n.isRead && onMarkNotificationRead && (
                                  <button
                                    onClick={() => onMarkNotificationRead(n.id)}
                                    className="text-[10px] text-emerald-400 hover:underline"
                                    title="Mark as read"
                                  >
                                    Read
                                  </button>
                                )}
                                {onDeleteNotification && (
                                  <button
                                    onClick={() => onDeleteNotification(n.id)}
                                    className="text-slate-500 hover:text-rose-400 ml-1 text-xs"
                                    title="Delete notification"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs" title={`Logged in as ${currentRole}`}>
                {currentRole === 'FARMER' ? 'BM' : currentRole === 'FARM_MANAGER' ? 'SP' : currentRole === 'AGRONOMIST' ? 'PP' : 'SA'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
