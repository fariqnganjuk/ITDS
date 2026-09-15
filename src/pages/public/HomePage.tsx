import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Calculator,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Smartphone,
  Globe,
  Star,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { DICTIONARY } from '../../lib/i18n';
import { getServices, getPortfolio, getTestimonials } from '../../lib/storage';

interface HomePageProps {
  onNavigate: (path: string) => void;
  currentLang: LanguageCode;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, currentLang }) => {
  const t = DICTIONARY[currentLang];
  const services = getServices();
  const portfolio = getPortfolio();
  const testimonials = getTestimonials();

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.hero.tagline}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            {t.hero.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              {t.hero.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('/estimasi')}
              id="hero-cta-estimator"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-600/30 transition-all active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Calculator className="w-4 h-4" />
              <span>{t.hero.calculateEstimate}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/portfolio')}
              id="hero-cta-portfolio"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <span>{t.hero.explorePortfolio}</span>
            </button>
          </div>

          {/* Trust Statement */}
          <div className="pt-8 text-xs text-slate-400 font-medium">
            {t.hero.trustedBy}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">50+</div>
            <div className="text-xs text-slate-400 mt-1">{t.stats.activeProjects}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">99.4%</div>
            <div className="text-xs text-slate-400 mt-1">{t.stats.satisfaction}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">+240%</div>
            <div className="text-xs text-slate-400 mt-1">{t.stats.conversionUplift}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">99.9%</div>
            <div className="text-xs text-slate-400 mt-1">{t.stats.slaUptime}</div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 ARCHITECTURAL PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Diferensiasi Platform</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Bukan Sekadar Landing Page Statis — Sistem Terintegrasi Penuh
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Platform operasional digital agency lengkap yang mempercepat closing, mengurangi friksi administrasi, dan mengamankan aset klien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Rule-Based Estimator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formula kalkulasi harga dinamis diatur langsung dari admin CMS. Transparan, akurat, dan langsung menghasilkan lead siap deal.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Client Portal & Milestones</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pantau progres proyek real-time, unduh deliverable, approval kontrak via e-signature, dan obrolan proyek terenkripsi.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Enkripsi E2E & 2FA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Web Crypto AES-GCM 256-bit dan autentikasi TOTP berlapis untuk melindungi kerahasiaan data proyek, invoice, dan kontrak.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Audit Trail Terpusat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit log dengan verifikasi rantai hash kriptografi SHA-256 untuk memantau integritas setiap aksi penting di platform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Layanan Unggulan</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Solusi Digital Berbasis Kinerja</h2>
          </div>
          <button
            onClick={() => onNavigate('/layanan')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>Semua Layanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.slice(0, 4).map(s => (
            <div
              key={s.id}
              className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    {s.iconName === 'Globe' ? <Globe className="w-5 h-5" /> :
                     s.iconName === 'Smartphone' ? <Smartphone className="w-5 h-5" /> :
                     s.iconName === 'Layout' ? <Layers className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                    Estimasi {s.estimatedWeeks} Minggu
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{s.shortDesc}</p>
                <div className="space-y-1.5 mb-6">
                  {s.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Mulai dari</span>
                  <span className="text-sm font-bold text-white">Rp {s.basePrice.toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={() => onNavigate('/estimasi')}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Kalkulasi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CASE STUDIES & RESULTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Studi Kasus</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Hasil Terukur untuk Klien Nyata</h2>
          </div>
          <button
            onClick={() => onNavigate('/portfolio')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>Lihat Semua Kasus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {portfolio.map(item => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-bold text-sky-400 uppercase">
                  {item.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">{item.metricLabel}</div>
                      <div className="text-lg font-black text-emerald-400">{item.resultMetric}</div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE ESTIMATOR TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-sky-900/40 via-blue-900/30 to-indigo-950/40 border border-sky-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
              {t.estimator.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Ingin Tahu Berapa Biaya Proyek Digital Anda?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Gunakan kalkulator berbasis aturan kami. Pilih fitur yang dibutuhkan, dan dapatkan angka estimasi transparan beserta estimasi waktu pengerjaan dalam 60 detik.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/estimasi')}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition active:scale-95 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Buka Kalkulator Estimasi</span>
              </button>
              <button
                onClick={() => onNavigate('/kontak')}
                className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwalkan Konsultasi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Testimoni Klien</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Dipercaya Para Pemimpin Bisnis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(item => (
            <div key={item.id} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                <img
                  src={item.avatarUrl}
                  alt={item.clientName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">{item.clientName}</div>
                  <div className="text-[11px] text-slate-400">{item.clientRole}, {item.companyName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
