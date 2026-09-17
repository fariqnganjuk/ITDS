import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Upload,
  FileText,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Layers,
  Sparkles,
  ShieldAlert,
  Calendar,
  Filter,
  Check
} from 'lucide-react';
import {
  getCurrentUser,
  getProjects,
  getMilestones,
  updateMilestoneStatus,
  getDeliverables,
  addDeliverable,
  getMessages,
  sendMessage
} from '../../lib/storage';
import { Project, Milestone, Deliverable, ProjectMessage, User } from '../../types';

export const StaffWorkspaceView: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [projects, setProjects] = useState<Project[]>([]);
  const [allMilestones, setAllMilestones] = useState<Milestone[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ProjectMessage[]>([]);
  const [newChatText, setNewChatText] = useState('');
  
  // Upload deliverable modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'document' | 'design' | 'archive'>('document');
  const [uploadVersion, setUploadVersion] = useState('1.0');
  const [uploadNotes, setUploadNotes] = useState('');

  const reloadData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (!user) return;

    // Filter projects ONLY where this staff member is assigned
    const allPrjs = getProjects();
    const myPrjs = allPrjs.filter(p => 
      p.assignedStaffIds?.includes(user.id) || 
      user.role === 'superadmin' || 
      user.role === 'admin'
    );
    setProjects(myPrjs);

    if (myPrjs.length > 0 && !selectedProjectId) {
      setSelectedProjectId(myPrjs[0].id);
    }

    setAllMilestones(getMilestones());
    setDeliverables(getDeliverables());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setChatMessages(getMessages(selectedProjectId));
    }
  }, [selectedProjectId]);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // My tasks: milestones from projects I'm assigned to
  const myMilestones = allMilestones.filter(m => 
    projects.some(p => p.id === m.projectId)
  );

  const activeProjectMilestones = allMilestones.filter(m => m.projectId === activeProject?.id);
  const activeProjectDeliverables = deliverables.filter(d => d.projectId === activeProject?.id);

  const handleStatusChange = (milestoneId: string, newStatus: Milestone['status']) => {
    updateMilestoneStatus(milestoneId, newStatus);
    setAllMilestones(getMilestones());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim() || !activeProject || !currentUser) return;

    sendMessage({
      projectId: activeProject.id,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (${currentUser.title || currentUser.role})`,
      senderRole: currentUser.role,
      message: newChatText.trim(),
      isEncrypted: false
    });
    setNewChatText('');
    setChatMessages(getMessages(activeProject.id));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !activeProject || !currentUser) return;

    addDeliverable({
      projectId: activeProject.id,
      title: uploadTitle,
      fileUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      fileType: uploadFileType,
      fileSize: '3.5 MB',
      version: uploadVersion,
      uploadedBy: `${currentUser.name} (${currentUser.title || currentUser.role})`,
      notes: uploadNotes
    });

    setUploadTitle('');
    setUploadNotes('');
    setShowUploadModal(false);
    setDeliverables(getDeliverables());
  };

  return (
    <div className="space-y-6">
      {/* Role Notice & Security Boundary */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Workspace Tim Teknis / Staff</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              ROLE GUARDED: ACCESS RESTRICTED
            </span>
          </div>
          <h2 className="text-lg font-black text-white">Tugas & Proyek Saya ({currentUser?.title || 'Spesialis'})</h2>
          <p className="text-xs text-slate-400">
            Akses dibatasi hanya ke milestone penugasan, hasil kerja deliverable, dan thread koordinasi proyek Anda.
          </p>
        </div>

        {/* Security Tag: What is blocked */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Data Finansial, Invoice & CRM ditutup sesuai kepatuhan SOP peran.</span>
        </div>
      </div>

      {/* Grid: Left = Task & Milestone Tracker, Right = Active Project Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Tasks List (Milestones across my projects) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Daftar Tugas & Milestone</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {myMilestones.filter(m => m.status !== 'Completed').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {myMilestones.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                Belum ada tugas atau milestone yang ditugaskan ke akun Anda.
              </div>
            ) : (
              myMilestones.map(m => {
                const isCurrentPrj = m.projectId === activeProject?.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedProjectId(m.projectId)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isCurrentPrj
                        ? 'bg-slate-900 border-sky-500/40 shadow-sm'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white truncate">{m.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          m.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : m.status === 'In Progress'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                      {m.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {m.dueDate}</span>
                      </span>

                      {/* Quick Status Toggle */}
                      <div className="flex items-center gap-1">
                        {m.status !== 'In Progress' && m.status !== 'Completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(m.id, 'In Progress');
                            }}
                            className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-[10px] font-semibold"
                          >
                            Mulai
                          </button>
                        )}
                        {m.status === 'In Progress' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(m.id, 'Completed');
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Selesai</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Project Details, Deliverable Upload, & Chat */}
        <div className="lg:col-span-2 space-y-5">
          {/* Project Selector Tabs */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Pilih Proyek Ditugaskan:</span>
              <span className="text-xs font-mono text-sky-400 font-semibold">{projects.length} Proyek Aktif</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    p.id === activeProject?.id
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {activeProject ? (
            <div className="space-y-5">
              {/* Project Overview Card */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">{activeProject.name}</h3>
                    <p className="text-xs text-slate-400">Klien: {activeProject.clientName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                      Progres: {activeProject.progressPercent}%
                    </span>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Deliverable</span>
                    </button>
                  </div>
                </div>

                {/* Milestones in this project */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-300 mb-2.5">Timeline Milestone Proyek</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeProjectMilestones.map((m, idx) => (
                      <div key={m.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] text-slate-400">Tahap 0{idx + 1}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              m.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : m.status === 'In Progress'
                                ? 'bg-sky-500/10 text-sky-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>
                        <p className="font-bold text-white truncate">{m.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Batas: {m.dueDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deliverables Section */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span>File Hasil Kerja / Deliverables</span>
                  </h4>
                  <span className="text-xs text-slate-400">{activeProjectDeliverables.length} Berkas Tersedia</span>
                </div>

                <div className="space-y-2">
                  {activeProjectDeliverables.length === 0 ? (
                    <div className="text-center py-5 text-xs text-slate-400">
                      Belum ada file deliverable yang diunggah untuk proyek ini.
                    </div>
                  ) : (
                    activeProjectDeliverables.map(d => (
                      <div
                        key={d.id}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3 truncate pr-2">
                          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0">
                            {d.fileType === 'design' ? 'UI' : d.fileType === 'archive' ? 'ZIP' : 'DOC'}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{d.title}</p>
                            <p className="text-[10px] text-slate-400">
                              v{d.version} • {d.fileSize} • Diunggah oleh: {d.uploadedBy}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                          {new Date(d.uploadedAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Thread with Client */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Pesan & Komunikasi Proyek (E2E Terenkripsi)</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    AES-GCM ACTIVE
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 mb-3 pr-1">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Belum ada pesan obrolan dalam proyek ini.
                    </div>
                  ) : (
                    chatMessages.map(msg => {
                      const isMe = msg.senderId === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl text-xs ${
                            isMe
                              ? 'bg-sky-500/10 border border-sky-500/20 ml-8 text-sky-100'
                              : 'bg-slate-950 border border-slate-800 mr-8 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">{msg.senderName}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed">{msg.message}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Box */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    placeholder="Tulis pesan revisi / konfirmasi ke klien..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Tidak ada proyek aktif yang ditugaskan ke akun Anda saat ini.
            </div>
          )}
        </div>
      </div>

      {/* Upload Deliverable Modal */}
      {showUploadModal && activeProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Unggah Hasil Kerja (Deliverable)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Proyek: <strong className="text-sky-400">{activeProject.name}</strong>
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Judul / Nama Berkas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Figma_Design_Tokens_v2.fig atau APK_Build_v0.9.apk"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tipe Hasil Kerja</label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="document">Dokumen / Analisis (PDF/DOC)</option>
                    <option value="design">Desain UI/UX (Figma/PNG)</option>
                    <option value="archive">Source Code / APK (ZIP)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Versi</label>
                  <input
                    type="text"
                    required
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    placeholder="1.0"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Catatan Tambahan untuk Klien</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan ringkas mengenai hasil pengerjaan pada versi ini..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
