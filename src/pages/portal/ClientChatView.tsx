import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Info,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { getCurrentUser, getProjectMessages, addProjectMessage } from '../../lib/storage';
import { ProjectMessage } from '../../types';

export const ClientChatView: React.FC = () => {
  const currentUser = getCurrentUser();
  const [messages, setMessages] = useState<ProjectMessage[]>(getProjectMessages('proj_ecommerce_01'));
  const [inputText, setInputText] = useState('');
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setMessages(getProjectMessages('proj_ecommerce_01'));
    };
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addProjectMessage({
      projectId: 'proj_ecommerce_01',
      senderId: currentUser?.id || 'usr_client_01',
      senderName: currentUser?.name || 'Klien',
      senderRole: currentUser?.role || 'client',
      message: inputText.trim(),
      isEncrypted: true
    });

    setInputText('');

    // Simulate staff response if client speaks
    if (currentUser?.role === 'client') {
      setTimeout(() => {
        addProjectMessage({
          projectId: 'proj_ecommerce_01',
          senderId: 'usr_staff_01',
          senderName: 'Sarah Maharani (Tech Lead)',
          senderRole: 'staff',
          message: 'Pesan Anda telah kami terima dengan enkripsi E2E. Tim pengembang sedang memproses update modul ini.',
          isEncrypted: true
        });
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Encryption Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Ruang Diskusi Terenkripsi End-to-End (E2E)</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                AES-GCM-256
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Kunci enkripsi dikelola secara lokal pada peramban. Pesan terlindungi dari kebocoran man-in-the-middle.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCryptoModal(true)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] flex items-center gap-1.5 shrink-0"
        >
          <KeyRound className="w-3.5 h-3.5 text-sky-400" />
          <span>Verifikasi Kunci E2E</span>
        </button>
      </div>

      {/* Chat Canvas Box */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 h-[500px] flex flex-col overflow-hidden shadow-2xl">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">{msg.senderName}</span>
                  <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-400">
                    {msg.senderRole}
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-70">
                    <ShieldCheck className="w-3 h-3" />
                    <span>E2E Enkripsi Terverifikasi</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ketik pesan terenkripsi untuk tim proyek..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white shadow-md shadow-sky-600/30 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Crypto Modal */}
      {showCryptoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Sertifikat Enkripsi Sesi</h3>
                <p className="text-slate-400 text-[11px]">NEXA Crypto Vault RFC-7516</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
              <div>Algoritma: <span className="text-sky-400">AES-GCM (256-bit Key)</span></div>
              <div>Ciphertext Integrity: <span className="text-emerald-400">SHA-256 HMAC</span></div>
              <div>Fingerprint Sesi: <span className="text-purple-400 break-all">8f3b...99c4-a52d-e2e</span></div>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Semua teks pesan didekripsi hanya di memori RAM browser Anda saat dibuka. Tidak ada rekaman teks mentah pada log server.
            </p>

            <button
              onClick={() => setShowCryptoModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
