import {
  User,
  ServiceItem,
  EstimatorRule,
  Lead,
  Project,
  Milestone,
  Deliverable,
  Invoice,
  PaymentProof,
  Contract,
  ProjectMessage,
  NotificationItem,
  SupportTicket,
  PortfolioItem,
  BlogPost,
  TestimonialItem,
  ActivityLog,
  ApiKeyItem,
  LiveSessionUser
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_fariq',
    name: 'Ahmad Fariq',
    email: 'fariqnganjuk@gmail.com',
    role: 'superadmin',
    title: 'Lead Full Stack Developer & Founder',
    twoFaEnabled: true,
    twoFaSecret: 'JBSWY3DPEHPK3PXP',
    phone: '+62 812-3456-7890',
    companyName: 'NEXA Digital Agency',
    lastLoginAt: '2026-09-15T07:30:00Z',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'usr_faizin',
    name: 'Faizin',
    email: 'faizin@nexa.agency',
    role: 'superadmin',
    title: 'Super Admin & Co-Founder',
    twoFaEnabled: true,
    twoFaSecret: 'HXDMVJECJJWSRZ3U',
    phone: '+62 813-9988-7711',
    companyName: 'NEXA Digital Agency',
    lastLoginAt: '2026-09-15T07:15:00Z',
    createdAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 'usr_ilham',
    name: 'Ilham',
    email: 'ilham@nexa.agency',
    role: 'staff',
    title: 'System Analyst',
    twoFaEnabled: false,
    phone: '+62 819-1122-3344',
    companyName: 'NEXA Digital Agency',
    lastLoginAt: '2026-09-15T06:30:00Z',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'usr_miftah',
    name: 'Miftah',
    email: 'miftah@nexa.agency',
    role: 'staff',
    title: 'IT Support & Infrastructure',
    twoFaEnabled: false,
    phone: '+62 818-5566-7788',
    companyName: 'NEXA Digital Agency',
    lastLoginAt: '2026-09-15T06:10:00Z',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'usr_toni',
    name: 'Toni',
    email: 'toni@nexa.agency',
    role: 'staff',
    title: 'Enterprise & UI/UX',
    twoFaEnabled: false,
    phone: '+62 817-2233-9900',
    companyName: 'NEXA Digital Agency',
    lastLoginAt: '2026-09-15T05:45:00Z',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'usr_client_01',
    name: 'Budi Santoso',
    email: 'client@fintech.co.id',
    role: 'client',
    title: 'Managing Director',
    twoFaEnabled: true,
    phone: '+62 811-9988-7766',
    companyName: 'PT Fintech Mandiri Indonesia',
    lastLoginAt: '2026-09-15T06:40:00Z',
    createdAt: '2025-04-12T00:00:00Z'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv_web_app',
    name: 'Custom Web & SaaS Development',
    slug: 'web-development',
    category: 'Development',
    shortDesc: 'Arsitektur website & platform SaaS performa tinggi dengan React, Node/Go/PHP & cloud deployment.',
    description: 'Solusi end-to-end pembuatan platform web berskala enterprise. Dirancang untuk kecepatan loading sub-detik, keamanan perbankan, dan kesiapan multi-bahasa serta pembayaran internasional.',
    basePrice: 25000000, // Rp 25jt
    currency: 'IDR',
    estimatedWeeks: 4,
    isActive: true,
    features: [
      'PWA & Mobile-First Responsive Design',
      'Stateless JWT + Refresh Token Security',
      'Interactive Custom Admin CMS',
      'SEO Structured Data & Meta Engine',
      'Automated CI/CD Deployment'
    ],
    iconName: 'Globe'
  },
  {
    id: 'srv_mobile_app',
    name: 'Mobile App Development (iOS & Android)',
    slug: 'mobile-development',
    category: 'Mobile',
    shortDesc: 'Aplikasi mobile native & cross-platform dengan offline-first storage dan push notification.',
    description: 'Membangun aplikasi mobile profesional siap rilis Google Play & Apple App Store. Dilengkapi biometrik login, enkripsi lokal, integrasi payment gateway, dan analitik pengguna real-time.',
    basePrice: 35000000, // Rp 35jt
    currency: 'IDR',
    estimatedWeeks: 6,
    isActive: true,
    features: [
      'Cross-Platform React Native / Flutter',
      'Biometric Login & Secure Enclave',
      'Offline Storage Sync Engine',
      'Integrated In-App Purchases / Gateway',
      'Store Submission & Review Support'
    ],
    iconName: 'Smartphone'
  },
  {
    id: 'srv_ui_ux',
    name: 'Enterprise UI/UX & Design System',
    slug: 'ui-ux-design',
    category: 'Design',
    shortDesc: 'Riset pengguna, wireframing, high-fidelity prototipe, dan design system standar Figma token.',
    description: 'Transformasi produk digital dengan pengalaman pengguna yang intuitif dan meningkatkan rasio konversi. Dilengkapi komponen atomik Figma dan handoff siap implementasi tim developer.',
    basePrice: 18000000, // Rp 18jt
    currency: 'IDR',
    estimatedWeeks: 3,
    isActive: true,
    features: [
      'User Journey Mapping & Wireframes',
      'High-Fidelity Interactive Prototype',
      'Atomic Design System & Figma Tokens',
      'Usability Testing with 5+ Testers',
      'Developer Handoff Documentation'
    ],
    iconName: 'Layout'
  },
  {
    id: 'srv_growth_seo',
    name: 'Growth Engine, SEO & Cyber Audit',
    slug: 'growth-seo-audit',
    category: 'Marketing',
    shortDesc: 'Audit keamanan web, optimasi SEO teknis Core Web Vitals, dan strategi funnel konversi.',
    description: 'Tingkatkan visibilitas organik di Google dan amankan aset digital dari kerentanan web. Mencakup penetrasi tes simulasi, audit SSL/CORS, perbaikan Core Web Vitals, dan setup tracking analitik.',
    basePrice: 12000000, // Rp 12jt
    currency: 'IDR',
    estimatedWeeks: 2,
    isActive: true,
    features: [
      'Vulnerability & Penetration Testing',
      'Core Web Vitals Optimization (<1.5s)',
      'Schema.org Rich Snippets Setup',
      'Conversion Rate Optimization Audit',
      'Monthly Executive Performance Report'
    ],
    iconName: 'ShieldCheck'
  }
];

export const INITIAL_ESTIMATOR_RULES: EstimatorRule[] = [
  // Web rules
  {
    id: 'rule_web_auth',
    serviceId: 'srv_web_app',
    category: 'security',
    optionLabel: '2FA & Advanced Role-Based Access Control',
    description: 'Otorisasi multi-level (Superadmin, Admin, Staff, Client) + TOTP Authenticator 2FA.',
    priceModifier: 4500000,
    deliveryDaysModifier: 4,
    isDefault: true
  },
  {
    id: 'rule_web_gateway',
    serviceId: 'srv_web_app',
    category: 'integration',
    optionLabel: 'Payment Gateway (Billplz / Stripe / Midtrans)',
    description: 'Dua jalur pembayaran: online instant gateway & transfer manual dengan upload bukti.',
    priceModifier: 6000000,
    deliveryDaysModifier: 5,
    isDefault: true
  },
  {
    id: 'rule_web_multilang',
    serviceId: 'srv_web_app',
    category: 'scope',
    optionLabel: 'Multi-Language Localization (ID / EN / MY)',
    description: 'Dukungan multibahasa dinamis di seluruh halaman publik dan portal klien.',
    priceModifier: 3500000,
    deliveryDaysModifier: 3,
    isDefault: true
  },
  {
    id: 'rule_web_e2e',
    serviceId: 'srv_web_app',
    category: 'security',
    optionLabel: 'End-to-End Encryption (AES-GCM 256-bit)',
    description: 'Enkripsi data rahasia pesan & kontrak di browser sebelum disimpan ke database.',
    priceModifier: 5500000,
    deliveryDaysModifier: 4,
    isDefault: false
  },
  {
    id: 'rule_web_audit',
    serviceId: 'srv_web_app',
    category: 'security',
    optionLabel: 'Centralized Tamper-Proof Audit Logging',
    description: 'Log terpusat dengan segel kriptografi SHA-256 untuk memantau integritas platform.',
    priceModifier: 4000000,
    deliveryDaysModifier: 3,
    isDefault: false
  },
  {
    id: 'rule_web_sla',
    serviceId: 'srv_web_app',
    category: 'support',
    optionLabel: 'Priority 24/7 Technical Support & 99.9% SLA',
    description: 'Tiket teknis respon darurat < 30 menit dan monitoring auto-scaling server.',
    priceModifier: 5000000,
    deliveryDaysModifier: 0,
    isDefault: false
  },
  // Mobile rules
  {
    id: 'rule_mob_offline',
    serviceId: 'srv_mobile_app',
    category: 'scope',
    optionLabel: 'Offline-First SQLite Cache & Background Sync',
    description: 'Aplikasi tetap berfungsi penuh tanpa sinyal internet dan tersinkronisasi otomatis.',
    priceModifier: 7000000,
    deliveryDaysModifier: 6,
    isDefault: true
  },
  {
    id: 'rule_mob_push',
    serviceId: 'srv_mobile_app',
    category: 'integration',
    optionLabel: 'Realtime Push Notifications Engine',
    description: 'Notifikasi kustom ke device pengguna untuk update proyek, milestone, dan tagihan.',
    priceModifier: 4000000,
    deliveryDaysModifier: 3,
    isDefault: true
  },
  // UI/UX rules
  {
    id: 'rule_ui_tokens',
    serviceId: 'srv_ui_ux',
    category: 'scope',
    optionLabel: 'Complete Tokenized Design System in Figma',
    description: 'Variabel warna, tipografi, dan spacing terstandarisasi untuk multi-platform.',
    priceModifier: 4500000,
    deliveryDaysModifier: 4,
    isDefault: true
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_001',
    name: 'Bambang Sudarmono',
    email: 'bambang@karyalogistik.com',
    phone: '+62 812-7788-9900',
    companyName: 'PT Karya Logistik Mandiri',
    serviceId: 'srv_web_app',
    serviceName: 'Custom Web & SaaS Development',
    selectedOptionIds: ['rule_web_auth', 'rule_web_gateway', 'rule_web_e2e'],
    estimatedPrice: 41000000,
    currency: 'IDR',
    status: 'New',
    source: 'Estimator',
    notes: 'Klien butuh portal tracking pengiriman kargo terintegrasi API Bea Cukai.',
    createdAt: '2026-09-14T09:12:00Z'
  },
  {
    id: 'lead_002',
    name: 'Siti Nurhaliza Rahman',
    email: 'siti@kualalumpurtech.my',
    phone: '+60 17-987-6543',
    companyName: 'KL EduTech Ventures',
    serviceId: 'srv_mobile_app',
    serviceName: 'Mobile App Development (iOS & Android)',
    selectedOptionIds: ['rule_mob_offline', 'rule_mob_push'],
    estimatedPrice: 46000000,
    currency: 'IDR',
    status: 'Contacted',
    source: 'Calendar Booking',
    bookingDate: '2026-09-18',
    bookingTime: '14:00 WIB',
    notes: 'Konsultasi arsitektur offline-first untuk platform kursus sertifikasi profesional.',
    createdAt: '2026-09-13T14:30:00Z'
  },
  {
    id: 'lead_003',
    name: 'Hendra Gunawan',
    email: 'hendra@nusantararetail.co.id',
    phone: '+62 811-9988-7766',
    companyName: 'PT Nusantara Retailindo Jaya',
    serviceId: 'srv_web_app',
    serviceName: 'Custom Web & SaaS Development',
    selectedOptionIds: ['rule_web_auth', 'rule_web_gateway', 'rule_web_multilang'],
    estimatedPrice: 39000000,
    currency: 'IDR',
    status: 'Won',
    source: 'Contact Form',
    notes: 'Deal disepakati, telah dikonversi menjadi Proyek #prj_001.',
    convertedProjectId: 'prj_001',
    createdAt: '2026-08-20T10:00:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj_001',
    clientId: 'usr_client_01',
    clientName: 'Hendra Gunawan (PT Nusantara Retailindo)',
    name: 'Omnichannel B2B Portal & Order Engine',
    slug: 'omnichannel-b2b-portal',
    description: 'Digitalisasi sistem grosir ritel terintegrasi ERP, invoicing otomatis, dan client dashboard.',
    serviceId: 'srv_web_app',
    status: 'In Progress',
    startDate: '2026-08-25',
    endDate: '2026-10-15',
    budget: 39000000,
    currency: 'IDR',
    progressPercent: 65,
    assignedStaffIds: ['usr_staff_01', 'usr_admin_01'],
    encryptedNotes: 'U2FsdGVkX1+vGk... [Kredensial Sandbox ERP Terproteksi AES-256]',
    createdAt: '2026-08-22T08:00:00Z'
  },
  {
    id: 'prj_002',
    clientId: 'usr_client_02',
    clientName: 'Farah binti Razak (FinPay Malaysia)',
    name: 'FinPay E-Wallet & QR Merchant App',
    slug: 'finpay-wallet-app',
    description: 'Aplikasi dompet digital dengan modul 2FA biometrik, DuitNow QR, dan transfer p2p instan.',
    serviceId: 'srv_mobile_app',
    status: 'Review',
    startDate: '2026-07-10',
    endDate: '2026-09-20',
    budget: 48000000,
    currency: 'IDR',
    progressPercent: 90,
    assignedStaffIds: ['usr_staff_01'],
    createdAt: '2026-07-08T10:00:00Z'
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  // Project 1
  {
    id: 'mls_101',
    projectId: 'prj_001',
    title: 'Fase 1: Wireframing & Approval SOW Kontrak',
    description: 'Penyusunan arsitektur data, alur transaksi B2B, dan penandatanganan digital kontrak kerja.',
    status: 'Completed',
    dueDate: '2026-09-02',
    completedAt: '2026-09-01T15:00:00Z',
    order: 1
  },
  {
    id: 'mls_102',
    projectId: 'prj_001',
    title: 'Fase 2: Frontend Client Portal & Admin CMS',
    description: 'Implementasi UI responsive, dashboard analitik, dan integrasi role guard.',
    status: 'Completed',
    dueDate: '2026-09-12',
    completedAt: '2026-09-11T18:30:00Z',
    order: 2
  },
  {
    id: 'mls_103',
    projectId: 'prj_001',
    title: 'Fase 3: Payment Gateway & Dual Transfer Verification',
    description: 'Setup modul invoice PDF, webhook pembayaran otomatis, dan verifikasi upload slip manual.',
    status: 'In Progress',
    dueDate: '2026-09-25',
    order: 3
  },
  {
    id: 'mls_104',
    projectId: 'prj_001',
    title: 'Fase 4: Final UAT, Security Audit & Cloud Launch',
    description: 'Pengujian penetrasi keamanan, stress test auto-scaling, dan serah terima dokumen.',
    status: 'Pending',
    dueDate: '2026-10-15',
    order: 4
  },
  // Project 2
  {
    id: 'mls_201',
    projectId: 'prj_002',
    title: 'Design System & Figma Prototype',
    description: 'Desain UI mobile iOS & Android lengkap dengan dark mode.',
    status: 'Completed',
    dueDate: '2026-07-28',
    completedAt: '2026-07-27T12:00:00Z',
    order: 1
  },
  {
    id: 'mls_202',
    projectId: 'prj_002',
    title: 'Biometric 2FA & Secure Storage Vault',
    description: 'Implementasi FaceID / Fingerprint login dan enkripsi AES-GCM.',
    status: 'Completed',
    dueDate: '2026-08-20',
    completedAt: '2026-08-19T09:00:00Z',
    order: 2
  },
  {
    id: 'mls_203',
    projectId: 'prj_002',
    title: 'App Store & Play Store Sandbox Review',
    description: 'Pengujian beta testing TestFlight dan verifikasi regulasi finansial.',
    status: 'In Progress',
    dueDate: '2026-09-20',
    order: 3
  }
];

export const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: 'dlv_001',
    projectId: 'prj_001',
    title: 'Arsitektur_Sistem_B2B_v1.4.pdf',
    fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    fileType: 'document',
    fileSize: '4.2 MB',
    version: '1.4',
    uploadedBy: 'Sarah Maharani (Lead UI/UX)',
    uploadedAt: '2026-09-01T15:20:00Z',
    notes: 'Diagram alur ERD database, schema relasi, dan rute REST API.'
  },
  {
    id: 'dlv_002',
    projectId: 'prj_001',
    title: 'Figma_Handoff_Design_Tokens.zip',
    fileUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=800&q=80',
    fileType: 'design',
    fileSize: '28.6 MB',
    version: '2.0',
    uploadedBy: 'Sarah Maharani (Lead UI/UX)',
    uploadedAt: '2026-09-10T11:00:00Z',
    notes: 'Komponen UI lengkap, ikon SVG, dan panduan palet warna WCAG AA.'
  },
  {
    id: 'dlv_003',
    projectId: 'prj_002',
    title: 'APK_FinPay_Staging_Build_v0.9.3.apk',
    fileUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    fileType: 'archive',
    fileSize: '42.1 MB',
    version: '0.9.3',
    uploadedBy: 'Budi Santoso',
    uploadedAt: '2026-09-13T16:45:00Z',
    notes: 'Paket Android siap uji di perangkat internal via sideload.'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2026-08-001',
    projectId: 'prj_001',
    projectName: 'Omnichannel B2B Portal',
    clientId: 'usr_client_01',
    clientName: 'Hendra Gunawan (PT Nusantara Retailindo)',
    amount: 19500000, // DP 50%
    currency: 'IDR',
    status: 'Paid',
    paymentMethod: 'Manual Transfer',
    dueDate: '2026-08-28',
    paidAt: '2026-08-26T14:30:00Z',
    pdfUrl: '#',
    items: [
      { description: 'Termin 1 (DP 50%): Desain Arsitektur, UI/UX & Kickoff', quantity: 1, unitPrice: 19500000, total: 19500000 }
    ],
    createdAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2026-09-002',
    projectId: 'prj_001',
    projectName: 'Omnichannel B2B Portal',
    clientId: 'usr_client_01',
    clientName: 'Hendra Gunawan (PT Nusantara Retailindo)',
    amount: 19500000, // Pelunasan 50%
    currency: 'IDR',
    status: 'Pending',
    dueDate: '2026-10-15',
    pdfUrl: '#',
    items: [
      { description: 'Termin 2 (Pelunasan 50%): Backend Integration & Live Deployment', quantity: 1, unitPrice: 19500000, total: 19500000 }
    ],
    createdAt: '2026-09-12T09:00:00Z'
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2026-07-003',
    projectId: 'prj_002',
    projectName: 'FinPay E-Wallet & QR Merchant App',
    clientId: 'usr_client_02',
    clientName: 'Farah binti Razak (FinPay Malaysia)',
    amount: 48000000,
    currency: 'IDR',
    status: 'Paid',
    paymentMethod: 'Billplz / Stripe Gateway',
    dueDate: '2026-07-15',
    paidAt: '2026-07-11T10:15:00Z',
    pdfUrl: '#',
    items: [
      { description: 'Paket Komprehensif Mobile App Development + Biometric Security', quantity: 1, unitPrice: 48000000, total: 48000000 }
    ],
    createdAt: '2026-07-09T08:00:00Z'
  }
];

export const INITIAL_PAYMENT_PROOFS: PaymentProof[] = [
  {
    id: 'proof_001',
    invoiceId: 'inv_001',
    invoiceNumber: 'INV-2026-08-001',
    clientId: 'usr_client_01',
    clientName: 'Hendra Gunawan',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    bankName: 'BCA (Bank Central Asia)',
    accountName: 'PT Nusantara Retailindo Jaya',
    transferDate: '2026-08-26',
    amount: 19500000,
    status: 'Approved',
    reviewedBy: 'Budi Santoso',
    reviewNotes: 'Dana terverifikasi masuk di rekening operasional Bank Mandiri.',
    createdAt: '2026-08-26T14:10:00Z'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr_001',
    projectId: 'prj_001',
    projectName: 'Omnichannel B2B Portal & Order Engine',
    clientId: 'usr_client_01',
    clientName: 'Hendra Gunawan (PT Nusantara Retailindo)',
    title: 'Perjanjian Kerja Sama Pengembangan Perangkat Lunak B2B Portal',
    content: `SURAT PERJANJIAN KERJA SAMA (SOW)

Pada hari ini disepakati kerja sama antara:
PIHAK PERTAMA: NEXA Digital Agency (Moon Interactive Solution)
PIHAK KEDUA: PT Nusantara Retailindo Jaya (Direktur: Hendra Gunawan)

PASAL 1: RUANG LINGKUP PEKERJAAN
1. Pembuatan web portal B2B dengan integrasi katalog produk, order approval workflow, dan dashboard keuangan.
2. Keamanan akses menggunakan 2FA (Two-Factor Authentication) dan enkripsi AES-GCM untuk data transaksi sensitif.
3. Dua jalur pembayaran: otomatis via payment gateway dan verifikasi manual transfer bank.

PASAL 2: NILAI KONTRAK DAN PEMBAYARAN
Total nilai pekerjaan adalah Rp 39.000.000 (Tiga Puluh Sembilan Juta Rupiah), dibayarkan dalam 2 termin (50% Down Payment dan 50% Setelah UAT).

PASAL 3: HAK KEKAYAAN INTELEKTUAL
Seluruh kode sumber (source code) dan aset desain menjadi hak milik penuh Pihak Kedua setelah pelunasan diselesaikan.`,
    scopePoints: [
      'Pengerjaan 4 Milestone Terstruktur',
      'Enkripsi Data End-to-End untuk komunikasi & dokumen',
      'Garansi Perbaikan Bug & SLA Teknis 3 Bulan Pasca Rilis',
      'Akses Penuh Source Code & Dokumentasi API'
    ],
    totalValue: 39000000,
    currency: 'IDR',
    status: 'Signed',
    signedAt: '2026-08-23T11:45:00Z',
    signatureType: 'draw',
    signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 50 10 90 35 T 180 20" stroke="%230284c7" stroke-width="3" fill="none"/></svg>',
    signerIp: '180.252.164.88',
    signerHash: 'SEAL-4F2A9C10B8D3E5F7-9A1B2C3D',
    createdAt: '2026-08-22T14:00:00Z'
  },
  {
    id: 'ctr_002',
    projectId: 'prj_002',
    projectName: 'FinPay E-Wallet & QR Merchant App',
    clientId: 'usr_client_02',
    clientName: 'Farah binti Razak (FinPay Malaysia)',
    title: 'Statement of Work: FinPay Mobile App & Cyber Security',
    content: `STATEMENT OF WORK (SOW) & MASTER SERVICES AGREEMENT

Agreement between NEXA Digital Agency and FinPay Malaysia Sdn Bhd.
Total Scope: iOS and Android Cross-Platform Application, DuitNow QR Integration, Biometric Auth.`,
    scopePoints: [
      'Cross-Platform Mobile App Build (iOS & Android)',
      'Biometric 2FA and Device Keystore integration',
      'Store Submission assistance for App Store & Google Play'
    ],
    totalValue: 48000000,
    currency: 'IDR',
    status: 'Signed',
    signedAt: '2026-07-10T09:30:00Z',
    signatureType: 'type',
    signatureData: 'Farah binti Razak',
    signerIp: '115.132.89.210',
    signerHash: 'SEAL-8B7C6D5E4F3A2B1C-E1F2A3B4',
    createdAt: '2026-07-09T11:00:00Z'
  }
];

export const INITIAL_MESSAGES: ProjectMessage[] = [
  {
    id: 'msg_001',
    projectId: 'prj_001',
    senderId: 'usr_staff_01',
    senderName: 'Sarah Maharani (Lead UI/UX)',
    senderRole: 'staff',
    message: 'Selamat siang Pak Hendra, kami telah mengunggah revisi alur checkout B2B di tab Deliverables. Mohon tinjauan Bapak ya.',
    isEncrypted: true,
    iv: 'a1b2c3d4e5f60718293a4b5c',
    keyFingerprint: 'FINGERPRINT-AES256-4A7F',
    createdAt: '2026-09-12T10:15:00Z'
  },
  {
    id: 'msg_002',
    projectId: 'prj_001',
    senderId: 'usr_client_01',
    senderName: 'Hendra Gunawan',
    senderRole: 'client',
    message: 'Terima kasih Mbak Sarah! Tim operasional kami sudah coba prototipenya dan alur baru jauh lebih ringkas dari sistem lama kami.',
    isEncrypted: true,
    iv: 'b2c3d4e5f6a10718293a4b5d',
    keyFingerprint: 'FINGERPRINT-AES256-4A7F',
    createdAt: '2026-09-12T11:05:00Z'
  },
  {
    id: 'msg_003',
    projectId: 'prj_001',
    senderId: 'usr_admin_01',
    senderName: 'Budi Santoso (Ops Manager)',
    senderRole: 'admin',
    message: 'Catatan penting: kami juga telah mengaktifkan proteksi AES-GCM 256-bit untuk penyimpanan dokumen dan obrolan proyek ini.',
    isEncrypted: true,
    iv: 'c3d4e5f6a1b20718293a4b5e',
    keyFingerprint: 'FINGERPRINT-AES256-4A7F',
    createdAt: '2026-09-12T11:20:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    userId: 'usr_client_01',
    roleTarget: 'client',
    title: 'Milestone Selesai',
    message: 'Fase 2: Frontend Client Portal & Admin CMS telah diselesaikan oleh tim developer.',
    type: 'project',
    link: '/portal/proyek/prj_001',
    isRead: false,
    createdAt: '2026-09-14T18:30:00Z'
  },
  {
    id: 'notif_002',
    userId: 'usr_client_01',
    roleTarget: 'client',
    title: 'Invoice Termin 2 Tersedia',
    message: 'Invoice #INV-2026-09-002 senilai Rp 19.500.000 telah diterbitkan untuk termin kedua.',
    type: 'invoice',
    link: '/portal/invoice',
    isRead: false,
    createdAt: '2026-09-12T09:05:00Z'
  },
  {
    id: 'notif_003',
    roleTarget: 'admin',
    title: 'Lead Baru Masuk',
    message: 'Lead baru dari Bambang Sudarmono (PT Karya Logistik Mandiri) dengan estimasi Rp 41.000.000.',
    type: 'lead',
    link: '/admin/lead',
    isRead: false,
    createdAt: '2026-09-14T09:15:00Z'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_001',
    ticketNumber: 'TKT-2026-0914-88',
    requesterName: 'Hendra Gunawan',
    requesterEmail: 'hendra@nusantararetail.co.id',
    role: 'client',
    subject: 'Permintaan integrasi Webhook ke server SAP ERP staging',
    category: 'Technical Bug',
    priority: 'High',
    status: 'In Progress',
    messages: [
      {
        id: 'tmsg_1',
        sender: 'Hendra Gunawan',
        role: 'client',
        text: 'Halo tim support NEXA, kami butuh IP whitelist untuk testing webhook notifikasi pesanan ke server internal SAP kami.',
        timestamp: '2026-09-14T10:00:00Z'
      },
      {
        id: 'tmsg_2',
        sender: 'Budi Santoso (NEXA Tech Lead)',
        role: 'admin',
        text: 'Halo Pak Hendra, IP outbound staging kami adalah 34.101.88.12 dan 34.101.88.13. Kami sudah sertakan HMAC-SHA256 signature header untuk verifikasi payload.',
        timestamp: '2026-09-14T10:18:00Z'
      }
    ],
    createdAt: '2026-09-14T10:00:00Z',
    updatedAt: '2026-09-14T10:18:00Z'
  },
  {
    id: 'tkt_002',
    ticketNumber: 'TKT-2026-0915-12',
    requesterName: 'Farah binti Razak',
    requesterEmail: 'farah@fintechmalaysia.my',
    role: 'client',
    subject: 'Panduan aktivasi 2FA TOTP bagi akun finance manager',
    category: 'Security / 2FA',
    priority: 'Medium',
    status: 'Resolved',
    messages: [
      {
        id: 'tmsg_3',
        sender: 'Farah binti Razak',
        role: 'client',
        text: 'Bolehkah beri panduan ringkas cara scan QR code Google Authenticator bagi user finance kami?',
        timestamp: '2026-09-15T04:20:00Z'
      },
      {
        id: 'tmsg_4',
        sender: 'Sarah Maharani',
        role: 'staff',
        text: 'Tentu Puan Farah, pengguna boleh klik tombol profil di portal, aktifkan toggle 2FA, lalu scan QR menggunakan Google Authenticator atau 1Password. Terdapat 6 kod kecemasan (backup codes) yang boleh disimpan.',
        timestamp: '2026-09-15T04:35:00Z'
      }
    ],
    createdAt: '2026-09-15T04:20:00Z',
    updatedAt: '2026-09-15T04:35:00Z'
  }
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port_01',
    title: 'FinPay: Digital Wallet & DuitNow Merchant Ecosystem',
    slug: 'finpay-wallet-ecosystem',
    category: 'Mobile & Fintech',
    client: 'FinPay Malaysia Sdn Bhd',
    resultMetric: '+320% DAU',
    metricLabel: 'Pertumbuhan Transaksi Harian',
    description: 'Aplikasi dompet digital dengan waktu proses QR sub-detik, sertifikasi enkripsi biometrik, dan dukungan jutaan transaksi harian tanpa downtime.',
    tags: ['React Native', 'Node.js', 'Biometrics', 'PCI-DSS Compliance'],
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80',
    liveUrl: 'https://finpay.my',
    isPublished: true,
    testimonialQuote: 'NEXA membantu kami merevolusi arsitektur aplikasi mobile kami dengan performa yang luar biasa stabil.',
    testimonialAuthor: 'Farah binti Razak, COO FinPay Malaysia'
  },
  {
    id: 'port_02',
    title: 'Nusantara Retail B2B Wholesale Portal',
    slug: 'nusantara-retail-portal',
    category: 'Web Application',
    client: 'PT Nusantara Retailindo Jaya',
    resultMetric: '0.8s Load Time',
    metricLabel: 'Kecepatan Muat Halaman',
    description: 'Portal katalog grosir untuk 1.200+ mitra toko ritel di seluruh Indonesia, dilengkapi integrasi inventori realtime dan auto-invoicing.',
    tags: ['Next.js / React', 'Tailwind', 'PostgreSQL', 'Multi-tenant'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    liveUrl: 'https://nusantararetail.co.id',
    isPublished: true,
    testimonialQuote: 'Beban operasional admin berkurang drastis berkat portal klien dan sistem approval kontrak otomatis.',
    testimonialAuthor: 'Hendra Gunawan, Direktur Operasional'
  },
  {
    id: 'port_03',
    title: 'Karya Cargo: Real-Time Fleet & Logistics Engine',
    slug: 'karya-cargo-logistics',
    category: 'Enterprise SaaS',
    client: 'PT Karya Logistik Mandiri',
    resultMetric: '99.98% Uptime',
    metricLabel: 'Ketersediaan Sistem Logistik',
    description: 'Sistem manajemen armada pelacakan kontainer dan integrasi GPS IoT dengan notifikasi status pesanan instan via WhatsApp & Webhook.',
    tags: ['Go / Node', 'WebSockets', 'Kubernetes', 'PWA'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    isPublished: true,
    testimonialQuote: 'Ketelitian estimasi biaya di awal sangat akurat dan transparan sesuai eksekusi di lapangan.',
    testimonialAuthor: 'Bambang Sudarmono, VP Logistics'
  }
];

export const INITIAL_BLOG: BlogPost[] = [
  {
    id: 'blog_01',
    title: 'Membangun Arsitektur SaaS Skalabilitas Tinggi dengan Zero-Trust Security & 2FA',
    slug: 'arsitektur-saas-zero-trust-2fa',
    excerpt: 'Bagaimana agency modern merancang aplikasi web dengan autentikasi dua faktor, isolasi tenant, dan enkripsi end-to-end.',
    content: `Dalam era digital saat ini, platform SaaS tidak lagi cukup hanya mengandalkan username dan password standar. Proteksi berlapis menjadi keharusan mutlak untuk menjaga data sensitif klien dan kepatuhan regulasi finansial.

Di artikel ini, kita mengupas implementasi:
1. Two-Factor Authentication (TOTP RFC 6238) dengan kode pemulihan darurat.
2. Enkripsi client-side Web Crypto AES-GCM (256-bit) sebelum data meninggalkan browser pengguna.
3. Activity Audit Trail terpusat dengan segel kriptografi hash SHA-256 untuk mendeteksi manipulasi data.`,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    author: 'Ahmad Faisal',
    authorRole: 'Chief Technology Strategist',
    readTime: '6 menit baca',
    publishedAt: '2026-09-10',
    category: 'Engineering & Cyber Security',
    tags: ['SaaS Architecture', '2FA', 'Encryption', 'Security']
  },
  {
    id: 'blog_02',
    title: 'Strategi Rule-Based Estimator: Mengubah Pengunjung Menjadi Proyek Deal Bernilai Tinggi',
    slug: 'strategi-rule-based-estimator-closing',
    excerpt: 'Mengapa kalkulator harga transparan multi-step terbukti meningkatkan konversi lead hingga 3x lipat dibanding form kontak konvensional.',
    content: `Banyak calon klien frustrasi ketika harus menunggu 3 hari hanya untuk mendapatkan estimasi harga kasar proyek website atau aplikasi mobile.

Melalui formula harga berbasis aturan:
Harga = Base Price(Service) + Modifier(Fitur Tambahan)

Klien mendapatkan transparansi langsung secara instan, sementara tim agency menerima lead matang yang siap dikonversi menjadi proyek aktif dan kontrak kerja.`,
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    author: 'Budi Santoso',
    authorRole: 'Operations Director',
    readTime: '4 menit baca',
    publishedAt: '2026-09-08',
    category: 'Business & Conversion',
    tags: ['Lead Engine', 'Estimator', 'Agency Growth']
  }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'tst_01',
    clientName: 'Hendra Gunawan',
    clientRole: 'Direktur Operasional',
    companyName: 'PT Nusantara Retailindo Jaya',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Portal klien NEXA sangat rapi. Kami bisa cek milestone, unduh deliverable desain, tanda tangan SOW digital, sampai bayar invoice tanpa bolak-balik WhatsApp. Sangat profesional!',
    projectName: 'Omnichannel B2B Portal & Order Engine',
    isPublished: true,
    createdAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'tst_02',
    clientName: 'Farah binti Razak',
    clientRole: 'Chief Operating Officer',
    companyName: 'FinPay Malaysia Sdn Bhd',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Keamanan 2FA dan enkripsi datanya benar-benar teruji saat audit kepatuhan. Eksekusi desain UI/UX dan performa aplikasinya melebihi ekspektasi kami di Kuala Lumpur.',
    projectName: 'FinPay E-Wallet & QR Merchant App',
    isPublished: true,
    createdAt: '2026-08-25T11:20:00Z'
  },
  {
    id: 'tst_03',
    clientName: 'Bambang Sudarmono',
    clientRole: 'VP of Logistics Operations',
    companyName: 'PT Karya Logistik Mandiri',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Kalkulator estimasi harganya transparan dan langsung memberi gambaran akurat sebelum kami booking jadwal konsultasi. Tim teknisnya sangat responsif menyelesaikan kendala.',
    projectName: 'Fleet Tracking & Dispatch Engine',
    isPublished: true,
    createdAt: '2026-08-15T09:40:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_001',
    userId: 'usr_superadmin_01',
    userName: 'Ahmad Faisal (Owner)',
    userRole: 'superadmin',
    action: 'USER_LOGIN_2FA_SUCCESS',
    entityType: 'auth',
    entityId: 'usr_superadmin_01',
    metaJson: JSON.stringify({ method: 'TOTP_AUTHENTICATOR', ip: '180.252.164.12', browser: 'Chrome 128 / macOS' }),
    ipAddress: '180.252.164.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    prevHash: 'GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000',
    integrityHash: '8e4f5a9b2c3d1e0f4a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f',
    createdAt: '2026-09-15T06:50:00Z'
  },
  {
    id: 'act_002',
    userId: 'usr_client_01',
    userName: 'Hendra Gunawan',
    userRole: 'client',
    action: 'CONTRACT_DIGITAL_SIGNED',
    entityType: 'contract',
    entityId: 'ctr_001',
    metaJson: JSON.stringify({ contractId: 'ctr_001', seal: 'SEAL-4F2A9C10B8D3E5F7-9A1B2C3D', signerIp: '180.252.164.88' }),
    ipAddress: '180.252.164.88',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    prevHash: '8e4f5a9b2c3d1e0f4a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f',
    integrityHash: '3a7b1c9d8e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    createdAt: '2026-08-23T11:45:00Z'
  },
  {
    id: 'act_003',
    userId: 'usr_admin_01',
    userName: 'Budi Santoso (Ops Manager)',
    userRole: 'admin',
    action: 'PAYMENT_PROOF_APPROVED',
    entityType: 'invoice',
    entityId: 'inv_001',
    metaJson: JSON.stringify({ proofId: 'proof_001', amount: 19500000, bank: 'BCA' }),
    ipAddress: '103.21.244.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    prevHash: '3a7b1c9d8e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    integrityHash: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    createdAt: '2026-08-26T14:30:00Z'
  },
  {
    id: 'act_004',
    userId: 'usr_admin_01',
    userName: 'Budi Santoso (Ops Manager)',
    userRole: 'admin',
    action: 'LEAD_CONVERTED_TO_PROJECT',
    entityType: 'lead',
    entityId: 'lead_003',
    metaJson: JSON.stringify({ leadId: 'lead_003', newProjectId: 'prj_001', budget: 39000000 }),
    ipAddress: '103.21.244.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    prevHash: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    integrityHash: '1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e',
    createdAt: '2026-08-22T08:00:00Z'
  }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key_01',
    name: 'Production Mobile App Client',
    keyPrefix: 'pk_live_mob_',
    rawKeyMasked: 'pk_live_mob_7f9a2e************************3b1c',
    scopes: ['read:projects', 'read:milestones', 'create:support_ticket'],
    createdAt: '2026-08-15T10:00:00Z',
    lastUsedAt: '2026-09-15T06:55:00Z',
    rateLimitPerMin: 120,
    isActive: true
  },
  {
    id: 'key_02',
    name: 'External ERP Webhook Connector',
    keyPrefix: 'pk_live_erp_',
    rawKeyMasked: 'pk_live_erp_9a8b7c************************4d2e',
    scopes: ['read:invoices', 'update:invoices', 'create:leads'],
    createdAt: '2026-08-28T14:30:00Z',
    lastUsedAt: '2026-09-14T22:10:00Z',
    rateLimitPerMin: 60,
    isActive: true
  }
];

export const INITIAL_LIVE_SESSIONS: LiveSessionUser[] = [
  {
    id: 'usr_superadmin_01',
    name: 'Ahmad Faisal (Owner)',
    email: 'ahmad@moon-interactive.com',
    role: 'superadmin',
    ipAddress: '180.252.164.12',
    location: 'Jakarta, Indonesia 🇮🇩',
    browser: 'Chrome 128 / macOS',
    activePath: '/admin/dashboard',
    lastPing: '2 detik yang lalu',
    is2FAVerified: true
  },
  {
    id: 'usr_client_01',
    name: 'Hendra Gunawan',
    email: 'hendra@nusantararetail.co.id',
    role: 'client',
    ipAddress: '180.252.164.88',
    location: 'Surabaya, Indonesia 🇮🇩',
    browser: 'Edge 128 / Windows 11',
    activePath: '/portal/proyek/prj_001',
    lastPing: '18 detik yang lalu',
    is2FAVerified: true
  },
  {
    id: 'usr_client_02',
    name: 'Farah binti Razak',
    email: 'farah@fintechmalaysia.my',
    role: 'client',
    ipAddress: '115.132.89.210',
    location: 'Kuala Lumpur, Malaysia 🇲🇾',
    browser: 'Safari 18 / iOS Mobile',
    activePath: '/portal/invoice',
    lastPing: '1 menit yang lalu',
    is2FAVerified: false
  },
  {
    id: 'usr_staff_01',
    name: 'Sarah Maharani',
    email: 'sarah@moon-interactive.com',
    role: 'staff',
    ipAddress: '114.122.90.44',
    location: 'Bandung, Indonesia 🇮🇩',
    browser: 'Firefox Developer / macOS',
    activePath: '/portal/proyek/prj_001/chat',
    lastPing: '34 detik yang lalu',
    is2FAVerified: false
  }
];
