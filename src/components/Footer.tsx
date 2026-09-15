import React from 'react';
import { ShieldCheck, Lock, Award, Zap, Code2, Server, CheckCircle } from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../lib/i18n';

interface FooterProps {
  onNavigate: (path: string) => void;
  currentLang: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentLang }) => {
  const t = DICTIONARY[currentLang].nav;

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      {/* Security & Standard Seals Banner */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Standar Keamanan Siber Terverifikasi:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
              AES-GCM 256-bit Client-Side Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
              Two-Factor Authentication (TOTP RFC 6238)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
              SHA-256 Audit Trail Cryptographic Seal
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              99.9% Uptime SLA & Auto-scaling
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About Agency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">NEXA Digital Agency</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Platform Website Digital Agency full-functional (referensi Moon Interactive Solution). Menggabungkan etalase portfolio, kalkulator estimasi transparan, portal klien aman dengan 2FA, dan sistem CMS terpusat.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            <div>Jakarta &bull; Kuala Lumpur &bull; Singapore</div>
            <div>Dukungan: <a href="mailto:support@moon-interactive.com" className="text-sky-400 hover:underline">support@moon-interactive.com</a></div>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-2">
          <span className="font-semibold text-white uppercase text-[11px] tracking-wider block mb-3">Navigasi Utama</span>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('/')} className="hover:text-white transition">{t.home}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/layanan')} className="hover:text-white transition">{t.services}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/portfolio')} className="hover:text-white transition">{t.portfolio}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/estimasi')} className="text-sky-400 hover:text-sky-300 font-medium transition">{t.estimator}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/kontak')} className="hover:text-white transition">{t.contact}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/panduan')} className="text-sky-400 hover:text-sky-300 font-medium transition flex items-center gap-1">
                <span>Panduan & Alur Sistem</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Portal & Admin */}
        <div className="space-y-2">
          <span className="font-semibold text-white uppercase text-[11px] tracking-wider block mb-3">Akses Sistem</span>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('/portal')} className="hover:text-white transition">Client Portal Dashboard</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/portal/invoice')} className="hover:text-white transition">Faktur & Pembayaran Online</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/portal/support')} className="hover:text-white transition">Meja Bantuan Teknis & 2FA</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/admin')} className="hover:text-white text-amber-400 font-medium transition">Admin CMS & Analytics</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/admin/activity-log')} className="hover:text-white transition">Audit Trail Terpusat</button>
            </li>
          </ul>
        </div>

        {/* Col 4: Platform Telemetry & APK */}
        <div className="space-y-3">
          <span className="font-semibold text-white uppercase text-[11px] tracking-wider block mb-3">Teknologi & Integrasi</span>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Server className="w-3.5 h-3.5 text-sky-400" />
                Auto-Scaling Status
              </span>
              <span className="text-emerald-400 font-mono">ACTIVE (3 Pods)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                API v1 Endpoint
              </span>
              <span className="text-sky-400 font-mono">/api/v1/openapi</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                App Type
              </span>
              <span className="text-white font-mono">PWA / APK Hybrid</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Mendukung instalasi langsung pada Android, iOS, Windows, dan macOS tanpa app store.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>
          &copy; {new Date().getFullYear()} NEXA Digital Agency. All rights reserved. Sesuai PRD Sistem Operasional Agency & Client Portal.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Enkripsi End-to-End Aktif</span>
          <span>&bull;</span>
          <span className="text-slate-400">Stateless JWT + 2FA</span>
        </div>
      </div>
    </footer>
  );
};
