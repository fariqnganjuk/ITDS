import React, { useState } from 'react';
import {
  Layers,
  FileText,
  MessageSquare,
  CreditCard,
  PenTool,
  LifeBuoy,
  Lock,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types';
import { getCurrentUser } from '../../lib/storage';

interface ClientPortalLayoutProps {
  currentSubTab: 'overview' | 'chat' | 'invoices' | 'contracts' | 'support' | 'files';
  onSubTabChange: (tab: 'overview' | 'chat' | 'invoices' | 'contracts' | 'support' | 'files') => void;
  children: React.ReactNode;
}

export const ClientPortalLayout: React.FC<ClientPortalLayoutProps> = ({
  currentSubTab,
  onSubTabChange,
  children
}) => {
  const currentUser = getCurrentUser();

  const tabs = [
    { id: 'overview', label: 'Progres Proyek', icon: <Layers className="w-4 h-4" /> },
    { id: 'chat', label: 'Diskusi Terenkripsi', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'invoices', label: 'Faktur & Tagihan', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'contracts', label: 'Kontrak & E-Sign', icon: <PenTool className="w-4 h-4" /> },
    { id: 'support', label: 'Tiket Bantuan & 2FA', icon: <LifeBuoy className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Client Info & Security Status */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-sky-600/20">
            {currentUser?.name.charAt(0) || 'K'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentUser?.name || 'Klien'}</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                {currentUser?.role || 'Client'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
          </div>
        </div>

        {/* Security Seals Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sesi Terenkripsi AES-256</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            <Lock className="w-4 h-4 text-sky-400" />
            <span>2FA: <strong className="text-white">{currentUser?.twoFaEnabled ? 'Aktif' : 'Non-aktif'}</strong></span>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map(t => {
          const isActive = currentSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSubTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[450px]">
        {children}
      </div>
    </div>
  );
};
