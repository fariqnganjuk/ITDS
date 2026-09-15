import { LanguageCode } from '../types';

export interface Translations {
  nav: {
    home: string;
    services: string;
    portfolio: string;
    estimator: string;
    blog: string;
    testimonials: string;
    contact: string;
    portal: string;
    admin: string;
    installApp: string;
    login: string;
    logout: string;
  };
  hero: {
    tagline: string;
    title: string;
    highlight: string;
    description: string;
    calculateEstimate: string;
    explorePortfolio: string;
    trustedBy: string;
  };
  stats: {
    activeProjects: string;
    satisfaction: string;
    conversionUplift: string;
    slaUptime: string;
  };
  estimator: {
    badge: string;
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    basePrice: string;
    addonsSelected: string;
    estimatedTotal: string;
    estimatedDelivery: string;
    requestProposal: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
    submitLead: string;
    successMessage: string;
  };
  portal: {
    title: string;
    welcome: string;
    activeProjects: string;
    milestones: string;
    deliverables: string;
    invoices: string;
    contracts: string;
    support: string;
    twoFaSecurity: string;
    payInvoice: string;
    uploadProof: string;
    eSignature: string;
  };
  admin: {
    title: string;
    overview: string;
    leads: string;
    projects: string;
    invoices: string;
    estimatorRules: string;
    contracts: string;
    activityLogs: string;
    userRoles: string;
    apiKeys: string;
    liveMonitoring: string;
  };
}

export const DICTIONARY: Record<LanguageCode, Translations> = {
  id: {
    nav: {
      home: 'Beranda',
      services: 'Layanan',
      portfolio: 'Portfolio',
      estimator: 'Kalkulator Biaya',
      blog: 'Insight & Blog',
      testimonials: 'Testimoni',
      contact: 'Kontak & Konsultasi',
      portal: 'Client Portal',
      admin: 'Admin CMS',
      installApp: 'Pasang Aplikasi',
      login: 'Masuk Akun',
      logout: 'Keluar'
    },
    hero: {
      tagline: 'ONE-STOP DIGITAL AGENCY & SAAS PLATFORM',
      title: 'Solusi Digital Skala Enterprise dengan Keamanan Tinggi &',
      highlight: 'Transparansi Penuh',
      description: 'Dari kalkulator biaya transparan, portal klien interaktif, e-signature kontrak, hingga enkripsi end-to-end terstandarisasi perbankan.',
      calculateEstimate: 'Hitung Estimasi Biaya',
      explorePortfolio: 'Lihat Case Study',
      trustedBy: 'Dipercaya oleh 50+ Perusahaan Lintas Indonesia & Asia Tenggara'
    },
    stats: {
      activeProjects: 'Proyek Sukses',
      satisfaction: 'Kepuasan Klien',
      conversionUplift: 'Rata-rata Lonjakan Konversi',
      slaUptime: 'SLA Keandalan Sistem'
    },
    estimator: {
      badge: 'TRANSPARAN & CEPAT',
      title: 'Kalkulator Estimasi Biaya Proyek',
      subtitle: 'Pilih layanan dan fitur yang Anda butuhkan. Harga dihitung secara real-time dengan rumus transparan tanpa biaya tersembunyi.',
      step1: '1. Pilih Kategori Layanan',
      step2: '2. Sesuaikan Fitur & Spesifikasi',
      step3: '3. Ringkasan & Booking Konsultasi',
      basePrice: 'Harga Dasar Layanan',
      addonsSelected: 'Fitur Tambahan Terpilih',
      estimatedTotal: 'Total Perkiraan Biaya',
      estimatedDelivery: 'Perkiraan Waktu Pengerjaan',
      requestProposal: 'Ajukan Proposal Resmi',
      name: 'Nama Lengkap',
      email: 'Alamat Email Perusahaan',
      phone: 'Nomor WhatsApp / Telepon',
      company: 'Nama Perusahaan / Organisasi',
      notes: 'Detail Kebutuhan Khusus',
      submitLead: 'Kirim Pengajuan & Jadwalkan Diskusi',
      successMessage: 'Pengajuan Anda berhasil disimpan! Tim kami akan menghubungi dalam waktu maksimal 2 jam.'
    },
    portal: {
      title: 'Portal Klien NEXA',
      welcome: 'Selamat Datang Kembali',
      activeProjects: 'Proyek Berjalan',
      milestones: 'Tahapan & Milestone',
      deliverables: 'Berkas Deliverables',
      invoices: 'Faktur & Tagihan',
      contracts: 'Kontrak & SOW',
      support: 'Bantuan Teknis',
      twoFaSecurity: 'Autentikasi 2-Faktor (2FA)',
      payInvoice: 'Bayar Sekarang',
      uploadProof: 'Unggah Bukti Transfer',
      eSignature: 'Tanda Tangan Digital'
    },
    admin: {
      title: 'Pusat Manajemen Operasional',
      overview: 'Ringkasan Bisnis',
      leads: 'Pipeline Leads',
      projects: 'Manajemen Proyek',
      invoices: 'Invoice & Pembayaran',
      estimatorRules: 'Aturan Estimator',
      contracts: 'Kontrak & SOW',
      activityLogs: 'Audit Log Terpusat',
      userRoles: 'Kelola Pengguna & Role',
      apiKeys: 'Integrasi API & Telemetri',
      liveMonitoring: 'Monitoring Aktivitas Real-Time'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      estimator: 'Cost Estimator',
      blog: 'Insights & Blog',
      testimonials: 'Testimonials',
      contact: 'Contact & Booking',
      portal: 'Client Portal',
      admin: 'Admin CMS',
      installApp: 'Install App',
      login: 'Sign In',
      logout: 'Sign Out'
    },
    hero: {
      tagline: 'ONE-STOP DIGITAL AGENCY & SAAS PLATFORM',
      title: 'Enterprise-Grade Digital Solutions with High Security &',
      highlight: 'Full Transparency',
      description: 'From transparent cost estimators, interactive client portals, and e-signatures to bank-grade end-to-end encryption.',
      calculateEstimate: 'Calculate Project Estimate',
      explorePortfolio: 'Explore Case Studies',
      trustedBy: 'Trusted by 50+ Enterprises across Southeast Asia'
    },
    stats: {
      activeProjects: 'Successful Projects',
      satisfaction: 'Client Satisfaction',
      conversionUplift: 'Average Conversion Lift',
      slaUptime: 'System Reliability SLA'
    },
    estimator: {
      badge: 'TRANSPARENT & INSTANT',
      title: 'Project Cost Estimator',
      subtitle: 'Select services and custom specifications. Pricing calculates in real-time with formula-based rules without hidden costs.',
      step1: '1. Select Service Category',
      step2: '2. Select Features & Options',
      step3: '3. Summary & Consultation Booking',
      basePrice: 'Service Base Price',
      addonsSelected: 'Selected Add-ons',
      estimatedTotal: 'Estimated Investment',
      estimatedDelivery: 'Estimated Timeline',
      requestProposal: 'Request Official Proposal',
      name: 'Full Name',
      email: 'Corporate Email Address',
      phone: 'WhatsApp / Phone Number',
      company: 'Company / Organization',
      notes: 'Specific Requirements & Goals',
      submitLead: 'Submit Inquiry & Book Meeting',
      successMessage: 'Your inquiry has been logged! Our team will contact you within 2 hours.'
    },
    portal: {
      title: 'NEXA Client Portal',
      welcome: 'Welcome Back',
      activeProjects: 'Active Projects',
      milestones: 'Milestones & Timeline',
      deliverables: 'Deliverable Files',
      invoices: 'Billing & Invoices',
      contracts: 'Contracts & SOW',
      support: 'Tech Support Desk',
      twoFaSecurity: 'Two-Factor Authentication (2FA)',
      payInvoice: 'Pay Online',
      uploadProof: 'Upload Bank Slip',
      eSignature: 'Digital E-Signature'
    },
    admin: {
      title: 'Operational CMS & Hub',
      overview: 'Business Analytics',
      leads: 'Leads Pipeline',
      projects: 'Project Operations',
      invoices: 'Invoices & Review',
      estimatorRules: 'Estimator Pricing Rules',
      contracts: 'Contracts & SOWs',
      activityLogs: 'Centralized Audit Trail',
      userRoles: 'Users & RBAC',
      apiKeys: 'API Keys & Telemetry',
      liveMonitoring: 'Real-Time User Monitoring'
    }
  },
  my: {
    nav: {
      home: 'Laman Utama',
      services: 'Perkhidmatan',
      portfolio: 'Portfolio',
      estimator: 'Kalkulator Kos',
      blog: 'Wawasan & Blog',
      testimonials: 'Testimoni',
      contact: 'Hubungi & Tempahan',
      portal: 'Portal Pelanggan',
      admin: 'Admin CMS',
      installApp: 'Pasang Aplikasi',
      login: 'Log Masuk',
      logout: 'Log Keluar'
    },
    hero: {
      tagline: 'PLATFORM DIGITAL AGENCY & SAAS BERSEPADU',
      title: 'Penyelesaian Digital Gred Perusahaan dengan Keselamatan Tinggi &',
      highlight: 'Ketelusan Sepenuhnya',
      description: 'Daripada kalkulator kos telus, portal pelanggan interaktif, e-tandatangan kontrak, hingga penyulitan end-to-end piawaian perbankan.',
      calculateEstimate: 'Kira Anggaran Kos',
      explorePortfolio: 'Lihat Kajian Kes',
      trustedBy: 'Dipercayai oleh 50+ Syarikat di Malaysia & Nusantara'
    },
    stats: {
      activeProjects: 'Projek Berjaya',
      satisfaction: 'Kepuasan Pelanggan',
      conversionUplift: 'Peningkatan Penukaran Purata',
      slaUptime: 'SLA Keboleharapan Sistem'
    },
    estimator: {
      badge: 'TELUS & PANTAS',
      title: 'Kalkulator Anggaran Kos Projek',
      subtitle: 'Pilih perkhidmatan dan spesifikasi pilihan. Harga dikira secara masa nyata dengan formula telus tanpa caj tersembunyi.',
      step1: '1. Pilih Kategori Perkhidmatan',
      step2: '2. Pilih Ciri & Pilihan Tambahan',
      step3: '3. Ringkasan & Tempahan Rundingan',
      basePrice: 'Harga Asas Perkhidmatan',
      addonsSelected: 'Ciri Tambahan Dipilih',
      estimatedTotal: 'Jumlah Anggaran Kos',
      estimatedDelivery: 'Anggaran Tempoh Siap',
      requestProposal: 'Mohon Cadangan Rasmi',
      name: 'Nama Penuh',
      email: 'Alamat Emel Syarikat',
      phone: 'Nombor WhatsApp / Telefon',
      company: 'Nama Syarikat / Organisasi',
      notes: 'Keperluan & Matlamat Khas',
      submitLead: 'Hantar Permohonan & Tempah Slot',
      successMessage: 'Permohonan anda berjaya dihantar! Pasukan kami akan menghubungi anda dalam masa 2 jam.'
    },
    portal: {
      title: 'Portal Pelanggan NEXA',
      welcome: 'Selamat Kembali',
      activeProjects: 'Projek Sedang Berjalan',
      milestones: 'Fasa & Pencapaian',
      deliverables: 'Fail Hasil Kerja',
      invoices: 'Invois & Pembayaran',
      contracts: 'Kontrak & SOW',
      support: 'Meja Bantuan Teknikal',
      twoFaSecurity: 'Pengesahan Dua Faktor (2FA)',
      payInvoice: 'Bayar Sekarang',
      uploadProof: 'Muat Naik Resit Pindahan',
      eSignature: 'E-Tandatangan Digital'
    },
    admin: {
      title: 'Pusat Operasi & CMS',
      overview: 'Analitik Perniagaan',
      leads: 'Saluran Prospek',
      projects: 'Pengurusan Projek',
      invoices: 'Invois & Semakan',
      estimatorRules: 'Peraturan Harga Estimator',
      contracts: 'Kontrak & SOW',
      activityLogs: 'Log Audit Berpusat',
      userRoles: 'Pengguna & Peranan',
      apiKeys: 'Integrasi API & Telemetri',
      liveMonitoring: 'Pemantauan Pengguna Masa Nyata'
    }
  }
};
