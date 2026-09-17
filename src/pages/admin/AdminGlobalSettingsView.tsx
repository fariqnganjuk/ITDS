import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  CreditCard,
  Sliders,
  ShieldCheck,
  Check,
  Building,
  Mail,
  Phone,
  Share2,
  Lock,
  Save,
  AlertCircle
} from 'lucide-react';
import { logActivity } from '../../lib/storage';

interface GlobalAgencySettings {
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  socials: {
    instagram: string;
    linkedin: string;
    github: string;
  };
  footerText: string;
  // Payment methods
  enableStripe: boolean;
  enableBillplz: boolean;
  enableManualTransfer: boolean;
  bankAccounts: {
    bank: string;
    accountNumber: string;
    holderName: string;
  }[];
  // Nav links toggles
  navToggles: {
    services: boolean;
    portfolio: boolean;
    estimator: boolean;
    blog: boolean;
    testimonials: boolean;
    contact: boolean;
  };
  // Languages
  languages: {
    id: boolean;
    en: boolean;
    my: boolean;
  };
}

const DEFAULT_SETTINGS: GlobalAgencySettings = {
  brandName: 'NEXA Digital Agency',
  tagline: 'High-Impact Digital Systems, Scalable Web & Native Mobile Solutions',
  contactEmail: 'contact@nexa.agency',
  contactPhone: '+62 812-3456-7890',
  officeAddress: 'Cyber Tower Lt. 18, Mega Kuningan, Jakarta Selatan',
  socials: {
    instagram: 'https://instagram.com/nexa.agency',
    linkedin: 'https://linkedin.com/company/nexa-agency',
    github: 'https://github.com/nexa-agency'
  },
  footerText: '© 2026 NEXA Digital Agency. Seluruh Hak Cipta Dilindungi. Kepatuhan Standar Industri.',
  enableStripe: true,
  enableBillplz: true,
  enableManualTransfer: true,
  bankAccounts: [
    { bank: 'BCA', accountNumber: '800-192-8821', holderName: 'PT NEXA INOVASI TEKNOLOGI' },
    { bank: 'Mandiri', accountNumber: '137-00-198273-1', holderName: 'PT NEXA INOVASI TEKNOLOGI' }
  ],
  navToggles: {
    services: true,
    portfolio: true,
    estimator: true,
    blog: true,
    testimonials: true,
    contact: true
  },
  languages: {
    id: true,
    en: true,
    my: true
  }
};

export const AdminGlobalSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<GlobalAgencySettings>(() => {
    try {
      const saved = localStorage.getItem('nexa_global_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nexa_global_settings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('nexa_storage_update', { detail: { key: 'global_settings' } }));

    logActivity({
      action: 'GLOBAL_SETTINGS_UPDATED',
      entityType: 'system',
      entityId: 'settings_global',
      meta: {
        brandName: settings.brandName,
        paymentMethods: {
          stripe: settings.enableStripe,
          billplz: settings.enableBillplz,
          manual: settings.enableManualTransfer
        }
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Super Admin Exclusive</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              LEVEL 4 GOVERNANCE
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Pengaturan Global Agency & Sistem</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kontrol nama brand, visibilitas menu navigasi publik, gateway pembayaran (Stripe/Billplz/Transfer), dan lokalisasi bahasa.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-pulse">
            <Check className="w-4 h-4" />
            <span>Perubahan Tersimpan & Tercatat di Audit Log</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identitas Brand & Info Kontak */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-sky-400" />
            <span>Identitas Agency & Kontak Resmi</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nama Brand Agency</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tagline Bisnis</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Resmi (Inbound Leads & Notifikasi)</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nomor WhatsApp / Hotline</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Alamat Kantor Operasional</label>
              <input
                type="text"
                value={settings.officeAddress}
                onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Teks Footer & Hak Cipta</label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pengaturan Metode Pembayaran */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Pengaturan Metode Pembayaran Invoice (Gateways & Transfer Bank)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Stripe Gateway (Internasional)</span>
                <input
                  type="checkbox"
                  checked={settings.enableStripe}
                  onChange={(e) => setSettings({ ...settings, enableStripe: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Menerima kartu kredit/debit Visa, Mastercard, dan pembayaran mata uang USD/SGD.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Billplz / FPX Gateway</span>
                <input
                  type="checkbox"
                  checked={settings.enableBillplz}
                  onChange={(e) => setSettings({ ...settings, enableBillplz: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Menerima pembayaran instan via online banking FPX (Malaysia Ringgit MYR).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Transfer Bank Manual</span>
                <input
                  type="checkbox"
                  checked={settings.enableManualTransfer}
                  onChange={(e) => setSettings({ ...settings, enableManualTransfer: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Klien mengunggah bukti transfer, admin wajib mereview dan approve di sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Pengaturan Navigasi Header & Bahasa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nav Links Visibility */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Visibilitas Menu Navigasi Publik</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { key: 'services', label: 'Layanan (/layanan)' },
                { key: 'portfolio', label: 'Portfolio (/portfolio)' },
                { key: 'estimator', label: 'Kalkulator Estimasi (/estimasi)' },
                { key: 'blog', label: 'Blog & Wawasan (/blog)' },
                { key: 'testimonials', label: 'Testimoni (/testimoni)' },
                { key: 'contact', label: 'Kontak Kami (/kontak)' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(settings.navToggles as any)[item.key]}
                    onChange={(e) => setSettings({
                      ...settings,
                      navToggles: { ...settings.navToggles, [item.key]: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Languages Control */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Pilihan Bahasa Sistem (I18n)</span>
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { key: 'id', name: 'Bahasa Indonesia (ID)', desc: 'Bahasa baku nasional operasional' },
                { key: 'en', name: 'English (EN)', desc: 'International enterprise standard' },
                { key: 'my', name: 'Bahasa Melayu (MY)', desc: 'Pilihan pasaran rantau ASEAN' }
              ].map(item => (
                <div key={item.key} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(settings.languages as any)[item.key]}
                    onChange={(e) => setSettings({
                      ...settings,
                      languages: { ...settings.languages, [item.key]: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan Global</span>
          </button>
        </div>
      </form>
    </div>
  );
};
