import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
  ChevronRight,
  Send
} from 'lucide-react';
import { getLeads, updateLeadStatus } from '../../lib/storage';
import { Lead } from '../../types';

export const AdminLeadsView: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (leadId: string, nextStatus: Lead['status']) => {
    updateLeadStatus(leadId, nextStatus);
    setLeads(getLeads());
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">CRM Pipeline & Sales Inbound</span>
          </div>
          <h2 className="text-xl font-bold text-white">Manajemen Leads & Pengajuan Estimasi</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar calon klien dari kalkulator estimasi dan jadwal konsultasi kalender.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, atau perusahaan..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedStatus === status
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid */}
      <div className="space-y-4">
        {filteredLeads.map(lead => (
          <div
            key={lead.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-white">{lead.name}</span>
                {lead.companyName && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {lead.companyName}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-semibold uppercase text-[10px]">
                  Sumber: {lead.source}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lead.email}</span>
                </span>
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lead.phone}</span>
                  </span>
                )}
                {lead.bookingDate && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Jadwal: {lead.bookingDate} ({lead.bookingTime})</span>
                  </span>
                )}
              </div>

              {lead.notes && (
                <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 italic text-[11px]">
                  "{lead.notes}"
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
              <div className="lg:text-right">
                <div className="text-slate-400 text-[11px]">Estimasi Nilai Deal:</div>
                <div className="text-lg font-black text-emerald-400">
                  Rp {lead.estimatedPrice.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-500">{lead.serviceName}</div>
              </div>

              {/* Status Action Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400">Ubah Tahap Pipeline:</span>
                <select
                  value={lead.status}
                  onChange={e => handleStatusChange(lead.id, e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Sudah Dihubungi</option>
                  <option value="Proposal Sent">Proposal Terkirim</option>
                  <option value="Won">Deal Closed (Won)</option>
                  <option value="Lost">Closed (Lost)</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
