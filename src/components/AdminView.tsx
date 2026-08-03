import React from 'react';
import {
  Cpu,
  Server,
  Zap,
  ShieldCheck,
  Activity,
  UserCheck,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { SystemMetric, AuditLog, User } from '../types';

interface AdminViewProps {
  metrics: SystemMetric;
  auditLogs: AuditLog[];
}

export const AdminView: React.FC<AdminViewProps> = ({ metrics, auditLogs }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Server className="w-6 h-6 text-emerald-400" /> Platform Administration & Model Ops
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Live infrastructure telemetry, Celery async queue status, Redis cache hit rates & audit logs.
        </p>
      </div>

      {/* System Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> CPU Load
          </span>
          <div className="text-xl font-black text-white">{metrics.cpuUsagePercent}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-teal-400" /> RAM Usage
          </span>
          <div className="text-xl font-black text-white">{metrics.ramUsageMB} MB</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Celery Workers
          </span>
          <div className="text-xl font-black text-amber-400">{metrics.activeCeleryWorkers} Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Redis Cache Hit
          </span>
          <div className="text-xl font-black text-cyan-400">{metrics.redisCacheHitRatePercent}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Avg Latency
          </span>
          <div className="text-xl font-black text-white">{metrics.averageLatencyMs} ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" /> Predictions Run
          </span>
          <div className="text-xl font-black text-white">{metrics.totalPredictionsCount.toLocaleString()}</div>
        </div>
      </div>

      {/* AI Model Management & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Deployment Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Active Machine Learning Models
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Crop Recommendation XGBoost v3.2', status: 'Production', accuracy: '96.4%', latency: '12ms' },
              { name: 'Gemini 3.6 Flash Pathology Scanner', status: 'Production', accuracy: '95.1%', latency: '240ms' },
              { name: 'Fertilizer Deficit Neural Net', status: 'Production', accuracy: '94.8%', latency: '18ms' },
            ].map((m, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{m.name}</span>
                  <span className="text-slate-400 text-[10px]">Latency: {m.latency}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold border border-emerald-500/30">
                    {m.status} ({m.accuracy})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-emerald-400" /> Security Audit Log
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-emerald-400 font-bold block">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{log.userEmail} • {log.ipAddress}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
