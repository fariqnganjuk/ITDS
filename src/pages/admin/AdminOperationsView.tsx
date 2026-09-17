import React, { useState, useEffect } from 'react';
import {
  FileText,
  CreditCard,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  UserCheck
} from 'lucide-react';
import {
  getInvoices,
  createInvoice,
  updateInvoiceStatus,
  getPaymentProofs,
  reviewPaymentProof,
  getContracts,
  getProjects,
  updateProject,
  getUsers,
  getCurrentUser,
  logActivity
} from '../../lib/storage';
import { Invoice, PaymentProof, Contract, Project, User } from '../../types';

export const AdminOperationsView: React.FC = () => {
  const currentUser = getCurrentUser();
  const [subTab, setSubTab] = useState<'invoices' | 'contracts' | 'projects'>('invoices');
  
  // Data states
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  // Create Invoice Modal State
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [newInvProjectId, setNewInvProjectId] = useState('');
  const [newInvTerm, setNewInvTerm] = useState('Termin 2 (Progress 50%)');
  const [newInvAmount, setNewInvAmount] = useState(15000000);
  const [newInvDueDate, setNewInvDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Review Proof Modal State
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const reloadData = () => {
    setInvoices(getInvoices());
    setPaymentProofs(getPaymentProofs());
    setContracts(getContracts());
    setProjects(getProjects());
    setStaffUsers(getUsers().filter(u => u.role === 'staff' || u.role === 'admin' || u.role === 'superadmin'));
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === newInvProjectId);
    if (!proj) return;

    createInvoice({
      projectId: proj.id,
      projectName: proj.name,
      clientId: proj.clientId,
      clientName: proj.clientName,
      amount: Number(newInvAmount),
      currency: proj.currency || 'IDR',
      dueDate: newInvDueDate,
      items: [
        {
          description: `${newInvTerm} - ${proj.name}`,
          quantity: 1,
          unitPrice: Number(newInvAmount),
          total: Number(newInvAmount)
        }
      ]
    });

    setShowCreateInvoice(false);
    reloadData();
  };

  const handleApproveProof = (proofId: string) => {
    reviewPaymentProof(proofId, 'Approved', currentUser?.name || 'Admin', reviewNotes || 'Transfer valid dan dana terverifikasi.');
    setSelectedProof(null);
    setReviewNotes('');
    reloadData();
  };

  const handleRejectProof = (proofId: string) => {
    reviewPaymentProof(proofId, 'Rejected', currentUser?.name || 'Admin', reviewNotes || 'Nominal atau nomor referensi tidak cocok.');
    setSelectedProof(null);
    setReviewNotes('');
    reloadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Operasional Finansial & Proyek</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              ROLE GUARDED: ADMIN ONLY
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Manajemen Invoice, Kontrak SOW & Proyek</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola termin tagihan, review bukti transfer bank, pantau tanda tangan kontrak digital, dan penugasan staf.
          </p>
        </div>

        {/* Subtab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setSubTab('invoices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'invoices' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Invoices & Transfer</span>
          </button>
          <button
            onClick={() => setSubTab('contracts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'contracts' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Kontrak SOW</span>
          </button>
          <button
            onClick={() => setSubTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'projects' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Daftar Proyek</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: INVOICES & MANUAL TRANSFER REVIEWS */}
      {subTab === 'invoices' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Daftar Tagihan & Status Pembayaran</h3>
              <p className="text-xs text-slate-400">Total {invoices.length} invoice tercatat di sistem.</p>
            </div>
            <button
              onClick={() => {
                if (projects.length > 0) setNewInvProjectId(projects[0].id);
                setShowCreateInvoice(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Invoice Baru</span>
            </button>
          </div>

          {/* Pending Proofs Alert Box (If any) */}
          {paymentProofs.some(p => p.status === 'Pending Review') && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Ada Bukti Pembayaran Manual Menunggu Verifikasi Admin!</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentProofs
                  .filter(p => p.status === 'Pending Review')
                  .map(proof => (
                    <div
                      key={proof.id}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{proof.clientName}</p>
                        <p className="text-[11px] text-slate-400">
                          Invoice #{proof.invoiceNumber} • Bank {proof.bankName} • Rp {proof.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedProof(proof)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Periksa</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Invoices Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">No. Invoice</th>
                    <th className="px-4 py-3">Klien & Proyek</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Jatuh Tempo</th>
                    <th className="px-4 py-3">Metode</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3.5 font-mono font-bold text-sky-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white">{inv.clientName}</div>
                        <div className="text-[11px] text-slate-400">{inv.projectName}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-semibold text-white">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {inv.dueDate}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {inv.paymentMethod || 'Menunggu'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : inv.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {inv.status === 'Paid' ? 'Lunas' : inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {inv.status !== 'Paid' ? (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-semibold transition"
                          >
                            Tandai Lunas
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                            <Check className="w-3 h-3" />
                            <span>Terverifikasi</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CONTRACTS & DIGITAL SOW */}
      {subTab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Perjanjian Kerja Sama & Kontrak SOW</h3>
              <p className="text-xs text-slate-400">Dokumen legal digital dengan stempel kriptografis SHA-256 anti-tamper.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map(ctr => (
              <div key={ctr.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-sky-400 font-bold">{ctr.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      ctr.status === 'Signed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {ctr.status === 'Signed' ? 'Ditandatangani Digital' : ctr.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{ctr.title}</h4>
                  <p className="text-xs text-slate-400">Klien: {ctr.clientName}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  <div className="font-semibold text-slate-400 mb-1">Ruang Lingkup (Scope Points):</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                    {ctr.scopePoints.map((sp, idx) => (
                      <li key={idx}>{sp}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Nilai Kontrak: </span>
                    <span className="font-mono font-bold text-white">
                      Rp {ctr.totalValue.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {ctr.signerHash && (
                    <span className="text-[10px] font-mono text-emerald-400 truncate max-w-[150px]">
                      Seal: {ctr.signerHash}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PROJECTS OVERVIEW & STAFF ASSIGNMENT */}
      {subTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Daftar Proyek Aktif & Penugasan Tim</h3>
              <p className="text-xs text-slate-400">Atur anggota tim yang bertanggung jawab di setiap proyek.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => {
              const assignedStaff = staffUsers.filter(u => p.assignedStaffIds?.includes(u.id));
              return (
                <div key={p.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-sky-400 font-bold">{p.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                      {p.status} ({p.progressPercent}%)
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <p className="text-xs text-slate-400">Klien: {p.clientName}</p>
                  </div>

                  {/* Assigned Staff Pills */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                      Tim Ditugaskan ({assignedStaff.length} Spesialis):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedStaff.map(st => (
                        <span
                          key={st.id}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3 text-sky-400" />
                          <span>{st.name} ({st.title || st.role})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Batas: {p.endDate}</span>
                    <span className="font-bold text-emerald-400">
                      Rp {p.budget.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Generate Invoice Termin Baru</h3>
            <p className="text-xs text-slate-400 mb-4">
              Terbitkan tagihan resmi ke portal klien beserta pemberitahuan otomatis.
            </p>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pilih Proyek Klien</label>
                <select
                  value={newInvProjectId}
                  onChange={(e) => setNewInvProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Deskripsi Termin / Item</label>
                <input
                  type="text"
                  required
                  value={newInvTerm}
                  onChange={(e) => setNewInvTerm(e.target.value)}
                  placeholder="Contoh: Termin 2 (Progress 50% Milestone Prototype)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nominal (IDR)</label>
                  <input
                    type="number"
                    required
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    required
                    value={newInvDueDate}
                    onChange={(e) => setNewInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoice(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition"
                >
                  Terbitkan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW PAYMENT PROOF MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Review Bukti Transfer Manual</h3>
                <p className="text-xs text-slate-400">Invoice #{selectedProof.invoiceNumber} — {selectedProof.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Receipt details */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Bank Tujuan:</span>
                <span className="font-bold text-white">{selectedProof.bankName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Nominal Transfer:</span>
                <span className="font-bold text-emerald-400">
                  Rp {selectedProof.amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Nama Pengirim:</span>
                <span className="font-bold text-white">{selectedProof.accountName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tanggal Transfer:</span>
                <span className="text-white">{selectedProof.transferDate}</span>
              </div>
            </div>

            {/* Proof Image */}
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Pratinjau Struk / Bukti Transfer:</span>
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 bg-slate-950 flex items-center justify-center">
                <img
                  src={selectedProof.fileUrl}
                  alt="Bukti Transfer"
                  referrerPolicy="no-referrer"
                  className="w-full object-cover max-h-48"
                />
              </div>
            </div>

            {/* Notes input */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Catatan Review (Opsional)</label>
              <input
                type="text"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Misal: Dana terverifikasi masuk ke rekening BCA."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleRejectProof(selectedProof.id)}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak Pembayaran</span>
              </button>
              <button
                type="button"
                onClick={() => handleApproveProof(selectedProof.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Setujui & Tandai Lunas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
