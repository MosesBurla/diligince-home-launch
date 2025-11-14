
// Vendor-specific type definitions

export interface VendorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  vendorType: VendorType;
  specialization?: string[];
  location: string;
  rating: number;
  completedProjects: number;
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
}

export type VendorType = 'service' | 'product' | 'logistics';

export type VendorStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface VendorStats {
  totalRevenue: string;
  activeProjects: number;
  completedProjects: number;
  pendingRFQs: number;
  monthlyGrowth?: number;
}

export interface VendorService {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: string;
  duration?: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: number;
  images?: string[];
  specifications?: Record<string, any>;
}

// Extended vendor sidebar types
export interface StandardizedVendorData {
  companyName: string;
  specialization: string;
  initials: string;
  isVerified?: boolean;
  profileCompletion?: number;
}

export interface StandardizedMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Vendor-specific menu section types
export type ServiceMenuSection = 
  | "company-info" 
  | "team-members" 
  | "services-skills" 
  | "certifications" 
  | "projects-portfolio" 
  | "payment-settings" 
  | "account-settings";

export type ProductMenuSection = 
  | "company-info" 
  | "product-catalog" 
  | "brands-partners" 
  | "certifications" 
  | "shipping-returns" 
  | "payment-settings" 
  | "account-settings";

export type LogisticsMenuSection = 
  | "company-info" 
  | "fleet-equipment" 
  | "service-areas" 
  | "licenses-permits"
  | "drivers-personnel"
  | "payment-settings"
  | "account-settings";

// ============= Vendor RFQ Types =============

export interface VendorRFQBrowseFilters {
  category?: string;
  status?: 'open' | 'closing_soon' | 'closed';
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  page?: number;
  limit?: number;
}

export interface RFQDetail {
  id: string;
  title: string;
  company: string;
  description: string;
  budget: string;
  deadline: string;
  postedDate: string;
  items?: number;
  priority: 'urgent' | 'medium' | 'low';
  status: 'open' | 'pending' | 'submitted' | 'closed';
  location?: string;
  requirements?: string;
  delivery?: string;
  skills?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

export interface VendorRFQListResponse {
  success: boolean;
  data: {
    rfqs: RFQDetail[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface VendorRFQStats {
  totalRFQs: number;
  openRFQs: number;
  pendingRFQs: number;
  submittedRFQs: number;
  winRate: number;
}

// ============= Vendor Quotation Types =============

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuotationMilestone {
  id?: string;
  name: string;
  deliverables: string;
  dueDate: string;
  amount: number;
}

export interface QuotationDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface VendorQuotationSubmitData {
  rfqId: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  proposedStartDate: string;
  proposedCompletionDate: string;
  milestones?: QuotationMilestone[];
  methodology: string;
  technicalSpecifications?: string;
  qualityAssurance?: string;
  complianceCertifications?: string[];
  documents?: QuotationDocument[];
  warrantyPeriod: string;
  supportTerms: string;
  cancellationPolicy: string;
  specialConditions?: string;
  status: 'draft' | 'submitted';
}

export interface VendorQuotation {
  id: string;
  quotationNumber: string;
  rfqId: string;
  rfqTitle: string;
  companyName: string;
  quotedAmount: number;
  submissionDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
}

export interface VendorQuotationListResponse {
  success: boolean;
  data: {
    quotations: VendorQuotation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface VendorQuotationStats {
  totalQuotations: number;
  draftQuotations: number;
  submittedQuotations: number;
  acceptedQuotations: number;
  rejectedQuotations: number;
  acceptanceRate: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    documentId: string;
    url: string;
    name: string;
    type: string;
    size: number;
  };
}

// ============= Vendor Purchase Order Types =============

export interface VendorPOAcceptData {
  acceptedDate: string;
  confirmedStartDate: string;
  notes?: string;
}

export interface VendorPORejectData {
  reason: string;
  alternativeProposal?: string;
}

export interface VendorMilestoneSubmitData {
  completionDate: string;
  deliverables: File[];
  notes?: string;
}

export interface VendorInvoiceSubmitData {
  milestoneId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  description: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
}

export interface VendorPurchaseOrder {
  id: string;
  poNumber: string;
  projectTitle: string;
  companyName: string;
  totalValue: number;
  startDate: string;
  status: string;
  progress: number;
}

export interface VendorPOListResponse {
  success: boolean;
  data: {
    purchaseOrders: VendorPurchaseOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface VendorPOStats {
  totalPOs: number;
  pendingAcceptance: number;
  activePOs: number;
  completedPOs: number;
  totalRevenue: number;
  averageValue: number;
}

// ============= Diligince HUB Types =============

export interface VendorListItem {
  id: string;
  name: string;
  companyName: string;
  vendorType: VendorType;
  specialization: string[];
  location: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  yearsInBusiness: number;
  isVerified: boolean;
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  avatar?: string;
}

export interface VendorSearchFilters {
  search?: string;
  rating?: number;
  category?: VendorType;
  specializations?: string[];
  location?: string;
  minProjects?: number;
  maxProjects?: number;
  page?: number;
  limit?: number;
}

export interface VendorListResponse {
  success: boolean;
  data: {
    vendors: VendorListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    aggregations: {
      totalVendors: number;
      averageRating: number;
      specializationCounts: Record<string, number>;
      locationCounts: Record<string, number>;
    };
  };
}
