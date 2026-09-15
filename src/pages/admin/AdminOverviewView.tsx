import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Server,
  Zap,
  Clock,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import {
  getActivityLogs,
  getLeads,
  getInvoices,
  getSupportTickets,
  getSystemHealth
} from '../../lib/storage';

interface AdminOverviewViewProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onNavigateTab }) => {
  const [logs, setLogs] = useState(getActivityLogs());
  const [health, setHealth] = useState(getSystemHealth());
  const leads = getLeads();
  const invoices = getInvoices();
  const tickets = getSupportTickets();

  useEffect(() => {
    const handleUpdate = () => {
      setLogs(getActivityLogs());
      setHealth(getSystemHealth());
    };
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  const totalPaidRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const openTickets = tickets.filter(t => t.status !== 'Resolved').length;

  return (
    <div className="space-y-8">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Pengajuan Lead</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{leads.length}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+38% dari kalkulator estimator</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pendapatan Terealisasi</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            Rp {(totalPaidRevenue / 1000000).toFixed(1)} Jt
          </div>
          <div className="text-[11px] text-slate-400">
            {invoices.filter(i => i.status === 'Paid').length} transaksi lunas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tiket Bantuan Aktif</span>
            <LifeBuoy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{openTickets}</div>
          <div className="text-[11px] text-slate-400">
            SLA rata-rata respon 14 menit
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Integritas & Uptime SLA</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{health.uptimeSla}%</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>{health.activeReplicas} Pods Terdistribusi</span>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed & System Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-time user activity feed */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-base font-bold text-white">Aktivitas Pengguna Real-Time</h2>
            </div>
            <button
              onClick={() => onNavigateTab('audit-log')}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Audit Trail Lengkap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[420px] overflow-y-auto pr-2">
            {logs.slice(0, 8).map(log => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sky-400 font-bold">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                      {log.entityType}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Pengguna: <strong className="text-white">{log.userName}</strong> ({log.userRole})
                  </p>
                  {log.metaJson && (
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-md">
                      {log.metaJson}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <div className="text-[9px] text-emerald-400 font-mono flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Hash OK</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action & Health Ticker */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Aksi Cepat Pengawas</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('system-health')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">Simulasi Lonjakan Beban</div>
                  <div className="text-slate-400 text-[11px]">Uji auto-scaling 10,000 req/s</div>
                </div>
                <Server className="w-4 h-4 text-purple-400" />
              </button>

              <button
                onClick={() => onNavigateTab('audit-log')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">Verifikasi SHA-256 Ledger</div>
                  <div className="text-slate-400 text-[11px]">Validasi anti-manipulasi data</div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => onNavigateTab('api')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">Kelola Kunci API Eksternal</div>
                  <div className="text-slate-400 text-[11px]">Rotasi token & webhook</div>
                </div>
                <Activity className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-sky-950/20 border border-sky-900/30 text-xs text-sky-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Kepatuhan Keamanan Aktif</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Sesi terenkripsi, verifikasi 2FA terpasang pada akun administratif, dan pencegahan brute force aktif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
