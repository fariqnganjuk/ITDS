import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Layout,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ChevronDown,
  Layers,
  Zap,
  Lock
} from 'lucide-react';
import { getServices } from '../../lib/storage';
import { ServiceItem } from '../../types';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const services = getServices();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6" />;
      case 'Layout': return <Layout className="w-6 h-6" />;
      default: return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Katalog Solusi</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Layanan Rekayasa Digital & Desain Enterprise
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Platform digital agency terintegrasi penuh. Setiap proyek dibangun dengan standar performa sub-detik, keamanan berlapis 2FA, dan transparansi milestone harian.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map(s => (
          <div
            key={s.id}
            className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  {getIcon(s.iconName)}
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {s.estimatedWeeks} Minggu Pengerjaan
                </span>
              </div>

              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">{s.category}</span>
              <h2 className="text-xl font-bold text-white mt-1 mb-3">{s.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{s.description}</p>

              <div className="space-y-2.5 mb-8">
                <div className="text-xs font-bold text-slate-200">Cakupan Deliverables Utama:</div>
                {s.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block">Investasi Mulai Dari</span>
                <span className="text-lg font-black text-white">Rp {s.basePrice.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('/estimasi')}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/30 transition flex items-center gap-2"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Hitung Biaya</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Guarantee Box */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Standar Keamanan Siber Otomatis di Setiap Layanan</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Semua paket sudah mencakup enkripsi AES-GCM 256-bit, pencegahan brute-force rate-limiting, proteksi CSRF/XSS, dan verifikasi sertifikat SSL.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/estimasi')}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          Kalkulasi Kustom
        </button>
      </div>
    </div>
  );
};
