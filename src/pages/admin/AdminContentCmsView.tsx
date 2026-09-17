import React, { useState, useEffect } from 'react';
import {
  Layers,
  Image,
  BookOpen,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Star,
  Eye,
  Calendar,
  Save,
  CheckCircle2
} from 'lucide-react';
import {
  getServices,
  saveServices,
  getPortfolio,
  savePortfolio,
  getBlog,
  saveBlog,
  getTestimonials,
  saveTestimonials,
  logActivity
} from '../../lib/storage';
import { ServiceItem, PortfolioItem, BlogPost, TestimonialItem } from '../../types';

export const AdminContentCmsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'blog' | 'testimonials' | 'homepage'>('services');

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Hero Home content state
  const [heroSettings, setHeroSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_hero_cms');
      return saved ? JSON.parse(saved) : {
        badge: 'Enterprise Architecture & Cloud Scaling',
        headline: 'Membangun Ekosistem Digital Berdaya Saing Global',
        subtext: 'NEXA mentransformasi visi bisnis menjadi aplikasi web modern, native mobile, dan infrastruktur cloud dengan keandalan SLA 99.98% serta keamanan bersertifikasi.',
        bookingSlotMinutes: 45,
        bookingWorkingHours: '09:00 - 18:00 WIB'
      };
    } catch {
      return {
        badge: 'Enterprise Architecture & Cloud Scaling',
        headline: 'Membangun Ekosistem Digital Berdaya Saing Global',
        subtext: 'NEXA mentransformasi visi bisnis menjadi aplikasi web modern, native mobile, dan infrastruktur cloud dengan keandalan SLA 99.98% serta keamanan bersertifikasi.',
        bookingSlotMinutes: 45,
        bookingWorkingHours: '09:00 - 18:00 WIB'
      };
    }
  });

  const [successToast, setSuccessToast] = useState(false);

  const reloadData = () => {
    setServices(getServices());
    setPortfolio(getPortfolio());
    setBlogPosts(getBlog());
    setTestimonials(getTestimonials());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  const triggerToast = () => {
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  // Testimonial Approval Toggle
  const toggleTestimonialStatus = (id: string) => {
    const updated = testimonials.map(t => {
      if (t.id === id) {
        return { ...t, status: (t.status === 'published' ? 'pending' : 'published') as any };
      }
      return t;
    });
    saveTestimonials(updated);
    setTestimonials(updated);
    triggerToast();
  };

  // Service toggle active
  const toggleServiceActive = (id: string) => {
    const updated = services.map(s => {
      if (s.id === id) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    });
    saveServices(updated);
    setServices(updated);
    triggerToast();
  };

  // Portfolio toggle featured
  const togglePortfolioFeatured = (id: string) => {
    const updated = portfolio.map(p => {
      if (p.id === id) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    });
    savePortfolio(updated);
    setPortfolio(updated);
    triggerToast();
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nexa_hero_cms', JSON.stringify(heroSettings));
    window.dispatchEvent(new CustomEvent('nexa_storage_update', { detail: { key: 'hero_cms' } }));
    logActivity({
      action: 'HERO_CMS_UPDATED',
      entityType: 'system',
      entityId: 'cms_hero',
      meta: { headline: heroSettings.headline }
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">CMS Konten Publik</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              ROLE GUARDED: ADMIN & EDITOR
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Manajemen Konten Publik Situs NEXA</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Perbarui data layanan, studi kasus portfolio, artikel blog wawasan, moderasi testimoni klien, dan headline beranda.
          </p>
        </div>

        {successToast && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Konten Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      {/* Tabs Pill */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-bold">
        {[
          { id: 'services', label: 'Layanan Agensi', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'portfolio', label: 'Portfolio & Studi Kasus', icon: <Image className="w-3.5 h-3.5" /> },
          { id: 'blog', label: 'Artikel Blog', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'testimonials', label: 'Moderasi Testimoni', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'homepage', label: 'Pengaturan Beranda & Booking', icon: <Sparkles className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. SERVICES CMS */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Katalog Layanan Publik</h3>
            <span className="text-xs text-slate-400">{services.length} Layanan Aktif</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(s => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">{s.slug}</span>
                  <button
                    onClick={() => toggleServiceActive(s.id)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border transition ${
                      s.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {s.isActive ? 'Publik / Aktif' : 'Non-Aktif (Draft)'}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{s.shortDescription}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Harga Dasar: </span>
                    <span className="font-mono font-bold text-emerald-400">
                      Rp {s.basePrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Est: {s.estimatedDays} Hari Kerja
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PORTFOLIO CMS */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Studi Kasus & Hasil Terukur</h3>
            <span className="text-xs text-slate-400">{portfolio.length} Portfolio Ditampilkan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold uppercase">
                    {item.clientIndustry || 'Enterprise'}
                  </span>
                  <button
                    onClick={() => togglePortfolioFeatured(item.id)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      item.isFeatured
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.isFeatured ? '★ Unggulan' : 'Standar'}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                </div>

                {item.impactMetrics && item.impactMetrics.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                    <span className="text-slate-400 block text-[10px] mb-1">Hasil Terukur:</span>
                    <div className="flex gap-2">
                      {item.impactMetrics.map((m, idx) => (
                        <span key={idx} className="font-mono font-bold text-emerald-400 text-xs">
                          {m.metric}: {m.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BLOG CMS */}
      {activeTab === 'blog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Artikel & Wawasan Teknis</h3>
            <span className="text-xs text-slate-400">{blogPosts.length} Artikel</span>
          </div>

          <div className="space-y-3">
            {blogPosts.map(post => (
              <div key={post.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold uppercase">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {post.publishedAt} • {post.readTime}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{post.title}</h4>
                  <p className="text-slate-400 line-clamp-1">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TESTIMONIALS CMS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Moderasi Ulasan Klien</h3>
              <p className="text-xs text-slate-400">Setujui testimoni sebelum ditampilkan di halaman beranda publik.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(t => {
              const isPub = t.status === 'published';
              return (
                <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        isPub
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {isPub ? 'Tayang Publik' : 'Menunggu Approval'}
                    </span>
                  </div>

                  <p className="text-slate-300 italic">"{t.content}"</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{t.clientName}</p>
                      <p className="text-[10px] text-slate-400">{t.clientRole}, {t.clientCompany}</p>
                    </div>

                    <button
                      onClick={() => toggleTestimonialStatus(t.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                        isPub
                          ? 'bg-slate-800 text-slate-300 hover:text-rose-400'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isPub ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      <span>{isPub ? 'Sembunyikan' : 'Approve'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. HOMEPAGE & BOOKING SETTINGS */}
      {activeTab === 'homepage' && (
        <form onSubmit={handleSaveHero} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pengaturan Headline Beranda & Booking Slot Konsultasi</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Badge Tagline Atas</label>
              <input
                type="text"
                value={heroSettings.badge}
                onChange={(e) => setHeroSettings({ ...heroSettings, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Headline Utama (H1 Hero)</label>
              <input
                type="text"
                value={heroSettings.headline}
                onChange={(e) => setHeroSettings({ ...heroSettings, headline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Subteks Penjelasan Hero</label>
              <textarea
                rows={3}
                value={heroSettings.subtext}
                onChange={(e) => setHeroSettings({ ...heroSettings, subtext: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Durasi Slot Konsultasi (Menit)</label>
                <input
                  type="number"
                  value={heroSettings.bookingSlotMinutes}
                  onChange={(e) => setHeroSettings({ ...heroSettings, bookingSlotMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Jam Operasional Booking</label>
                <input
                  type="text"
                  value={heroSettings.bookingWorkingHours}
                  onChange={(e) => setHeroSettings({ ...heroSettings, bookingWorkingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Beranda</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
