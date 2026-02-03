import { PaginationParams, PaginationResponse } from '../../core/common.types';

// ============= Status Types =============
export type POStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'overdue';

export type InvoiceStatus =
  | 'draft'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export type DeliveryStatus =
  | 'not_started'
  | 'in_transit'
  | 'partially_delivered'
  | 'delivered'
  | 'delayed';

export type RecipientType = 'vendor' | 'professional';

export type VendorResponseStatus = 'pending' | 'accepted' | 'rejected' | 'negotiating';

// ============= Main Purchase Order Interface =============
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  requirementId: string;
  quotationId: string;

  // Recipient Info
  recipientType?: RecipientType;
  recipientId?: string;

  // Financial details
  status: POStatus;
  amount: number;
  taxPercentage: number;
  taxAmount: number;
  totalValue: number;
  currency: string;
  paymentTerms: string;

  // Project details
  projectTitle: string;
  scopeOfWork: string;
  specialInstructions?: string;

  // Timeline
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  completedAt?: string;
  sentToVendorAt?: string;

  // Progress tracking
  completionPercentage: number;
  milestonesCompleted: number;
  milestonesPending: number;
  totalMilestones: number;

  // Summary counts
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;

  // Vendor Response
  vendorResponseStatus?: VendorResponseStatus;
  acceptanceDeadline?: string;
}

// ============= Detailed Purchase Order (with relations) =============
export interface PurchaseOrderDetail extends PurchaseOrder {
  vendor: VendorInfo;
  requirement: RequirementInfo;
  quotation: QuotationInfo;
  deliverables: Deliverable[];
  paymentMilestones: PaymentMilestone[];
  acceptanceCriteria: AcceptanceCriteria[];
  invoices: Invoice[];
  deliveryTracking: DeliveryTracking;
  documents: Document[];
  activityLog: ActivityLog[];
  approvalWorkflow: ApprovalWorkflow;
  isoCompliance?: ISOCompliance | null;

  // Optional fields for backward compatibility and legacy support
  poNumber?: string;  // Display-friendly PO number
  milestones?: PaymentMilestone[];  // Legacy alias for paymentMilestones
  vendorEmail?: string;  // Flattened vendor email
  vendorPhone?: string;  // Flattened vendor phone
  subtotal?: number;  // Pre-tax subtotal
  gstRate?: number;  // GST/Tax rate percentage
  termsConditions?: string;  // Terms and conditions text
  vendorResponse?: VendorResponse;
}


// ============= ISO Compliance =============
export interface ISOCompliance {
  termsAndConditions: string[];
  qualityRequirements: string[];
  warrantyPeriod: string;
  penaltyClause: string;
}

// ============= Vendor Response =============
export interface VendorResponse {
  status: VendorResponseStatus;
  respondedAt?: string;
  respondedBy?: string;
  comments?: string;
  digitalSignature?: {
    signedBy: string;
    designation: string;
    signedAt: string;
  };
  negotiationNotes?: string;
  negotiationHistory?: NegotiationItem[];
}

export interface NegotiationItem {
  field: string;
  originalValue: any;
  proposedValue: any;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  respondedAt?: string;
}

// ============= Related Entity Types =============
export interface VendorInfo {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  type?: RecipientType;
  gstin?: string;
  address?: string;
}

export interface RequirementInfo {
  id: string;
  title: string;
  category: string;
  priority: string;
}

export interface QuotationInfo {
  id: string;
  quoteNumber: string;
  amount: number;
  validUntil: string;
}

export interface Deliverable {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'in_progress' | 'delivered';

  // Legacy aliases for backward compatibility
  rate?: number;  // Alias for unitPrice
  amount?: number;  // Alias for totalPrice
  specifications?: string;
}

export interface PaymentMilestone {
  id: string;
  name?: string;
  description: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  completedAt?: string;
  proofDocuments?: Document[];
  invoiceId?: string;

  //Legacy aliases
  milestoneName?: string;  // Alias for name
  title?: string;  // Another alias for name
}

export interface AcceptanceCriteriaDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt?: string;
}

export interface AcceptanceCriteria {
  id: string;
  criteria: string;
  status: 'pending' | 'met' | 'failed';
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  documents?: AcceptanceCriteriaDocument[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  milestoneId: string;
  milestoneName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  documents: Document[];
}

export interface DeliveryTracking {
  status: DeliveryStatus;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  delayReason?: string;
  currentLocation?: string;
  estimatedArrival?: string;
  trackingNumber?: string;
  carrier?: string;
  events: DeliveryEvent[];
  proofOfDelivery?: Document;
}

export interface DeliveryEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
  updatedBy: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  performedByName: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface ApprovalWorkflow {
  currentStep: number;
  totalSteps: number;
  approvers: Array<{
    id: string;
    name: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    timestamp?: string;
  }>;
}

// ============= PO Subscription Limit =============
export interface POLimitStatus {
  canGenerate: boolean;
  used: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
  periodStart: string;
  periodEnd: string;
  resetDate: string;
  planName: string;
  warningThreshold: number;
  isWarning: boolean;
  upgradeOptions?: UpgradeOption[];
}

export interface UpgradeOption {
  planCode: string;
  planName: string;
  poLimit: number | 'unlimited';
  monthlyPrice: number;
}

// ============= PO Pre-fill from Quotation =============
export interface POPrefillData {
  quotationId: string;
  quotationNumber: string;
  requirementId: string;
  requirementTitle: string;
  vendor: {
    id: string;
    type: RecipientType;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    gstin?: string;
    address?: string;
  };
  financial: {
    subtotal: number;
    taxPercentage: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    validUntil: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    specifications?: string;
  }>;
  proposedDeliveryDays: number;
  suggestedStartDate: string;
  suggestedEndDate: string;
  proposalSummary?: string; // For Scope of Work pre-fill
  termsFromQuotation: {
    paymentTerms: string;
    warrantyPeriod?: string;
    deliveryTerms?: string;
  };
}

// ============= Request Types =============
export interface CreatePORequest {
  quotationId: string;
  projectTitle: string;
  scopeOfWork: string;
  specialInstructions?: string;
  startDate: string;
  endDate: string;
  paymentTerms: string;
  deliverables: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
  paymentMilestones: Array<{
    name?: string;
    description: string;
    percentage: number;
    dueDate: string;
  }>;
  acceptanceCriteria: Array<{
    criteria: string;
  }>;
  isoCompliance?: {
    termsAndConditions?: string[];
    qualityRequirements?: string[];
    warrantyPeriod?: string;
    penaltyClause?: string;
  };
  saveAsDraft?: boolean;
}

export interface UpdatePORequest {
  projectTitle?: string;
  scopeOfWork?: string;
  specialInstructions?: string;
  startDate?: string;
  endDate?: string;
  paymentTerms?: string;
  deliverables?: Array<{
    id?: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
  paymentMilestones?: Array<{
    id?: string;
    name?: string;
    description: string;
    percentage: number;
    dueDate: string;
  }>;
  acceptanceCriteria?: Array<{
    id?: string;
    criteria: string;
  }>;
  isoCompliance?: {
    termsAndConditions?: string[];
    qualityRequirements?: string[];
    warrantyPeriod?: string;
    penaltyClause?: string;
  };
}

export interface SendPORequest {
  message?: string;
  notifyViaEmail?: boolean;
  notifyViaPlatform?: boolean;
  requireDigitalAcceptance?: boolean;
  acceptanceDeadline?: string;
}

export interface CancelPORequest {
  reason: string;
  cancelledBy: string;
}

export interface ApprovePORequest {
  comments?: string;
}

export interface RejectPORequest {
  reason: string;
}

export interface MilestoneUpdateRequest {
  status?: MilestoneStatus;
  completedAt?: string;
  notes?: string;
}

export interface InvoiceCreateRequest {
  milestoneId: string;
  invoiceNumber: string;
  issuedAt: string;
  dueDate: string;
}

export interface InvoiceUpdateRequest {
  status?: InvoiceStatus;
  dueDate?: string;
}

export interface MarkInvoicePaidRequest {
  paidAt: string;
  paymentMethod: string;
  paymentReference: string;
}

export interface DeliveryUpdateRequest {
  status: DeliveryStatus;
  location?: string;
  description: string;
  estimatedArrival?: string;
  delayReason?: string;
}

export interface ExportPDFOptions {
  includeTerms?: boolean;
  includeSignature?: boolean;
  template?: 'standard' | 'detailed' | 'compact';
}

export interface ExportXLSXRequest {
  orderIds?: string[];
  status?: POStatus;
  dateFrom?: string;
  dateTo?: string;
}

// ============= Vendor Response Types =============
export interface VendorPOResponseRequest {
  action: 'accept' | 'reject' | 'negotiate';
  comments?: string;
  reason?: string;
  estimatedCompletionDate?: string;
  digitalSignature?: {
    signedBy: string;
    designation: string;
  };
  negotiationPoints?: Array<{
    field: string;
    currentValue: any;
    proposedValue: any;
    reason: string;
  }>;
  alternativeProposal?: {
    suggestedStartDate?: string;
    suggestedEndDate?: string;
  };
}

// ============= Response Types =============
export interface POListResponse {
  success: boolean;
  data: PurchaseOrder[];
  pagination: PaginationResponse;
  summary: {
    totalOrders: number;
    totalValue: number;
    activeOrders: number;
    completedOrders: number;
    usageThisMonth?: {
      used: number;
      limit: number | 'unlimited';
      remaining: number | 'unlimited';
    };
  };
}

export interface PODetailResponse {
  success: boolean;
  data: PurchaseOrderDetail;
}

export interface POLimitResponse {
  success: boolean;
  data: POLimitStatus;
}

export interface POPrefillResponse {
  success: boolean;
  data: POPrefillData;
}

export interface POCreateResponse {
  success: boolean;
  data: {
    id: string;
    poNumber: string;
    status: POStatus;
    quotation: {
      id: string;
      quotationNumber: string;
      vendorName: string;
    };
    recipientType: RecipientType;
    recipientId: string;
    projectTitle: string;
    subtotal: number;
    taxPercentage: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    createdAt: string;
    usageInfo: {
      used: number;
      limit: number | 'unlimited';
      remaining: number | 'unlimited';
    };
  };
  message: string;
}

export interface POSendResponse {
  success: boolean;
  data: {
    id: string;
    poNumber: string;
    status: POStatus;
    sentToVendorAt: string;
    sentBy: {
      userId: string;
      name: string;
    };
    recipient: {
      type: RecipientType;
      id: string;
      name: string;
      email: string;
    };
    acceptanceDeadline?: string;
    notifications: {
      emailSent: boolean;
      platformNotified: boolean;
    };
  };
  message: string;
}

export interface MilestoneListResponse {
  success: boolean;
  data: PaymentMilestone[];
}

export interface InvoiceListResponse {
  success: boolean;
  data: Invoice[];
}

export interface DeliveryTrackingResponse {
  success: boolean;
  data: DeliveryTracking;
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLog[];
}

// ============= Vendor PO Types =============
export interface VendorPurchaseOrder {
  id: string;
  poNumber: string;
  status: POStatus;
  industry: {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
  };
  projectTitle: string;
  totalAmount: number;
  currency: string;
  startDate: string;
  endDate: string;
  receivedAt: string;
  acceptanceDeadline?: string;
  requiresResponse: boolean;
  vendorResponseStatus?: VendorResponseStatus;
}

export interface VendorPOListResponse {
  success: boolean;
  data: {
    purchaseOrders: VendorPurchaseOrder[];
    summary: {
      total: number;
      pending: number;
      accepted: number;
      inProgress: number;
      completed: number;
      totalValue: number;
    };
  };
  pagination: PaginationResponse;
}

export interface VendorPODetailResponse {
  success: boolean;
  data: PurchaseOrderDetail & {
    industry: {
      id: string;
      name: string;
      contactPerson: string;
      email: string;
      phone: string;
      address: string;
    };
    receivedAt: string;
    acceptanceDeadline?: string;
    requiresResponse: boolean;
    canAccept: boolean;
    canReject: boolean;
    canNegotiate: boolean;
  };
}

// ============= Query Params =============
export interface POListParams extends PaginationParams {
  status?: POStatus;
  vendorId?: string;
  recipientType?: RecipientType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface VendorPOListParams extends PaginationParams {
  status?: POStatus | 'pending' | 'accepted' | 'rejected';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
