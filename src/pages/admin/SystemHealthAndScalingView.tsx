import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Zap,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { getSystemHealth, updateSystemHealth, logActivity } from '../../lib/storage';

export const SystemHealthAndScalingView: React.FC = () => {
  const [health, setHealth] = useState(getSystemHealth());
  const [isSimulatingSpike, setIsSimulatingSpike] = useState(false);
  const [spikeNotice, setSpikeNotice] = useState<string | null>(null);

  // Auto-scaler settings
  const [minReplicas, setMinReplicas] = useState(2);
  const [maxReplicas, setMaxReplicas] = useState(12);
  const [targetCpu, setTargetCpu] = useState(70);

  const handleSimulateLoadSpike = () => {
    setIsSimulatingSpike(true);
    setSpikeNotice('Mendeteksi lonjakan trafik 8,400 req/s! Horizontal Pod Autoscaler (HPA) aktif...');

    // Phase 1: Spike up
    setTimeout(() => {
      updateSystemHealth({
        cpuUsagePercent: 88,
        memoryUsagePercent: 79,
        activeReplicas: 7,
        requestsPerSecond: 8420
      });
      setHealth(getSystemHealth());
      logActivity({
        action: 'AUTOSCALE_TRIGGERED',
        entityType: 'system',
        entityId: 'sys_autoscaler',
        meta: { reason: 'CPU > 70%', scaledTo: 7, traffic: '8420 req/s' }
      });
    }, 700);

    // Phase 2: Load stabilized across new pods
    setTimeout(() => {
      updateSystemHealth({
        cpuUsagePercent: 42,
        memoryUsagePercent: 54,
        activeReplicas: 8,
        requestsPerSecond: 8600
      });
      setHealth(getSystemHealth());
      setSpikeNotice('Autoscaling Berhasil: 8 Pods beroperasi seimbang. Latensi sistem stabil di 22ms.');
      setIsSimulatingSpike(false);
    }, 2500);
  };

  const handleResetScaling = () => {
    updateSystemHealth({
      cpuUsagePercent: 28,
      memoryUsagePercent: 41,
      activeReplicas: 3,
      requestsPerSecond: 340
    });
    setHealth(getSystemHealth());
    setSpikeNotice('Beban trafik normal kembali. Autoscaler merampingkan kluster ke 3 pods.');
    logActivity({
      action: 'AUTOSCALE_COOLED_DOWN',
      entityType: 'system',
      entityId: 'sys_autoscaler',
      meta: { scaledTo: 3, traffic: '340 req/s' }
    });
    setTimeout(() => setSpikeNotice(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Kluster Infrastruktur & Skalabilitas Otomatis</h2>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  K8s HPA ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Horizontal Pod Autoscaler terintegrasi untuk mendistribusikan lonjakan beban pengunjung secara elastis tanpa downtime.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSimulateLoadSpike}
              disabled={isSimulatingSpike}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isSimulatingSpike ? 'Menganalisis Beban...' : 'Uji Lonjakan Beban (8k req/s)'}</span>
            </button>

            <button
              onClick={handleResetScaling}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Reset Normal
            </button>
          </div>
        </div>

        {spikeNotice && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800 text-xs text-purple-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{spikeNotice}</span>
          </div>
        )}
      </div>

      {/* Real-time Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Beban CPU Terpakai</span>
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{health.cpuUsagePercent}%</div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                health.cpuUsagePercent > 80 ? 'bg-rose-500' : 'bg-sky-500'
              }`}
              style={{ width: `${health.cpuUsagePercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">Target Autoscaling: {targetCpu}%</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Memori RAM Terdistribusi</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{health.memoryUsagePercent}%</div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${health.memoryUsagePercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">Total Heap: 32 GB Pool</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Pod Replicas</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{health.activeReplicas} / {maxReplicas}</div>
          <div className="text-[11px] text-slate-400">
            Min: {minReplicas} &bull; Max: {maxReplicas} Pods
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Throughput Jaringan</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{health.requestsPerSecond.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Rata-rata Respon: {health.databaseLatencyMs} ms
          </div>
        </div>
      </div>

      {/* Auto-scaling Configuration Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Konfigurasi Kebijakan Skalabilitas Otomatis (Autoscaling Policy)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">Minimum Replicas (Beban Rendah)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={minReplicas}
              onChange={e => setMinReplicas(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">Maksimum Replicas (Lonjakan Beban)</label>
            <input
              type="number"
              min={5}
              max={30}
              value={maxReplicas}
              onChange={e => setMaxReplicas(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">Target Ambang Batas CPU (%)</label>
            <input
              type="number"
              min={50}
              max={90}
              value={targetCpu}
              onChange={e => setTargetCpu(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
