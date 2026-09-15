import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  KeyRound,
  AlertCircle,
  QrCode,
  Copy,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import {
  getSupportTickets,
  addSupportTicket,
  addTicketMessage,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  setUsers,
  logActivity
} from '../../lib/storage';
import { SupportTicket } from '../../types';
import { generateTotpSecret, verify2FaCode } from '../../lib/crypto';

export const ClientSupportView: React.FC = () => {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [tickets, setTickets] = useState<SupportTicket[]>(getSupportTickets());
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New Ticket Form State
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Security' | 'Bug' | 'Feature' | 'Billing' | 'General'>('Security');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [newDescription, setNewDescription] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');

  // 2FA Management State
  const [is2FaEnabled, setIs2FaEnabled] = useState(currentUser?.twoFaEnabled || false);
  const [tempSecret, setTempSecret] = useState(currentUser?.twoFaSecret || '');
  const [testCode, setTestCode] = useState('');
  const [twoFaMessage, setTwoFaMessage] = useState<string | null>(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setTickets(getSupportTickets());
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    const created = addSupportTicket({
      clientId: currentUser?.id || 'usr_client_01',
      clientName: currentUser?.name || 'Klien',
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      status: 'Open',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: currentUser?.id || 'usr_client_01',
          senderName: currentUser?.name || 'Klien',
          senderRole: currentUser?.role || 'client',
          message: newDescription,
          createdAt: new Date().toISOString()
        }
      ]
    });

    setTickets(getSupportTickets());
    setIsCreatingTicket(false);
    setNewTitle('');
    setNewDescription('');
    setSelectedTicket(created);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    addTicketMessage(selectedTicket.id, {
      senderId: currentUser?.id || 'usr_client_01',
      senderName: currentUser?.name || 'Klien',
      senderRole: currentUser?.role || 'client',
      message: replyText.trim()
    });

    setReplyText('');
    const updated = getSupportTickets().find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
    setTickets(getSupportTickets());
  };

  const handleGenerateNewSecret = () => {
    const s = generateTotpSecret();
    setTempSecret(s);
    setTwoFaMessage('Kunci rahasia baru dibuat. Masukkan kode 123456 untuk mengonfirmasi aktivasi.');
    setIsSuccessMessage(false);
  };

  const handleToggle2FA = () => {
    if (!currentUser) return;

    if (is2FaEnabled) {
      // Disable 2FA
      const updatedUser = { ...currentUser, twoFaEnabled: false };
      setCurrentUser(updatedUser);
      const allUsers = getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsers(allUsers);
      setIs2FaEnabled(false);
      logActivity({
        action: '2FA_STATUS_CHANGE',
        entityType: 'auth',
        entityId: currentUser.id,
        meta: { enabled: false }
      });
      setTwoFaMessage('Autentikasi Dua Faktor berhasil dinonaktifkan.');
      setIsSuccessMessage(true);
    } else {
      // Check test code
      const isValid = verify2FaCode(testCode, tempSecret);
      if (isValid) {
        const updatedUser = { ...currentUser, twoFaEnabled: true, twoFaSecret: tempSecret };
        setCurrentUser(updatedUser);
        const allUsers = getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(allUsers);
        setIs2FaEnabled(true);
        setTestCode('');
        logActivity({
          action: '2FA_STATUS_CHANGE',
          entityType: 'auth',
          entityId: currentUser.id,
          meta: { enabled: true }
        });
        setTwoFaMessage('Two-Factor Authentication (2FA) berhasil diaktifkan dengan perlindungan TOTP!');
        setIsSuccessMessage(true);
      } else {
        setTwoFaMessage('Kode verifikasi salah. Gunakan kode dari Authenticator atau coba kode demo: 123456');
        setIsSuccessMessage(false);
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. SECTION: TWO-FACTOR AUTHENTICATION SECURITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keamanan Akun & Two-Factor Authentication (2FA)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Lindungi sesi masuk Anda dengan standar TOTP RFC 6238 (Google Authenticator, Authy, Apple Keychain).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status Proteksi:</span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                is2FaEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {is2FaEnabled ? '2FA AKTIF' : '2FA NON-AKTIF'}
            </span>
          </div>
        </div>

        {twoFaMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              isSuccessMessage
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950/40 text-amber-300 border border-amber-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{twoFaMessage}</span>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <div className="font-semibold text-white">Kunci Rahasia Base32:</div>
            <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-sky-400 flex items-center justify-between">
              <span>{tempSecret || 'NEXASECUREKEY2026'}</span>
              <button
                type="button"
                onClick={handleGenerateNewSecret}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Reset Kunci
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pindai atau masukkan kunci ini ke aplikasi Authenticator ponsel Anda untuk mendapatkan 6 digit kode token dinamis.
            </p>
          </div>

          <div className="space-y-3">
            <label className="font-semibold text-white block">
              {is2FaEnabled ? 'Pengaturan Proteksi' : 'Uji Validasi Kode untuk Aktivasi:'}
            </label>

            {!is2FaEnabled && (
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={testCode}
                  onChange={e => setTestCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Kode 6-Digit (uji: 123456)"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-sm outline-none"
                />
              </div>
            )}

            <button
              onClick={handleToggle2FA}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                is2FaEnabled
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {is2FaEnabled ? 'Non-aktifkan 2FA Akun Ini' : 'Validasi & Aktifkan 2FA Sekarang'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION: TECHNICAL SUPPORT TICKETS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-sky-400" />
              <span>Meja Bantuan Teknis (Technical Support Desk)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Laporkan kendala teknis atau kebutuhan asistensi infrastruktur dengan jaminan respon SLA &lt; 2 jam.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingTicket(!isCreatingTicket)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingTicket ? 'Tutup Formulir' : 'Buka Tiket Baru'}</span>
          </button>
        </div>

        {/* Create Ticket Modal / Form */}
        {isCreatingTicket && (
          <form onSubmit={handleCreateTicket} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs animate-in fade-in">
            <h3 className="font-bold text-white text-sm">Formulir Tiket Dukungan Baru</h3>

            <div>
              <label className="text-slate-300 block mb-1">Judul / Gejala Kendala *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Contoh: Permintaan rotasi API Key & optimasi query database"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1">Kategori Masalah</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none"
                >
                  <option value="Security">Security & Access</option>
                  <option value="Bug">Bug / Error Teknis</option>
                  <option value="Feature">Feature Request</option>
                  <option value="Billing">Billing & Invoice</option>
                  <option value="General">General Inquiries</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Tingkat Urgensi</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none"
                >
                  <option value="Low">Low (Standar)</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Prioritas)</option>
                  <option value="Urgent">Urgent (Sistem Terganggu)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Deskripsi Rinci Kendala *</label>
              <textarea
                rows={3}
                required
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Berikan detail langkah reproduksi, tangkapan layar atau pesan error yang muncul..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
            >
              Kirimkan Tiket ke Tim Engineering
            </button>
          </form>
        )}

        {/* Tickets Grid & Thread Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket list */}
          <div className="lg:col-span-5 space-y-3">
            {tickets.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-xs space-y-2 ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500 text-white shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sky-400 font-bold">#{ticket.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ticket.status === 'Open'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : ticket.status === 'In Progress'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-white leading-snug">{ticket.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Urgensi: <strong className={ticket.priority === 'Urgent' ? 'text-rose-400' : 'text-slate-300'}>{ticket.priority}</strong></span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Thread Box */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col h-[480px] shadow-xl">
                <div className="pb-4 border-b border-slate-800 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase">
                      Tiket #{selectedTicket.id} &bull; {selectedTicket.category}
                    </span>
                    <h3 className="text-sm font-bold text-white">{selectedTicket.title}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Respon SLA Aktif
                  </span>
                </div>

                {/* Conversation Stream */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                  {selectedTicket.messages.map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border ${
                        m.senderRole === 'staff' || m.senderRole === 'admin'
                          ? 'bg-sky-950/30 border-sky-800/60'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-white">{m.senderName} ({m.senderRole.toUpperCase()})</span>
                        <span className="text-slate-400">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Balas tiket dukungan ini..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs disabled:opacity-50 transition"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 rounded-3xl bg-slate-900 border border-slate-800 text-xs flex flex-col items-center justify-center h-full">
                <LifeBuoy className="w-10 h-10 text-slate-700 mb-2" />
                <span>Pilih salah satu tiket di sebelah kiri untuk melihat percakapan teknis.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
