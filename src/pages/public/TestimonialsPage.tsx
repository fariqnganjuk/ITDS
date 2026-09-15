import React from 'react';
import { Star, CheckCircle, ShieldCheck, Quote } from 'lucide-react';
import { getTestimonials } from '../../lib/storage';

interface TestimonialsPageProps {
  onNavigate: (path: string) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate }) => {
  const testimonials = getTestimonials();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Kepuasan Klien</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Pengalaman Klien Bekerja Bersama Kami
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Ulasan otentik dari para pimpinan teknologi, pendiri startup, dan direktur operasional yang mempercayakan transformasi digital kepada tim kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(item => (
          <div
            key={item.id}
            className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>Terverifikasi</span>
                </div>
              </div>

              <Quote className="w-8 h-8 text-slate-800 mb-2" />
              <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <img
                src={item.avatarUrl}
                alt={item.clientName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="text-xs font-bold text-white">{item.clientName}</div>
                <div className="text-[11px] text-slate-400">{item.clientRole}</div>
                <div className="text-[11px] text-sky-400 font-medium">{item.companyName}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white">Siap Menjadi Kisah Sukses Berikutnya?</h3>
        <p className="text-xs text-slate-400">
          Dapatkan blueprint arsitektur dan kalkulasi biaya terperinci tanpa komitmen awal.
        </p>
        <div>
          <button
            onClick={() => onNavigate('/estimasi')}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30"
          >
            Hitung Estimasi Proyek Anda
          </button>
        </div>
      </div>
    </div>
  );
};
