import React, { useState } from 'react';
import {
  TrendingUp,
  ExternalLink,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getPortfolio } from '../../lib/storage';
import { PortfolioItem } from '../../types';

interface PortfolioPageProps {
  onNavigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const portfolio = getPortfolio();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  const categories = ['All', 'Web Application', 'Mobile & Fintech', 'Enterprise SaaS'];

  const filteredItems = selectedTag === 'All'
    ? portfolio
    : portfolio.filter(p => p.category.toLowerCase().includes(selectedTag.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Studi Kasus & Portofolio</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Karya Teruji dengan Dampak Bisnis Nyata
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Setiap produk yang kami bangun dinilai dari metrik nyata: kecepatan muat halaman, konversi transaksi, efisiensi operasional, dan kepuasan pengguna akhir.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedTag(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedTag === cat
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="group rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-sky-500/50 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-bold text-sky-400 uppercase">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">{item.metricLabel}</div>
                    <div className="text-xl font-black text-emerald-400">{item.resultMetric}</div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="text-xs text-sky-400 font-semibold mb-1">{item.client}</div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-sky-400 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
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

      {/* Case Study Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">{activeModalItem.category}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{activeModalItem.title}</h2>
              <span className="text-xs text-slate-400">Klien: {activeModalItem.client}</span>
            </div>

            <div className="h-56 rounded-2xl overflow-hidden bg-slate-950 mb-6">
              <img
                src={activeModalItem.imageUrl}
                alt={activeModalItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">{activeModalItem.metricLabel}</div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">{activeModalItem.resultMetric}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Status Keamanan</div>
                <div className="text-sm font-bold text-sky-400 mt-1">Lolos Audit 2FA & E2E</div>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-bold text-white text-sm">Deskripsi & Ruang Lingkup Proyek:</h4>
              <p>{activeModalItem.description}</p>
              {activeModalItem.testimonialQuote && (
                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 italic text-sky-200 text-xs">
                  "{activeModalItem.testimonialQuote}"
                  <div className="mt-1 font-semibold text-white not-italic">— {activeModalItem.testimonialAuthor}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  onNavigate('/estimasi');
                }}
                className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
              >
                <span>Mulai Proyek Serupa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
