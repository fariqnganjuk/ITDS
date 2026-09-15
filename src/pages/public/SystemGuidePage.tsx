import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Users,
  Briefcase,
  Layers,
  FileCheck2,
  CreditCard,
  MessageSquareLock,
  LifeBuoy,
  Cpu,
  Database,
  KeyRound,
  Terminal,
  Calculator,
  Eye,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Activity,
  FileText,
  Lock,
  ChevronRight,
  ShieldAlert,
  Server,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../../types';

interface SystemGuidePageProps {
  onNavigate: (path: string) => void;
  onOpenLogin?: (role?: UserRole) => void;
}

export const SystemGuidePage: React.FC<SystemGuidePageProps> = ({ onNavigate, onOpenLogin }) => {
  const [activeRoleTab, setActiveRoleTab] = useState<'visitor' | 'client' | 'staff' | 'admin' | 'superadmin'>('visitor');
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  const roleDefinitions = [
    {
      id: 'visitor',
      name: 'Calon Klien / Visitor',
      badge: 'Publik Tanpa Login',
      color: 'from-sky-500 to-blue-600',
      icon: Eye,
      summary: 'Pengunjung umum yang mencari solusi digital, mengecek portofolio agensi, dan melakukan kalkulasi biaya transparan.',
      credentials: null,
      flow: [
        {
          step: 1,
          title: 'Eksplorasi Profil & Layanan Agensi',
          desc: 'Pengunjung membuka halaman Beranda, Layanan (Web, Mobile, Cloud, AI), Portfolio studi kasus, dan Testimoni klien sebelumnya.',
          actionPath: '/layanan',
          actionText: 'Lihat Layanan'
        },
        {
          step: 2,
          title: 'Simulasi Biaya Real-time (Estimator)',
          desc: 'Menggunakan kalkulator interaktif untuk memilih paket, timeline (Normal / Express), modul keamanan, dan add-on fitur. Hasil estimasi biaya dan hari kerja terhitung otomatis.',
          actionPath: '/estimasi',
          actionText: 'Buka Kalkulator Estimasi'
        },
        {
          step: 3,
          title: 'Kirim Formulir Konsultasi (Lead)',
          desc: 'Calon klien memasukkan nama, email, perusahaan, dan deskripsi kebutuhan. Sistem otomatis menyimpan data ke antrean Lead Admin.',
          actionPath: '/kontak',
          actionText: 'Kirim Permintaan'
        }
      ]
    },
    {
      id: 'client',
      name: 'Klien (Client)',
      badge: 'Portal Khusus Klien',
      color: 'from-emerald-500 to-teal-600',
      icon: Briefcase,
      summary: 'Klien pemilik proyek yang telah terdaftar (contoh: Budi Santoso - PT Fintech Mandiri). Memiliki portal pribadi untuk memantau pengerjaan, kontrak digital, invoice, dan chat terenkripsi.',
      credentials: { email: 'client@fintech.co.id', roleName: 'client' },
      flow: [
        {
          step: 1,
          title: 'Masuk dengan Aman (2FA Ready)',
          desc: 'Login menggunakan akun terverifikasi. Pengguna dapat mengaktifkan proteksi Two-Factor Authentication (TOTP Google Authenticator).',
          actionPath: '/portal',
          actionText: 'Buka Client Portal'
        },
        {
          step: 2,
          title: 'Tanda Tangani E-Kontrak Digital',
          desc: 'Membaca Surat Perjanjian Kerja Sama (PKS) dan menandatangani secara legal via canvas signature atau typed seal dengan validasi hash SHA-256.',
          actionPath: '/portal/contracts',
          actionText: 'Lihat Kontrak Digital'
        },
        {
          step: 3,
          title: 'Pembayaran Invoice Proyek',
          desc: 'Menerima invoice termin (DP, Milestone, Pelunasan) dan melakukan simulasi pembayaran instan (VA, QRIS, Kartu Kredit) dengan status update real-time.',
          actionPath: '/portal/invoice',
          actionText: 'Kelola Tagihan & Invoice'
        },
        {
          step: 4,
          title: 'Pantau Milestone & Unduh Deliverables',
          desc: 'Melihat timeline pengerjaan live (Sprint Planning, UI/UX, Backend, Security Audit) dan mengunduh berkas aset yang telah selesai dikerjakan.',
          actionPath: '/portal',
          actionText: 'Pantau Milestone'
        },
        {
          step: 5,
          title: 'Chat Rahasia Terenkripsi (AES-256 E2E)',
          desc: 'Berkomunikasi langsung dengan Lead Developer/Staff. Pesan dienkripsi secara client-side menggunakan cipher AES-GCM 256-bit demi keamanan rahasia bisnis.',
          actionPath: '/portal/chat',
          actionText: 'Buka Chat Terenkripsi'
        },
        {
          step: 6,
          title: 'Pusat Bantuan (Support Ticket Desk)',
          desc: 'Mengirimkan tiket bantuan teknis apabila menemukan kendala, memilih prioritas (Low/Medium/Critical), dan memantau status penyelesaian.',
          actionPath: '/portal/support',
          actionText: 'Ajukan Tiket Bantuan'
        }
      ]
    },
    {
      id: 'staff',
      name: 'Staf / Tim Spesialis Teknis',
      badge: 'Operasional Proyek',
      color: 'from-indigo-500 to-violet-600',
      icon: Users,
      summary: 'Tim internal eksekutor proyek yang terdiri dari 4 peran spesialis: Full Stack Developer (Ahmad Fariq), System Analyst (Ilham), IT Support & Infrastructure (Miftah), dan Enterprise & UI/UX (Toni).',
      credentials: { email: 'ilham@nexa.agency', roleName: 'staff' },
      flow: [
        {
          step: 1,
          title: 'Akses Workspace Admin & Proyek Spesifik',
          desc: 'Staf login untuk memantau status sprint, alokasi tugas sesuai bidang keahlian (Analisis Sistem, Infra Cloud, Desain UI/UX, atau Full Stack Coding).',
          actionPath: '/admin',
          actionText: 'Workspace Staf'
        },
        {
          step: 2,
          title: 'Pembaruan Progres & Deliverables',
          desc: 'Mengubah status milestone pengerjaan (In Progress -> Completed) dan memastikan deliverable terkirim sesuai target sprint.',
          actionPath: '/admin',
          actionText: 'Lihat Daftar Proyek'
        },
        {
          step: 3,
          title: 'Merespons Chat Enkripsi Klien',
          desc: 'Memberikan update teknis berkala kepada klien di ruang obrolan terenkripsi E2E.',
          actionPath: '/portal/chat',
          actionText: 'Buka Komunikasi'
        },
        {
          step: 4,
          title: 'Penanganan Tiket Kendala (Support Desk)',
          desc: 'Mengambil alih tiket masalah teknis (bug/revisi), membalas solusi, dan menutup tiket setelah tuntas.',
          actionPath: '/admin/support',
          actionText: 'Buka Support Desk'
        }
      ]
    },
    {
      id: 'admin',
      name: 'Administrator',
      badge: 'Manajemen Bisnis',
      color: 'from-amber-500 to-orange-600',
      icon: UserCheck,
      summary: 'Manajer operasional agensi yang mengatur penawaran klien, pembuatan invoice/kontrak, memoderasi leads, dan konfigurasi harga.',
      credentials: { email: 'admin@nexa.agency', roleName: 'admin' },
      flow: [
        {
          step: 1,
          title: 'Manajemen Leads Masuk (Prospek Klien)',
          desc: 'Memeriksa formulir kontak yang masuk dari publik, menghubungi klien via WhatsApp/Email, dan mengonversinya menjadi proyek resmi.',
          actionPath: '/admin/leads',
          actionText: 'Kelola Leads Masuk'
        },
        {
          step: 2,
          title: 'Penerbitan Kontrak & Invoice',
          desc: 'Membuat dokumen perjanjian legal (PKS) dan menerbitkan tagihan termin invoice baru untuk akun klien yang bersangkutan.',
          actionPath: '/admin',
          actionText: 'Buka Manajemen Proyek'
        },
        {
          step: 3,
          title: 'Konfigurasi Rumus Estimator CMS',
          desc: 'Menyesuaikan formula harga per layanan, pengali timeline ekspres, add-on arsitektur cloud, dan biaya keamanan tanpa perlu coding ulang.',
          actionPath: '/admin/estimator-rules',
          actionText: 'Kelola Aturan Estimator'
        },
        {
          step: 4,
          title: 'Meja Tiket Bantuan Global',
          desc: 'Memantau seluruh tiket kendala pengguna, mengalokasikan staf penanggung jawab, dan menjaga SLA waktu tanggap.',
          actionPath: '/admin/support',
          actionText: 'Pantau Meja Bantuan'
        }
      ]
    },
    {
      id: 'superadmin',
      name: 'Super Admin',
      badge: 'Otoritas Tertinggi & Pendiri',
      color: 'from-rose-500 to-red-600',
      icon: ShieldCheck,
      summary: 'Pemilik platform (Ahmad Fariq & Faizin) dengan kendali mutlak atas pembuatan akun tim (Ilham, Miftah, Toni), keamanan siber, kunci API eksternal, telemetri server, dan audit log blockchain-style.',
      credentials: { email: 'fariqnganjuk@gmail.com', roleName: 'superadmin' },
      flow: [
        {
          step: 1,
          title: 'Manajemen Tim & Hak Akses (Team Management)',
          desc: 'Super Admin membuat dan mengatur hak akses akun tim agensi: Full Stack Developer (Ahmad Fariq), System Analyst (Ilham), IT Support & Infrastructure (Miftah), dan Enterprise & UI/UX (Toni).',
          actionPath: '/admin/team',
          actionText: 'Kelola Tim Agensi'
        },
        {
          step: 2,
          title: 'Audit Log Terpusat (Hash-Chained Ledger)',
          desc: 'Mengaudit rekam jejak aktivitas setiap pengguna. Dilengkapi verifikator SHA-256 satu-klik untuk membuktikan keaslian dan integritas data mutlak.',
          actionPath: '/admin/activity-log',
          actionText: 'Buka Audit Trail SHA-256'
        },
        {
          step: 3,
          title: 'Telemetri Sistem & Autoscaling (HPA Simulator)',
          desc: 'Memantau performa CPU, RAM, throughput req/s, dan latensi database. Mampu memicu simulasi lonjakan trafik untuk menguji auto-scaling kluster.',
          actionPath: '/admin/system-health',
          actionText: 'Pantau Server & Autoscaling'
        },
        {
          step: 4,
          title: 'Manajemen REST API & Kunci Lisensi B2B',
          desc: 'Membuat API Key dengan batasan scope (read/write), rate-limiting, dan menguji endpoint langsung via Interactive cURL Console.',
          actionPath: '/admin/api',
          actionText: 'Kelola API Enterprise'
        }
      ]
    }
  ];

  const currentRoleData = roleDefinitions.find(r => r.id === activeRoleTab) || roleDefinitions[0];

  const handleDemoLogin = (role: UserRole) => {
    if (onOpenLogin) {
      onOpenLogin(role);
    } else {
      onNavigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Panduan Lengkap Arsitektur & Alur Kerja Sistem</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Cara Kerja Sistem Dari Nol Hingga Selesai
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Platform NEXA Digital Agency mengintegrasikan website agensi publik, kalkulator estimasi cerdas, portal klien berkeamanan tinggi dengan 2FA dan enkripsi E2E, serta CMS operasional admin terpadu. Pelajari alur setiap peran di bawah ini.
        </p>
      </div>

      {/* Interactive End-to-End Workflow Diagram (Dari 0 sampai Selesai) */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Alur Siklus Hidup Proyek (End-to-End Lifecycle)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              6 Tahap Perjalanan Dari Pengunjung Menjadi Hasil Selesai
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
            Siklus Standar Agensi Enterprise
          </div>
        </div>

        {/* 6 Step Interactive Tabs / Sequence */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
          {[
            { num: 1, label: 'Kalkulasi & Lead', sub: 'Calon Klien' },
            { num: 2, label: 'Deal & Kontrak', sub: 'Admin' },
            { num: 3, label: 'Tanda Tangan 2FA', sub: 'Klien' },
            { num: 4, label: 'Pembayaran DP', sub: 'Invoice Termin' },
            { num: 5, label: 'Eksekusi & Chat', sub: 'Staf & Klien' },
            { num: 6, label: 'Deliverable & Rilis', sub: 'Serah Terima' }
          ].map(st => {
            const isSelected = activeStepTab === st.num;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStepTab(st.num)}
                className={`p-3 rounded-2xl border text-left transition relative ${
                  isSelected
                    ? 'bg-sky-600/20 border-sky-500 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {st.num}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {st.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{st.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card for Active Step */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80">
          {activeStepTab === 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold">Langkah 1</span>
                <h3 className="text-lg font-bold text-white">Eksplorasi Layanan & Kirim Kebutuhan Proyek</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pengunjung membuka website NEXA, melihat portfolio studi kasus sebelumnya, dan memanfaatkan <strong>Kalkulator Estimasi Biaya</strong> untuk mengukur perkiraan investasi dan timeline secara transparan. Setelah puas, pengunjung mengirim formulir kontak yang langsung tercatat di database Admin Leads.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/estimasi')}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Coba Kalkulator Estimasi</span>
                </button>
                <button
                  onClick={() => onNavigate('/kontak')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Formulir Permintaan Konsultasi
                </button>
              </div>
            </div>
          )}

          {activeStepTab === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">Langkah 2</span>
                <h3 className="text-lg font-bold text-white">Admin Memproses Penawaran & Menerbitkan Kontrak Legal</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tim Admin membuka menu <strong>Admin Leads</strong>, meninjau permohonan calon klien, membuat rancangan kontrak kerja sama (e-Contract) resmi, menyusun milestone pengerjaan, dan menerbitkan akun login resmi untuk klien.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/admin/leads')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Lihat Meja Leads Admin</span>
                </button>
              </div>
            </div>
          )}

          {activeStepTab === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Langkah 3</span>
                <h3 className="text-lg font-bold text-white">Klien Masuk ke Portal & Menandatangani Kontrak Digital</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Klien login ke <strong>Client Portal</strong>. Sebelum proyek dimulai, klien menandatangani Surat Perjanjian Kerja Sama secara digital via tanda tangan layar (canvas) atau ketikan nama yang secara otomatis dikunci dengan stempel kriptografis SHA-256 dan IP address logger.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/portal/contracts')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Uji Tanda Tangan E-Kontrak</span>
                </button>
              </div>
            </div>
          )}

          {activeStepTab === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">Langkah 4</span>
                <h3 className="text-lg font-bold text-white">Pembayaran Invoice Termin (Uang Muka / Milestone)</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Klien diarahkan ke menu <strong>Tagihan & Invoice</strong> untuk melunasi tagihan tahap pertama. Sistem menyediakan gateway simulasi (Virtual Account, QRIS, Kartu Kredit). Seketika pembayaran dikonfirmasi, status proyek otomatis berganti menjadi <em>In Progress</em>.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/portal/invoice')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buka Modul Pembayaran Invoice</span>
                </button>
              </div>
            </div>
          )}

          {activeStepTab === 5 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">Langkah 5</span>
                <h3 className="text-lg font-bold text-white">Pengerjaan Teknis, Update Milestone & Chat Rahasia E2E</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tim Developer (Staf) mengeksekusi arsitektur software dan mengunggah update milestone berkala. Klien dan staf dapat saling berkirim pesan rahasia di <strong>Chat Terenkripsi AES-256 E2E</strong>, memastikan informasi kredensial atau rancangan bisnis tidak bisa disadap.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/portal/chat')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <MessageSquareLock className="w-4 h-4" />
                  <span>Buka Chat Terenkripsi AES-256</span>
                </button>
                <button
                  onClick={() => onNavigate('/portal')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Pantau Milestone Progres
                </button>
              </div>
            </div>
          )}

          {activeStepTab === 6 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold">Langkah 6</span>
                <h3 className="text-lg font-bold text-white">Penyelesaian, Unduh Deliverable & Garansi Support</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Semua deliverables (source code, dokumentasi API, laporan audit penetrasi) diunggah dan dapat diunduh langsung oleh klien di Client Portal. Jika ada bug atau kendala teknis masa pemeliharaan, klien tinggal membuka tiket di <strong>Meja Bantuan (Support Desk)</strong>.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/portal/support')}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span>Coba Meja Bantuan (Support Desk)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role-by-Role Deep Dive with Interactive Switcher */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Panduan Per Role (Siapa Melakukan Apa?)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Pilih Peran untuk Melihat Alur Lengkapnya
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Klik salah satu role di bawah untuk melihat rincian tugas, hak akses, dan tombol untuk login langsung sebagai role tersebut:
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {roleDefinitions.map(r => {
            const isSelected = activeRoleTab === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRoleTab(r.id as any)}
                className={`p-4 rounded-2xl border text-left transition relative ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 shadow-xl shadow-sky-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${r.color} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <div className="font-bold text-sm text-white">{r.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{r.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Role Deep-Dive Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentRoleData.color} flex items-center justify-center text-white shadow-lg`}
              >
                <currentRoleData.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{currentRoleData.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {currentRoleData.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{currentRoleData.summary}</p>
              </div>
            </div>

            {/* Demo Login CTA for this role */}
            {currentRoleData.credentials ? (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between sm:justify-start gap-4 shrink-0">
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400">Akun Uji Coba:</div>
                  <div className="font-mono text-sky-400 font-semibold">{currentRoleData.credentials.email}</div>
                </div>
                <button
                  onClick={() => handleDemoLogin(currentRoleData.credentials?.roleName as UserRole)}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login Sebagai {currentRoleData.name}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('/')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Jelajahi Sebagai Pengunjung
              </button>
            )}
          </div>

          {/* Action Step-by-Step for this role */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              Daftar Tugas & Alur Kerja {currentRoleData.name}:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRoleData.flow.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-sky-400 text-xs font-bold flex items-center justify-center">
                        {item.step}
                      </span>
                      <h5 className="text-sm font-bold text-white">{item.title}</h5>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-8">{item.desc}</p>
                  </div>

                  <div className="pl-8 pt-2">
                    <button
                      onClick={() => onNavigate(item.actionPath)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition group"
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Permission Matrix Table */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Matriks Hak Akses & Kewenangan Fitur
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Siapa yang Memiliki Hak Akses ke Fitur Ini?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tabel perbandingan izin akses modul platform berdasarkan standar Role-Based Access Control (RBAC).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Fitur / Modul Sistem</th>
                <th className="py-3 px-3 text-center">Calon Klien</th>
                <th className="py-3 px-3 text-center">Klien Terdaftar</th>
                <th className="py-3 px-3 text-center">Staf Dev</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {[
                { module: 'Lihat Portfolio, Layanan, Testimoni', v: true, c: true, s: true, a: true, sa: true },
                { module: 'Simulasi Harga di Estimator Publik', v: true, c: true, s: true, a: true, sa: true },
                { module: 'Kirim Permintaan Penawaran (Leads)', v: true, c: true, s: false, a: false, sa: false },
                { module: 'Client Portal (Progres & Milestone Proyek)', v: false, c: true, s: true, a: true, sa: true },
                { module: 'Tanda Tangan E-Kontrak (SHA-256 Seal)', v: false, c: true, s: false, a: true, sa: true },
                { module: 'Bayar & Kelola Tagihan Invoice', v: false, c: true, s: false, a: true, sa: true },
                { module: 'Chat Rahasia Terenkripsi AES-256', v: false, c: true, s: true, a: true, sa: true },
                { module: 'Buat & Kelola Tiket Bantuan (Support Desk)', v: false, c: true, s: true, a: true, sa: true },
                { module: 'Manajemen Leads Masuk (CRM)', v: false, c: false, s: false, a: true, sa: true },
                { module: 'Konfigurasi Rumus Harga Estimator CMS', v: false, c: false, s: false, a: true, sa: true },
                { module: 'Audit Log Ledger (Hash Chaining SHA-256)', v: false, c: false, s: false, a: false, sa: true },
                { module: 'DevOps Autoscaling & Telemetri Server', v: false, c: false, s: false, a: false, sa: true },
                { module: 'Kunci REST API & Webhook B2B Integration', v: false, c: false, s: false, a: false, sa: true }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                    <span>{row.module}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.v ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">&bull;</span>}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.c ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">&bull;</span>}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.s ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">&bull;</span>}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.a ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">&bull;</span>}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.sa ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">&bull;</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick FAQ / Bantuan Tambahan */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Bagaimana cara cepat menguji semua peran?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Klik tombol <strong>Masuk / Login</strong> di pojok kanan atas navbar. Di bagian bawah jendela login, terdapat 3 tombol cepat: <em>Super Admin</em>, <em>Staff</em>, dan <em>Client</em>. Anda bisa berganti akun kapan saja untuk mencoba seluruh perspektif tanpa perlu mendaftar manual.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Apakah data dan chat benar-benar aman?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ya. Pesan proyek dilindungi cipher <strong>AES-GCM 256-bit</strong> client-side dengan IV unik. Tanda tangan kontrak disegel dengan ringkasan hash <strong>SHA-256</strong>, dan seluruh riwayat sistem dicatat ke dalam log audit terantai (blockchain-style ledger) yang keasliannya dapat divalidasi sewaktu-waktu.
          </p>
        </div>
      </div>
    </div>
  );
};
