/**
 * Data types and interfaces for the Digital Agency Platform
 */

export type UserRole = 'visitor' | 'client' | 'staff' | 'admin' | 'superadmin';

export type LanguageCode = 'id' | 'en' | 'my';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string; // e.g. "Full Stack Developer", "System Analyst", "IT Support & Infrastructure", "Enterprise & UI/UX"
  avatarUrl?: string;
  twoFaEnabled: boolean;
  twoFaSecret?: string;
  phone?: string;
  companyName?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  companyName: string;
  phone: string;
  industry: string;
  taxId?: string;
  address?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDesc: string;
  basePrice: number;
  currency: string;
  estimatedWeeks: number;
  isActive: boolean;
  features: string[];
  iconName: string;
}

export interface EstimatorRule {
  id: string;
  serviceId: string;
  category: 'scope' | 'platform' | 'security' | 'integration' | 'support';
  optionLabel: string;
  description: string;
  priceModifier: number; // in IDR
  deliveryDaysModifier: number;
  isDefault?: boolean;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  serviceId: string;
  serviceName: string;
  selectedOptionIds: string[];
  estimatedPrice: number;
  currency: string;
  status: LeadStatus;
  source: 'Estimator' | 'Contact Form' | 'Calendar Booking';
  bookingDate?: string;
  bookingTime?: string;
  notes?: string;
  createdAt: string;
  convertedProjectId?: string;
}

export type ProjectStatus = 'Draft' | 'In Progress' | 'Review' | 'Completed' | 'Maintenance';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  slug: string;
  description: string;
  serviceId: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  progressPercent: number;
  assignedStaffIds: string[];
  encryptedNotes?: string;
  createdAt: string;
}

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
  completedAt?: string;
  order: number;
}

export interface Deliverable {
  id: string;
  projectId: string;
  title: string;
  fileUrl: string;
  fileType: 'design' | 'code' | 'document' | 'report' | 'archive';
  fileSize: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethod?: 'Manual Transfer' | 'Billplz / Stripe Gateway';
  dueDate: string;
  paidAt?: string;
  pdfUrl?: string;
  items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  createdAt: string;
}

export interface PaymentProof {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  fileUrl: string;
  bankName: string;
  accountName: string;
  transferDate: string;
  amount: number;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
}

export type ContractStatus = 'Draft' | 'Pending Signature' | 'Signed';

export interface Contract {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  title: string;
  content: string;
  scopePoints: string[];
  totalValue: number;
  currency: string;
  status: ContractStatus;
  signedAt?: string;
  signatureData?: string; // base64 or drawn svg or typed text
  signatureType?: 'draw' | 'type';
  signerIp?: string;
  signerHash?: string; // SHA-256 cryptographic seal
  createdAt: string;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  isEncrypted: boolean;
  iv?: string; // Hex IV for AES-GCM
  keyFingerprint?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget?: UserRole | 'all';
  title: string;
  message: string;
  type: 'project' | 'invoice' | 'contract' | 'system' | 'lead';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  requesterName: string;
  requesterEmail: string;
  role: UserRole;
  subject: string;
  category: 'Technical Bug' | 'Feature Request' | 'Billing / Invoice' | 'Consultation' | 'Security / 2FA';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  messages: Array<{
    id: string;
    sender: string;
    role: string;
    text: string;
    timestamp: string;
    isEncrypted?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  client: string;
  resultMetric: string;
  metricLabel: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  isPublished: boolean;
  testimonialQuote?: string;
  testimonialAuthor?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  companyName: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  projectName: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'lead' | 'project' | 'invoice' | 'contract' | 'user' | 'auth' | 'system' | 'ticket';
  entityId: string;
  metaJson: string;
  ipAddress: string;
  userAgent: string;
  prevHash: string;
  integrityHash: string; // SHA-256(prevHash + action + timestamp + payload)
  createdAt: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  rawKeyMasked: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  rateLimitPerMin: number;
  isActive: boolean;
}

export interface LiveSessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ipAddress: string;
  location: string;
  browser: string;
  activePath: string;
  lastPing: string;
  is2FAVerified: boolean;
}

export interface SystemHealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  requestsPerSec: number;
  activeInstances: number;
  avgLatencyMs: number;
  autoScalingStatus: 'Optimal' | 'Scaling Up' | 'Stabilized';
}
