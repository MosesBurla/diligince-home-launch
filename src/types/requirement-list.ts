export interface RequirementListItem {
  id: string;
  draftId?: string;
  title: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedValue: number;
  estimatedBudget?: number;
  status: RequirementStatus;
  createdAt?: string; // Mapped from backend
  publishedAt?: string;
  submissionDeadline?: string;
  budget?: { min: number; max: number; currency: string };
  approvalProgress?: {
    currentLevel: number;
    totalLevels: number;
    levels: {
      levelNumber: number;
      name: string;
      status: string;
      approvers: {
        memberId: string;
        memberName: string;
        memberEmail: string;
        status: string;
      }[];
    }[];
  };
  currentApprovalLevel?: number;
  sentForApprovalAt?: string;
  createdBy?: { id: string; name: string; email: string };

  // Legacy fields
  createdDate: string;
  lastModified?: string;
  submittedDate?: string;
  submittedBy?: string;
  approver?: string;
  approvedDate?: string;
  approvedBy?: string;
  publishedDate?: string;
  deadline?: string;
  quotesReceived?: number;
  archivedDate?: string;
  archiveReason?: string;
  finalValue?: number;
}

export type RequirementStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface RequirementListResponse {
  success: boolean;
  data: {
    requirements?: RequirementListItem[];
    items?: RequirementListItem[];
    pagination: PaginationData;
    filters?: {
      applied: Record<string, any>;
      available: Record<string, FilterOption[]>;
      creators?: { id: string; name: string; email: string; count: number }[]; // Added creators
    };
  };
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterOption {
  key: string;
  value: string;
  color?: string;
}

export interface RequirementDetail extends RequirementListItem {
  description: string;
  costCenter: string;
  department: string;
  requestedBy: string;
  businessJustification: string;
  riskLevel: string;
  complianceRequired: boolean;

  // Category-specific fields
  productSpecifications?: string;
  quantity?: number;
  technicalStandards?: string[];
  qualityRequirements?: string;
  productDeliveryDate?: string;

  expertSkills?: string[];
  expertQualifications?: string[];
  expertDuration?: string;

  serviceDescription?: string;
  serviceSLA?: string;

  logisticsDetails?: string;

  // Approval workflow
  approvalStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  approvalSteps: ApprovalStep[];

  // Compliance
  complianceChecklist: ComplianceCheckItem[];

  // Documents
  documents: DocumentItem[];

  // Audit
  auditTrail: AuditEntry[];

  // Applicants
  applicants: number;
}

export interface ApprovalStep {
  stepName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  required?: boolean;
  comments?: string;
}

export interface ComplianceCheckItem {
  item: string;
  completed: boolean;
  verifiedBy: string;
  verifiedAt?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'specification' | 'compliance' | 'reference' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
  size?: number;
}

export interface AuditEntry {
  action: string;
  timestamp: string;
  user: string;
  details: string;
}
