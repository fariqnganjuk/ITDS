import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  QrCode,
  Building,
  ArrowRight,
  Receipt,
  X,
  Lock
} from 'lucide-react';
import { getInvoices, updateInvoiceStatus, getCurrentUser } from '../../lib/storage';
import { Invoice } from '../../types';

export const ClientInvoicesView: React.FC = () => {
  const user = getCurrentUser();
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices());
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptNotice, setReceiptNotice] = useState<string | null>(null);

  const activeInvoices = invoices.filter(inv => user?.role === 'client' ? inv.clientId === user.id : true);

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
  };

  const handleSimulatePayment = () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      updateInvoiceStatus(selectedInvoice.id, 'Paid');
      setInvoices(getInvoices());
      setIsProcessing(false);
      setSelectedInvoice(null);
      setReceiptNotice(`Pembayaran untuk faktur ${selectedInvoice.invoiceNumber} berhasil diverifikasi secara real-time!`);
      setTimeout(() => setReceiptNotice(null), 5000);
    }, 1000);
  };

  const handleDownloadReceipt = (invNumber: string) => {
    setReceiptNotice(`Kuitansi digital resmi #${invNumber}.pdf berhasil diunduh dengan cap verifikasi.`);
    setTimeout(() => setReceiptNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {receiptNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{receiptNotice}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">TERBAYAR</span>
        </div>
      )}

      {/* Invoices List */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Faktur & Riwayat Tagihan</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sistem penagihan otomatis dengan rekonsiliasi payment gateway.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {activeInvoices.map(inv => {
            const isPaid = inv.status === 'Paid';

            return (
              <div key={inv.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isPaid ? 'Lunas (Paid)' : 'Belum Bayar (Unpaid)'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{inv.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Jatuh Tempo: {new Date(inv.dueDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="sm:text-right">
                    <div className="text-[11px] text-slate-400">Jumlah Tagihan</div>
                    <div className="text-lg font-extrabold text-white">
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isPaid ? (
                      <button
                        onClick={() => handleDownloadReceipt(inv.invoiceNumber)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-sky-400" />
                        <span>Kuitansi PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenPayment(inv)}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Sekarang</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Simulasi Payment Gateway 3-D Secure</span>
              </div>
              <h3 className="text-xl font-bold text-white">Pelunasan Faktur</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedInvoice.invoiceNumber} - {selectedInvoice.title}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Pembayaran:</span>
              <span className="text-xl font-black text-emerald-400">
                Rp {selectedInvoice.amount.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Pilih Kanal Pembayaran:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3 rounded-xl border text-center transition ${
                    paymentMethod === 'qris'
                      ? 'bg-sky-950/50 border-sky-500 text-sky-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">QRIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`p-3 rounded-xl border text-center transition ${
                    paymentMethod === 'va'
                      ? 'bg-sky-950/50 border-sky-500 text-sky-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Virtual Acc</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition ${
                    paymentMethod === 'card'
                      ? 'bg-sky-950/50 border-sky-500 text-sky-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Kartu Kredit</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'qris' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2 flex items-center justify-center">
                  <div className="text-slate-900 text-center font-mono text-[9px] font-bold">
                    [QRIS DINAMIS STANDAR ASPI]
                    <div className="mt-2 text-xs font-black">NEXA AGENCY</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">Pindai dengan GoPay, OVO, Dana, BCA Mobile, atau Livin</div>
              </div>
            )}

            {paymentMethod === 'va' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-400">Nomor Virtual Account Mandiri:</div>
                <div className="text-base font-mono font-bold text-sky-400 p-2 rounded bg-slate-900">
                  8809 1204 8839 2011
                </div>
                <p className="text-[10px] text-slate-400">Verifikasi otomatis dalam hitungan detik setelah transfer selesai.</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Nomor Kartu: 4000 1234 5678 9010"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV: 123"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Memproses Verifikasi Gateway...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
