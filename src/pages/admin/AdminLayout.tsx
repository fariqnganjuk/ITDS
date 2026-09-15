import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Server,
  Code2,
  Sliders,
  Users,
  LifeBuoy,
  ShieldCheck,
  Lock,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { getCurrentUser } from '../../lib/storage';

interface AdminLayoutProps {
  currentAdminTab: 'overview' | 'audit-log' | 'system-health' | 'api' | 'estimator-rules' | 'leads' | 'support' | 'team';
  onAdminTabChange: (tab: 'overview' | 'audit-log' | 'system-health' | 'api' | 'estimator-rules' | 'leads' | 'support' | 'team') => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminTab,
  onAdminTabChange,
  children
}) => {
  const currentUser = getCurrentUser();

  const navItems = [
    { id: 'overview', label: 'Monitoring Real-Time', icon: <Activity className="w-4 h-4 text-sky-400" /> },
    { id: 'team', label: 'Manajemen Tim (4 Spesialis)', icon: <Users className="w-4 h-4 text-violet-400" /> },
    { id: 'audit-log', label: 'Log Terpusat & SHA-256', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'system-health', label: 'Kesehatan & Auto-Scaling', icon: <Server className="w-4 h-4 text-purple-400" /> },
    { id: 'api', label: 'Integrasi API Pihak Ke-3', icon: <Code2 className="w-4 h-4 text-amber-400" /> },
    { id: 'estimator-rules', label: 'Formula Estimator CMS', icon: <Sliders className="w-4 h-4 text-blue-400" /> },
    { id: 'leads', label: 'Leads & CRM Pipeline', icon: <Users className="w-4 h-4 text-pink-400" /> },
    { id: 'support', label: 'Respon Tiket Bantuan', icon: <LifeBuoy className="w-4 h-4 text-cyan-400" /> },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Control Plane Admin</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              REAL-TIME WEBSOCKET EMULATOR
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Pusat Kendali & Integritas Sistem NEXA</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen operasional agency, penugasan tim, pemantauan beban server, pengawasan audit trail kriptografis, dan gateway API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="text-[10px] text-slate-400">Operator Aktif:</div>
            <div className="font-bold text-white flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span>{currentUser?.name || 'Administrator'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-mono">
                {currentUser?.title || currentUser?.role || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {navItems.map(item => {
          const isActive = currentAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onAdminTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-lg'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin Main Body */}
      <div className="min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
