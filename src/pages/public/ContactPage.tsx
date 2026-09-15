import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  Building,
  Sparkles
} from 'lucide-react';
import { addLead } from '../../lib/storage';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  // Calendar dates generation (next 7 workdays)
  const availableSlots = ['10:00 WIB', '11:30 WIB', '14:00 WIB', '15:30 WIB', '16:30 WIB'];

  const nextDates = React.useMemo(() => {
    const list: Array<{ dateStr: string; dayName: string; dayNum: number }> = [];
    const today = new Date();
    for (let i = 1; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Monday-Friday
        list.push({
          dateStr: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
          dayNum: d.getDate()
        });
      }
      if (list.length >= 7) break;
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(nextDates[0]?.dateStr || '');
  const [selectedSlot, setSelectedSlot] = useState<string>(availableSlots[0]);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addLead({
        name,
        email,
        phone,
        companyName: company,
        serviceId: 'srv_web_app',
        serviceName: 'Konsultasi Arsitektur Digital & Estimasi',
        selectedOptionIds: [],
        estimatedPrice: 25000000,
        currency: 'IDR',
        status: 'New',
        source: 'Calendar Booking',
        bookingDate: selectedDate,
        bookingTime: selectedSlot,
        notes: `Jadwal Konsultasi: ${selectedDate} pukul ${selectedSlot}. Catatan: ${notes}`
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Konsultasi & Hubungi Tim</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Jadwalkan Diskusi Proyek Digital Anda
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Pilih waktu konsultasi langsung melalui kalender interaktif kami, atau kirimkan pesan untuk pertanyaan seputar spesifikasi teknis dan estimasi biaya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Info & Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Kantor & Kontak Operasional</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Jakarta Tech Hub</span>
                  <p className="text-slate-400 leading-relaxed">
                    Menara Satrio 18th Floor, Mega Kuningan, Jakarta Selatan 12950
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Kuala Lumpur Regional Hub</span>
                  <p className="text-slate-400 leading-relaxed">
                    KL Sentral Tower 2, Level 14, 50470 Kuala Lumpur, Malaysia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">WhatsApp Business / Hot-line</span>
                  <p className="text-slate-400">+62 812-3456-7890 / +60 12-345-6789</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Email Resmi</span>
                  <p className="text-slate-400">hello@moon-interactive.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Jaminan Kerahasiaan (Non-Disclosure Agreement)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Setiap ide, skema bisnis, dan dokumen yang Anda kirimkan terikat klausul kerahasiaan otomatis dan terlindungi enkripsi AES-256.
            </p>
          </div>
        </div>

        {/* Right: Booking Form with Interactive Calendar */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
            {isSuccess ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Jadwal Diskusi Berhasil Dikonfirmasi!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Kami telah mengirimkan undangan Google Meet ke <strong>{email}</strong> untuk tanggal <strong>{selectedDate}</strong> pukul <strong>{selectedSlot}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setEmail('');
                      setNotes('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Atur Jadwal Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">1. Pilih Tanggal & Sesi Waktu</h3>
                  <p className="text-xs text-slate-400 mb-4">Sesi konsultasi 45 menit via Google Meet / Zoom</p>

                  {/* Date chips */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
                    {nextDates.map(d => (
                      <div
                        key={d.dateStr}
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`p-2.5 rounded-xl text-center cursor-pointer border transition ${
                          selectedDate === d.dateStr
                            ? 'bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-600/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-semibold">{d.dayName}</div>
                        <div className="text-sm font-extrabold mt-0.5">{d.dayNum}</div>
                      </div>
                    ))}
                  </div>

                  {/* Time slot chips */}
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map(slot => (
                      <div
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition flex items-center gap-1.5 ${
                          selectedSlot === slot
                            ? 'bg-sky-950/60 border-sky-500 text-sky-400 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{slot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white">2. Informasi Kontak Anda</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Bambang Wijaya"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alamat Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="bambang@perusahaan.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+62 812..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Perusahaan</label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="PT Maju Bersama"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topik Diskusi / Rencana Proyek</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Ceritakan gambaran singkat kebutuhan platform, target rilis, atau sistem yang ingin dibangun..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Mengunci Jadwal Konsultasi...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Konfirmasi Booking Konsultasi</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
