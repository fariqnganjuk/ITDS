import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  User,
  ShieldCheck,
  FileCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { getProjects, getCurrentUser, getMilestones, getDeliverables } from '../../lib/storage';
import { Project, Milestone, Deliverable } from '../../types';

export const ClientProjectsView: React.FC = () => {
  const user = getCurrentUser();
  const projects = getProjects();
  // Filter for client projects or fallback to first
  const activeProjects = projects.filter(p => user?.role === 'client' ? p.clientId === user.id : true);
  const currentProject = activeProjects[0] || projects[0];

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        Tidak ada proyek aktif yang ditemukan untuk akun Anda.
      </div>
    );
  }

  const milestones: Milestone[] = getMilestones(currentProject.id);
  const deliverables: Deliverable[] = getDeliverables(currentProject.id);

  const handleDownload = (filename: string) => {
    setDownloadNotice(`Mengunduh berkas terenkripsi: ${filename}`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-8">
      {downloadNotice && (
        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>{downloadNotice}</span>
          </div>
          <span className="text-[10px] text-sky-400 font-mono">AES-256 Checked</span>
        </div>
      )}

      {/* Main Project Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Enterprise SAAS SLA</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {currentProject.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{currentProject.name}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">{currentProject.description}</p>
          </div>

          <div className="text-right sm:min-w-[160px] p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Total Progres</div>
            <div className="text-3xl font-black text-emerald-400 mt-0.5">{currentProject.progressPercent}%</div>
            <div className="text-[10px] text-slate-400 mt-1">SLA 99.9% Uptime</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${currentProject.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Mulai: {new Date(currentProject.startDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
            <span>Target Rilis: {new Date(currentProject.endDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
          </div>
        </div>

        {/* Assigned Team & Budget */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Staff PIC:</span>
            <span className="font-semibold text-slate-200">
              {currentProject.assignedStaffIds?.join(', ') || 'Lead Architect & DevOps'}
            </span>
          </div>

          <div className="text-slate-400">
            Anggaran Terkontrak: <span className="font-mono font-bold text-emerald-400">Rp {currentProject.budget.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Milestones & Deliverables Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <span>Milestones & Timeline Pengerjaan Proyek</span>
        </h3>

        <div className="space-y-4">
          {milestones.map((m, idx) => {
            const isCompleted = m.status === 'Completed';
            const isInProgress = m.status === 'In Progress';

            return (
              <div
                key={m.id}
                className={`p-6 rounded-2xl border transition ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800/80'
                    : isInProgress
                    ? 'bg-sky-950/20 border-sky-500/50 shadow-lg shadow-sky-500/5'
                    : 'bg-slate-950/40 border-slate-800/50 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isInProgress
                          ? 'bg-sky-500/20 text-sky-400 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      <p className="text-xs text-slate-400">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">Target: {new Date(m.dueDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isInProgress
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>

                {/* Deliverables for this project */}
                {deliverables.length > 0 && idx === 0 && (
                  <div className="pt-3 border-t border-slate-800/60 mt-3">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">Berkas Deliverables Tersedia:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {deliverables.map((del, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span className="text-slate-200 truncate">{del.title}</span>
                          </div>
                          <button
                            onClick={() => handleDownload(del.title)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] shrink-0"
                          >
                            <Download className="w-3 h-3" />
                            <span>Unduh ({del.fileSize})</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
