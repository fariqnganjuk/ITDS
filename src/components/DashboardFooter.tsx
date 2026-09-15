import React from 'react';
import { ShieldCheck, Compass, Lock, Activity, Users } from 'lucide-react';
import { getCurrentUser } from '../lib/storage';

interface DashboardFooterProps {
  onNavigate: (path: string) => void;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ onNavigate }) => {
  const currentUser = getCurrentUser();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-3 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Operational status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Sistem Operasional (99.9% Uptime)</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">&bull;</span>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>AES-GCM 256-bit Enkripsi Sesi</span>
          </div>
        </div>

        {/* Right: Quick Guide & User info */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/panduan')}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition font-medium text-[11px]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Panduan & Alur Sistem</span>
          </button>

          <span className="text-slate-700">&bull;</span>

          <div className="text-[11px] text-slate-400">
            Masuk sebagai:{' '}
            <span className="text-slate-200 font-semibold">
              {currentUser?.name || 'Pengguna'}
            </span>{' '}
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase text-[9px] font-mono">
              {currentUser?.role || 'Guest'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
