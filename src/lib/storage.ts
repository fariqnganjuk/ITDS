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
  LiveSessionUser,
  SystemHealthMetrics
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_ESTIMATOR_RULES,
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_MILESTONES,
  INITIAL_DELIVERABLES,
  INITIAL_INVOICES,
  INITIAL_PAYMENT_PROOFS,
  INITIAL_CONTRACTS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_PORTFOLIO,
  INITIAL_BLOG,
  INITIAL_TESTIMONIALS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_API_KEYS,
  INITIAL_LIVE_SESSIONS
} from './mockData';
import { generateSha256, generateContractSeal } from './crypto';

const PREFIX = 'nexa_agency_';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('nexa_storage_update', { detail: { key } }));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

// Current Logged-in User
export function getCurrentUser(): User | null {
  return load<User | null>('current_user', null);
}

export function setCurrentUser(user: User | null): void {
  save('current_user', user);
}

// Users
export function getUsers(): User[] {
  return load<User[]>('users', INITIAL_USERS);
}

export function saveUsers(users: User[]): void {
  save('users', users);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  
  const current = getCurrentUser();
  if (current && current.id === id) {
    setCurrentUser(users[index]);
  }
  return users[index];
}

// Services
export function getServices(): ServiceItem[] {
  return load<ServiceItem[]>('services', INITIAL_SERVICES);
}

export function saveServices(services: ServiceItem[]): void {
  save('services', services);
}

// Estimator Rules
export function getEstimatorRules(): EstimatorRule[] {
  return load<EstimatorRule[]>('estimator_rules', INITIAL_ESTIMATOR_RULES);
}

export function saveEstimatorRules(rules: EstimatorRule[]): void {
  save('estimator_rules', rules);
}

// Leads
export function getLeads(): Lead[] {
  return load<Lead[]>('leads', INITIAL_LEADS);
}

export function addLead(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...data,
    id: 'lead_' + Date.now().toString(36),
    createdAt: new Date().toISOString()
  };
  leads.unshift(newLead);
  save('leads', leads);

  // Trigger admin notification
  addNotification({
    roleTarget: 'admin',
    title: 'Lead Baru Masuk',
    message: `Lead dari ${newLead.name} (${newLead.companyName || 'Perorangan'}) senilai Rp ${newLead.estimatedPrice.toLocaleString('id-ID')}`,
    type: 'lead',
    link: '/admin/lead',
    isRead: false
  });

  // Log activity
  logActivity({
    action: 'LEAD_SUBMITTED',
    entityType: 'lead',
    entityId: newLead.id,
    meta: { name: newLead.name, price: newLead.estimatedPrice, source: newLead.source }
  });

  return newLead;
}

export function updateLeadStatus(id: string, status: Lead['status']): void {
  const leads = getLeads();
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  lead.status = status;
  save('leads', leads);

  logActivity({
    action: `LEAD_STATUS_CHANGED_TO_${status.toUpperCase()}`,
    entityType: 'lead',
    entityId: id,
    meta: { status, leadName: lead.name }
  });
}

// Convert Lead to Project
export function convertLeadToProject(leadId: string): Project | null {
  const leads = getLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return null;

  const projects = getProjects();
  const newProjectId = 'prj_' + Date.now().toString(36);

  const newProject: Project = {
    id: newProjectId,
    clientId: 'usr_client_01', // defaults to client account
    clientName: `${lead.name} (${lead.companyName || 'Klien Baru'})`,
    name: `Proyek ${lead.serviceName}`,
    slug: `proyek-${Date.now()}`,
    description: `Proyek hasil konversi lead #${leadId}. ${lead.notes || ''}`,
    serviceId: lead.serviceId,
    status: 'In Progress',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: lead.estimatedPrice,
    currency: lead.currency || 'IDR',
    progressPercent: 15,
    assignedStaffIds: ['usr_staff_01', 'usr_admin_01'],
    createdAt: new Date().toISOString()
  };

  projects.unshift(newProject);
  save('projects', projects);

  // Update lead
  lead.status = 'Won';
  lead.convertedProjectId = newProjectId;
  save('leads', leads);

  // Auto create initial milestones
  const allMilestones = getMilestones();
  const defaultMilestones: Milestone[] = [
    {
      id: 'mls_' + Date.now().toString(36) + '_1',
      projectId: newProjectId,
      title: 'Kickoff & Spesifikasi SOW',
      description: 'Review ruang lingkup kerja dan approval kontrak.',
      status: 'In Progress',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 1
    },
    {
      id: 'mls_' + Date.now().toString(36) + '_2',
      projectId: newProjectId,
      title: 'UI/UX Design & Prototype',
      description: 'Pembuatan wireframe, komponen design system dan user flow.',
      status: 'Pending',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 2
    },
    {
      id: 'mls_' + Date.now().toString(36) + '_3',
      projectId: newProjectId,
      title: 'Development & Security Hardening',
      description: 'Implementasi kode, 2FA, dan pengujian enkripsi data.',
      status: 'Pending',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 3
    }
  ];
  save('milestones', [...defaultMilestones, ...allMilestones]);

  // Auto create initial Invoice (DP 50%)
  const dpAmount = Math.round(lead.estimatedPrice * 0.5);
  createInvoice({
    projectId: newProjectId,
    projectName: newProject.name,
    clientId: newProject.clientId,
    clientName: newProject.clientName,
    amount: dpAmount,
    currency: newProject.currency,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        description: `Termin 1 (DP 50%): Kickoff & Arsitektur ${newProject.name}`,
        quantity: 1,
        unitPrice: dpAmount,
        total: dpAmount
      }
    ]
  });

  // Auto create draft Contract
  const contracts = getContracts();
  const newContract: Contract = {
    id: 'ctr_' + Date.now().toString(36),
    projectId: newProjectId,
    projectName: newProject.name,
    clientId: newProject.clientId,
    clientName: newProject.clientName,
    title: `Perjanjian Kerja Sama: ${newProject.name}`,
    content: `SURAT PERJANJIAN KERJA SAMA PENGEMBANGAN SISTEM DIGITAL\n\nAntara NEXA Digital Agency dan ${newProject.clientName}.\nTotal Anggaran: Rp ${newProject.budget.toLocaleString('id-ID')}.\n\nPasal 1: Ruang Lingkup\nPihak Pertama menyediakan pengembangan sistem sesuai kebutuhan teknis yang disetujui.\n\nPasal 2: Keamanan & Enkripsi\nPlatform mengimplementasikan autentikasi dua faktor (2FA) dan enkripsi AES-GCM 256-bit untuk proteksi kerahasiaan informasi pengguna.`,
    scopePoints: [
      'Penyelesaian 3 Fase Milestone',
      'Proteksi Enkripsi E2E dan 2FA',
      'Dukungan SLA Teknis dan Garansi 60 Hari'
    ],
    totalValue: newProject.budget,
    currency: newProject.currency,
    status: 'Pending Signature',
    createdAt: new Date().toISOString()
  };
  contracts.unshift(newContract);
  save('contracts', contracts);

  logActivity({
    action: 'LEAD_CONVERTED_TO_PROJECT',
    entityType: 'project',
    entityId: newProjectId,
    meta: { leadId, projectName: newProject.name, budget: newProject.budget }
  });

  return newProject;
}

// Projects
export function getProjects(): Project[] {
  return load<Project[]>('projects', INITIAL_PROJECTS);
}

export function updateProject(id: string, updates: Partial<Project>): void {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return;
  projects[index] = { ...projects[index], ...updates };
  save('projects', projects);
}

// Milestones
export function getMilestones(projectId?: string): Milestone[] {
  const all = load<Milestone[]>('milestones', INITIAL_MILESTONES);
  if (projectId) {
    return all.filter(m => m.projectId === projectId).sort((a, b) => a.order - b.order);
  }
  return all;
}

export function updateMilestoneStatus(id: string, status: Milestone['status']): void {
  const all = getMilestones();
  const item = all.find(m => m.id === id);
  if (!item) return;
  item.status = status;
  if (status === 'Completed') {
    item.completedAt = new Date().toISOString();
  }
  save('milestones', all);

  // Recalculate project progress
  const projectMilestones = all.filter(m => m.projectId === item.projectId);
  const completed = projectMilestones.filter(m => m.status === 'Completed').length;
  const progressPercent = Math.round((completed / projectMilestones.length) * 100);
  updateProject(item.projectId, { progressPercent });

  logActivity({
    action: `MILESTONE_UPDATED_${status.toUpperCase()}`,
    entityType: 'project',
    entityId: item.projectId,
    meta: { milestoneId: id, milestoneTitle: item.title, newProgress: progressPercent }
  });

  addNotification({
    roleTarget: 'client',
    title: 'Update Milestone Proyek',
    message: `Milestone "${item.title}" kini berstatus ${status}. Progres proyek: ${progressPercent}%.`,
    type: 'project',
    link: `/portal/proyek/${item.projectId}`,
    isRead: false
  });
}

// Deliverables
export function getDeliverables(projectId?: string): Deliverable[] {
  const all = load<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
  if (projectId) {
    return all.filter(d => d.projectId === projectId);
  }
  return all;
}

export function addDeliverable(item: Omit<Deliverable, 'id' | 'uploadedAt'>): Deliverable {
  const all = getDeliverables();
  const newItem: Deliverable = {
    ...item,
    id: 'dlv_' + Date.now().toString(36),
    uploadedAt: new Date().toISOString()
  };
  all.unshift(newItem);
  save('deliverables', all);

  addNotification({
    roleTarget: 'client',
    title: 'File Deliverable Baru',
    message: `File baru "${newItem.title}" (${newItem.fileSize}) telah diunggah ke proyek.`,
    type: 'project',
    link: `/portal/proyek/${newItem.projectId}`,
    isRead: false
  });

  logActivity({
    action: 'DELIVERABLE_UPLOADED',
    entityType: 'project',
    entityId: newItem.projectId,
    meta: { fileTitle: newItem.title, size: newItem.fileSize }
  });

  return newItem;
}

// Invoices
export function getInvoices(clientId?: string): Invoice[] {
  const all = load<Invoice[]>('invoices', INITIAL_INVOICES);
  if (clientId) {
    return all.filter(i => i.clientId === clientId);
  }
  return all;
}

export function createInvoice(data: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'createdAt'>): Invoice {
  const all = getInvoices();
  const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
  const seq = (all.length + 1).toString().padStart(3, '0');
  const invoiceNumber = `INV-${yearMonth}-${seq}`;

  const newInvoice: Invoice = {
    ...data,
    id: 'inv_' + Date.now().toString(36),
    invoiceNumber,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  all.unshift(newInvoice);
  save('invoices', all);

  addNotification({
    userId: newInvoice.clientId,
    roleTarget: 'client',
    title: 'Invoice Diterbitkan',
    message: `Invoice #${invoiceNumber} sebesar Rp ${newInvoice.amount.toLocaleString('id-ID')} telah diterbitkan. Jatuh tempo: ${newInvoice.dueDate}.`,
    type: 'invoice',
    link: '/portal/invoice',
    isRead: false
  });

  logActivity({
    action: 'INVOICE_CREATED',
    entityType: 'invoice',
    entityId: newInvoice.id,
    meta: { invoiceNumber, amount: newInvoice.amount, clientName: newInvoice.clientName }
  });

  return newInvoice;
}

export function markInvoicePaid(invoiceId: string, paymentMethod: Invoice['paymentMethod']): void {
  const all = getInvoices();
  const inv = all.find(i => i.id === invoiceId);
  if (!inv) return;
  inv.status = 'Paid';
  inv.paymentMethod = paymentMethod;
  inv.paidAt = new Date().toISOString();
  save('invoices', all);

  addNotification({
    userId: inv.clientId,
    roleTarget: 'client',
    title: 'Pembayaran Dikonfirmasi Lunas',
    message: `Pembayaran untuk Invoice #${inv.invoiceNumber} telah berhasil diverifikasi.`,
    type: 'invoice',
    link: '/portal/invoice',
    isRead: false
  });

  logActivity({
    action: 'INVOICE_PAID',
    entityType: 'invoice',
    entityId: invoiceId,
    meta: { invoiceNumber: inv.invoiceNumber, amount: inv.amount, paymentMethod }
  });
}

// Payment Proofs
export function getPaymentProofs(): PaymentProof[] {
  return load<PaymentProof[]>('payment_proofs', INITIAL_PAYMENT_PROOFS);
}

export function submitPaymentProof(data: Omit<PaymentProof, 'id' | 'status' | 'createdAt'>): PaymentProof {
  const all = getPaymentProofs();
  const newProof: PaymentProof = {
    ...data,
    id: 'proof_' + Date.now().toString(36),
    status: 'Pending Review',
    createdAt: new Date().toISOString()
  };
  all.unshift(newProof);
  save('payment_proofs', all);

  addNotification({
    roleTarget: 'admin',
    title: 'Bukti Pembayaran Baru Diunggah',
    message: `${newProof.clientName} mengunggah bukti transfer Bank ${newProof.bankName} untuk Invoice #${newProof.invoiceNumber}.`,
    type: 'invoice',
    link: '/admin/invoice',
    isRead: false
  });

  logActivity({
    action: 'PAYMENT_PROOF_SUBMITTED',
    entityType: 'invoice',
    entityId: newProof.invoiceId,
    meta: { proofId: newProof.id, bank: newProof.bankName, amount: newProof.amount }
  });

  return newProof;
}

export function reviewPaymentProof(proofId: string, status: 'Approved' | 'Rejected', reviewer: string, notes?: string): void {
  const all = getPaymentProofs();
  const proof = all.find(p => p.id === proofId);
  if (!proof) return;
  proof.status = status;
  proof.reviewedBy = reviewer;
  proof.reviewNotes = notes;
  save('payment_proofs', all);

  if (status === 'Approved') {
    markInvoicePaid(proof.invoiceId, 'Manual Transfer');
  } else {
    addNotification({
      userId: proof.clientId,
      roleTarget: 'client',
      title: 'Bukti Pembayaran Perlu Diperiksa',
      message: `Bukti transfer untuk #${proof.invoiceNumber} ditolak: ${notes || 'Data transfer tidak cocok.'}`,
      type: 'invoice',
      link: '/portal/invoice',
      isRead: false
    });
  }

  logActivity({
    action: `PAYMENT_PROOF_${status.toUpperCase()}`,
    entityType: 'invoice',
    entityId: proof.invoiceId,
    meta: { proofId, status, reviewer, notes }
  });
}

// Contracts
export function getContracts(clientId?: string): Contract[] {
  const all = load<Contract[]>('contracts', INITIAL_CONTRACTS);
  if (clientId) {
    return all.filter(c => c.clientId === clientId);
  }
  return all;
}

export async function signContract(
  contractId: string,
  signatureData: string,
  type: 'draw' | 'type',
  signerName: string
): Promise<Contract | null> {
  const all = getContracts();
  const contract = all.find(c => c.id === contractId);
  if (!contract) return null;

  const now = new Date().toISOString();
  const signerIp = '180.252.164.' + Math.floor(Math.random() * 200 + 10);
  const seal = await generateContractSeal(contractId, signerName, signerIp, now);

  contract.status = 'Signed';
  contract.signedAt = now;
  contract.signatureData = signatureData;
  contract.signatureType = type;
  contract.signerIp = signerIp;
  contract.signerHash = seal;
  save('contracts', all);

  addNotification({
    roleTarget: 'admin',
    title: 'Kontrak Ditandatangani Klien',
    message: `${contract.clientName} telah menandatangani digital SOW untuk proyek "${contract.projectName}" (${seal}).`,
    type: 'contract',
    link: '/admin/kontrak',
    isRead: false
  });

  logActivity({
    action: 'CONTRACT_DIGITAL_SIGNED',
    entityType: 'contract',
    entityId: contractId,
    meta: { seal, signerName, signerIp, totalValue: contract.totalValue }
  });

  return contract;
}

// Messages
export function getMessages(projectId: string): ProjectMessage[] {
  const all = load<ProjectMessage[]>('messages', INITIAL_MESSAGES);
  return all.filter(m => m.projectId === projectId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function sendMessage(item: Omit<ProjectMessage, 'id' | 'createdAt'>): ProjectMessage {
  const all = load<ProjectMessage[]>('messages', INITIAL_MESSAGES);
  const newMsg: ProjectMessage = {
    ...item,
    id: 'msg_' + Date.now().toString(36),
    createdAt: new Date().toISOString()
  };
  all.push(newMsg);
  save('messages', all);
  return newMsg;
}

// Notifications
export function getNotifications(userRole?: string, userId?: string): NotificationItem[] {
  const all = load<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
  return all.filter(n => {
    if (userId && n.userId === userId) return true;
    if (userRole && (n.roleTarget === userRole || n.roleTarget === 'all' || !n.roleTarget)) return true;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNotification(item: Omit<NotificationItem, 'id' | 'createdAt'>): void {
  const all = load<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
  const newItem: NotificationItem = {
    ...item,
    id: 'notif_' + Date.now().toString(36),
    createdAt: new Date().toISOString()
  };
  all.unshift(newItem);
  save('notifications', all);
}

export function markNotificationRead(id: string): void {
  const all = load<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
  const item = all.find(n => n.id === id);
  if (item) {
    item.isRead = true;
    save('notifications', all);
  }
}

export function markAllNotificationsRead(): void {
  const all = load<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
  all.forEach(n => (n.isRead = true));
  save('notifications', all);
}

// Support Tickets
export function getSupportTickets(userEmail?: string): SupportTicket[] {
  const all = load<SupportTicket[]>('support_tickets', INITIAL_SUPPORT_TICKETS);
  if (userEmail) {
    return all.filter(t => t.requesterEmail.toLowerCase() === userEmail.toLowerCase());
  }
  return all;
}

export function createSupportTicket(data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'messages' | 'createdAt' | 'updatedAt'> & { initialMessage: string }): SupportTicket {
  const all = load<SupportTicket[]>('support_tickets', INITIAL_SUPPORT_TICKETS);
  const ticketNumber = `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900 + 100)}`;
  const now = new Date().toISOString();

  const newTicket: SupportTicket = {
    id: 'tkt_' + Date.now().toString(36),
    ticketNumber,
    requesterName: data.requesterName,
    requesterEmail: data.requesterEmail,
    role: data.role,
    subject: data.subject,
    category: data.category,
    priority: data.priority,
    status: 'Open',
    messages: [
      {
        id: 'msg_1',
        sender: data.requesterName,
        role: data.role,
        text: data.initialMessage,
        timestamp: now
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  all.unshift(newTicket);
  save('support_tickets', all);

  addNotification({
    roleTarget: 'admin',
    title: 'Tiket Support Baru',
    message: `[${newTicket.priority}] ${newTicket.subject} dari ${newTicket.requesterName}`,
    type: 'system',
    link: '/portal/support',
    isRead: false
  });

  logActivity({
    action: 'SUPPORT_TICKET_CREATED',
    entityType: 'ticket',
    entityId: newTicket.id,
    meta: { ticketNumber, priority: newTicket.priority, category: newTicket.category }
  });

  return newTicket;
}

export function replySupportTicket(ticketId: string, text: string, sender: string, role: string): void {
  const all = load<SupportTicket[]>('support_tickets', INITIAL_SUPPORT_TICKETS);
  const ticket = all.find(t => t.id === ticketId);
  if (!ticket) return;

  const now = new Date().toISOString();
  ticket.messages.push({
    id: 'msg_' + Date.now().toString(36),
    sender,
    role,
    text,
    timestamp: now
  });
  ticket.updatedAt = now;
  if (role === 'admin' || role === 'staff') {
    ticket.status = 'In Progress';
  }
  save('support_tickets', all);

  logActivity({
    action: 'SUPPORT_TICKET_REPLIED',
    entityType: 'ticket',
    entityId: ticketId,
    meta: { sender, role }
  });
}

// Centralized Activity Logs with SHA-256 Hash Chain
export function getActivityLogs(): ActivityLog[] {
  return load<ActivityLog[]>('activity_logs', INITIAL_ACTIVITY_LOGS);
}

export async function logActivity(params: {
  action: string;
  entityType: ActivityLog['entityType'];
  entityId: string;
  meta: Record<string, unknown>;
  ipAddress?: string;
}): Promise<void> {
  const logs = getActivityLogs();
  const user = getCurrentUser();
  const prevLog = logs[0];
  const prevHash = prevLog ? prevLog.integrityHash : 'GENESIS_CHAIN_NEXA_SECURITY_SALT';

  const now = new Date().toISOString();
  const metaJson = JSON.stringify(params.meta);
  const ipAddress = params.ipAddress || '180.252.164.12';
  const userAgent = navigator.userAgent;

  // Cryptographic hash chain: SHA-256(prevHash + action + timestamp + metaJson)
  const integrityPayload = `${prevHash}|${params.action}|${now}|${metaJson}|${ipAddress}`;
  const integrityHash = await generateSha256(integrityPayload);

  const newLog: ActivityLog = {
    id: 'act_' + Date.now().toString(36),
    userId: user ? user.id : 'usr_system',
    userName: user ? user.name : 'System Automator',
    userRole: user ? user.role : 'visitor',
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    metaJson,
    ipAddress,
    userAgent,
    prevHash,
    integrityHash,
    createdAt: now
  };

  logs.unshift(newLog);
  // Keep last 100 logs
  if (logs.length > 100) logs.length = 100;
  save('activity_logs', logs);
}

// Portfolio & Blog & Testimonials
export function getPortfolio(): PortfolioItem[] {
  return load<PortfolioItem[]>('portfolio', INITIAL_PORTFOLIO);
}

export function savePortfolio(items: PortfolioItem[]): void {
  save('portfolio', items);
}

export function getBlog(): BlogPost[] {
  return load<BlogPost[]>('blog', INITIAL_BLOG);
}

export function saveBlog(items: BlogPost[]): void {
  save('blog', items);
}

export function getTestimonials(): TestimonialItem[] {
  return load<TestimonialItem[]>('testimonials', INITIAL_TESTIMONIALS);
}

export function saveTestimonials(items: TestimonialItem[]): void {
  save('testimonials', items);
}

// API Keys & Integrations
export function getApiKeys(): ApiKeyItem[] {
  return load<ApiKeyItem[]>('api_keys', INITIAL_API_KEYS);
}

export function createApiKey(name: string, scopes: string[], rateLimitPerMin = 100): ApiKeyItem {
  const keys = getApiKeys();
  const rawKey = 'pk_live_' + Array.from(window.crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');
  const newKey: ApiKeyItem = {
    id: 'key_' + Date.now().toString(36),
    name,
    keyPrefix: rawKey.slice(0, 12),
    rawKeyMasked: rawKey.slice(0, 12) + '************************' + rawKey.slice(-4),
    scopes,
    rateLimitPerMin,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  keys.unshift(newKey);
  save('api_keys', keys);

  logActivity({
    action: 'API_KEY_CREATED',
    entityType: 'system',
    entityId: newKey.id,
    meta: { keyName: name, scopes, rateLimitPerMin }
  });

  return newKey;
}

export function toggleApiKey(id: string): void {
  const keys = getApiKeys();
  const key = keys.find(k => k.id === id);
  if (key) {
    key.isActive = !key.isActive;
    save('api_keys', keys);
  }
}

// Live Sessions (Monitoring)
export function getLiveSessions(): LiveSessionUser[] {
  return load<LiveSessionUser[]>('live_sessions', INITIAL_LIVE_SESSIONS);
}

// System Health & Auto-scaling Telemetry
let customSystemMetrics: any = null;

export function getSystemTelemetry(): SystemHealthMetrics {
  if (customSystemMetrics) return customSystemMetrics;
  return {
    cpuUsage: 28.4 + Math.sin(Date.now() / 8000) * 12,
    memoryUsage: 44.1 + Math.cos(Date.now() / 10000) * 8,
    requestsPerSec: Math.floor(180 + Math.sin(Date.now() / 5000) * 45),
    activeInstances: 3,
    avgLatencyMs: 24.8 + Math.random() * 4,
    autoScalingStatus: 'Optimal'
  };
}

export function getSystemHealth() {
  const t = getSystemTelemetry();
  return {
    ...t,
    cpuUsagePercent: Math.round(t.cpuUsage),
    memoryUsagePercent: Math.round(t.memoryUsage),
    requestsPerSecond: t.requestsPerSec,
    activeReplicas: t.activeInstances,
    uptimeSla: 99.98,
    databaseLatencyMs: Math.round(t.avgLatencyMs)
  };
}

export function updateSystemHealth(updates: any): void {
  const current = getSystemTelemetry();
  customSystemMetrics = {
    ...current,
    cpuUsage: updates.cpuUsagePercent ?? current.cpuUsage,
    memoryUsage: updates.memoryUsagePercent ?? current.memoryUsage,
    requestsPerSec: updates.requestsPerSecond ?? current.requestsPerSec,
    activeInstances: updates.activeReplicas ?? current.activeInstances,
    avgLatencyMs: updates.databaseLatencyMs ?? current.avgLatencyMs
  };
  window.dispatchEvent(new CustomEvent('nexa_storage_update', { detail: { key: 'system_health' } }));
}

// Aliases
export const getBlogPosts = getBlog;
export const setUsers = saveUsers;
export const setEstimatorRules = saveEstimatorRules;
export const getProjectMessages = getMessages;
export const addProjectMessage = sendMessage;

export function updateInvoiceStatus(id: string, status: Invoice['status']): void {
  const all = getInvoices();
  const inv = all.find(i => i.id === id);
  if (!inv) return;
  inv.status = status;
  if (status === 'Paid') inv.paidAt = new Date().toISOString();
  save('invoices', all);
}

export function addApiKey(name: string, scopes: string[]) {
  return createApiKey(name, scopes);
}

export function revokeApiKey(id: string) {
  return toggleApiKey(id);
}

export function addSupportTicket(data: {
  clientId?: string;
  clientName?: string;
  title: string;
  category: any;
  priority: any;
  status: any;
  messages: Array<{
    id: string;
    senderId?: string;
    senderName?: string;
    senderRole?: string;
    message: string;
    createdAt?: string;
  }>;
}) {
  return createSupportTicket({
    requesterName: data.clientName || 'Klien',
    requesterEmail: 'client@example.com',
    role: 'client',
    subject: data.title,
    category: data.category === 'Security' ? 'Security / 2FA' : 'Technical Bug',
    priority: data.priority,
    status: data.status,
    initialMessage: data.messages[0]?.message || data.title
  });
}

export function addTicketMessage(ticketId: string, data: {
  senderId?: string;
  senderName?: string;
  senderRole?: string;
  message: string;
}) {
  return replySupportTicket(ticketId, data.message, data.senderName || 'Staff', data.senderRole || 'staff');
}

export function updateTicketStatus(ticketId: string, status: SupportTicket['status']) {
  const all = load<SupportTicket[]>('support_tickets', INITIAL_SUPPORT_TICKETS);
  const ticket = all.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = status;
    save('support_tickets', all);
  }
}

