import React, { useState } from 'react';
import {
  LifeBuoy,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getSupportTickets, addTicketMessage, updateTicketStatus, getCurrentUser } from '../../lib/storage';
import { SupportTicket } from '../../types';

export const AdminSupportDeskView: React.FC = () => {
  const currentUser = getCurrentUser();
  const [tickets, setTickets] = useState<SupportTicket[]>(getSupportTickets());
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTickets = tickets.filter(t => statusFilter === 'ALL' || t.status === statusFilter);

  const handleSendStaffReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    addTicketMessage(selectedTicket.id, {
      senderId: currentUser?.id || 'usr_staff_01',
      senderName: `${currentUser?.name || 'Staff Engineering'} (Technical Support)`,
      senderRole: currentUser?.role || 'staff',
      message: replyText.trim()
    });

    setReplyText('');
    const updated = getSupportTickets();
    setTickets(updated);
    const curr = updated.find(t => t.id === selectedTicket.id);
    if (curr) setSelectedTicket(curr);
  };

  const handleResolveTicket = (ticketId: string) => {
    updateTicketStatus(ticketId, 'Resolved');
    const updated = getSupportTickets();
    setTickets(updated);
    const curr = updated.find(t => t.id === ticketId);
    if (curr) setSelectedTicket(curr);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Engineering Support Ops</span>
          </div>
          <h2 className="text-xl font-bold text-white">Pusat Kendali Tiket Bantuan Teknis</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistem pendukung teknis responsif 24/7 dengan SLA penanganan insiden otomatis.
          </p>
        </div>

        <div className="flex gap-2">
          {['ALL', 'Open', 'In Progress', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTickets.map(ticket => {
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
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Klien: <strong className="text-slate-200">{ticket.clientName}</strong></span>
                  <span className={ticket.priority === 'Urgent' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket Detail & Thread */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col h-[520px] shadow-xl">
              <div className="pb-4 border-b border-slate-800 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-sky-400 uppercase">
                    Klien: {selectedTicket.clientName} &bull; {selectedTicket.category}
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedTicket.title}</h3>
                </div>

                {selectedTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tandai Selesai (Resolve)</span>
                  </button>
                )}
              </div>

              {/* Messages stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                {selectedTicket.messages.map(m => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border ${
                      m.senderRole === 'staff' || m.senderRole === 'admin'
                        ? 'bg-sky-950/40 border-sky-800/80 ml-4'
                        : 'bg-slate-950 border-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-white">{m.senderName}</span>
                      <span className="text-slate-400">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <form onSubmit={handleSendStaffReply} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Ketik instruksi solusi teknis untuk klien..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs disabled:opacity-50 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Solusi</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 rounded-3xl bg-slate-900 border border-slate-800 text-xs">
              Pilih tiket untuk membalas respon teknis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
