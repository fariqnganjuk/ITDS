import React, { useState } from 'react';
import { BookOpen, Clock, Tag, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { getBlogPosts } from '../../lib/storage';
import { BlogPost } from '../../types';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const posts = getBlogPosts();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Artikel & Riset Rekayasa</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Wawasan Teknologi, Keamanan Siber & Pertumbuhan Bisnis
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Kumpulan artikel mendalam seputar arsitektur modern, implementasi enkripsi end-to-end, dan strategi digital agency kelas dunia.
        </p>
      </div>

      {activePost ? (
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
          <button
            onClick={() => setActivePost(null)}
            className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold"
          >
            &larr; Kembali ke daftar artikel
          </button>

          <div className="space-y-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 font-semibold uppercase">
              {activePost.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{activePost.title}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-b border-slate-800 pb-4">
              <span>Penulis: <strong className="text-white">{activePost.author}</strong></span>
              <span>&bull;</span>
              <span>{new Date(activePost.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
              <span>&bull;</span>
              <span>{activePost.readTimeMinutes} menit baca</span>
            </div>
          </div>

          <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
            {activePost.content}
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-2">
            {activePost.tags.map(t => (
              <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300">
                #{t}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(p => (
            <div
              key={p.id}
              onClick={() => setActivePost(p)}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 font-semibold uppercase">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{p.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-sky-400 transition">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {p.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{p.author}</span>
                <span className="text-sky-400 font-semibold flex items-center gap-1">
                  Baca <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
