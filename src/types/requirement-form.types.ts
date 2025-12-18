// RequirementFormData interface - separated to avoid circular dependencies
import { ApprovalMatrix } from '@/services/modules/approval-matrix/approval-matrix.types';

// Backend status enum for requirements
export type RequirementStatusEnum = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';

export interface RequirementFormData {
  // Status and approval tracking
  status?: RequirementStatusEnum;
  isSentForApproval?: boolean;
  id?: string;
  title?: string;
  category?: ("product" | "service" | "expert" | "logistics")[];
  priority?: "low" | "medium" | "high" | "critical";
  description?: string;
  specialization?: string[];
  productSpecifications?: string;
  quantity?: number;
  serviceDescription?: string;
  scopeOfWork?: string;
  equipmentType?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  documents?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    documentType: "specification" | "drawing" | "reference" | "compliance" | "other";
    version: number;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  submissionDeadline?: Date;
  evaluationCriteria?: string[];
  visibility?: "all" | "selected";
  selectedVendors?: string[];
  notifyByEmail?: boolean;
  notifyByApp?: boolean;
  termsAccepted?: boolean;
  budget?: number;
  createdDate?: string;
  deadline?: string;
  applicants?: number;
  complianceRequired?: boolean;
  riskLevel?: "low" | "medium" | "high" | "critical";

  // Approval-related fields
  isUrgent?: boolean;
  approvalWorkflowId?: string;
  approvalStatus?: 'not_required' | 'pending' | 'approved' | 'rejected';
  emergencyPublished?: boolean;
  approvalDeadline?: Date;
  selectedApprovalMatrixId?: string;
  selectedApprovalMatrix?: ApprovalMatrix;
  currentApprovalLevel?: number;
  approvalProgress?: {
    currentLevel: number;
    totalLevels: number;
    levels: Array<{
      levelNumber: number;
      name: string;
      approvers: Array<{
        userId: string;
        name: string;
        status: 'pending' | 'approved' | 'rejected';
        approvedAt?: string;
      }>;
      status: 'pending' | 'approved' | 'rejected';
    }>;
    estimatedPublishDate?: string;
  };

  // Expert-specific fields
  certifications?: string[];
  duration?: number;
  startDate?: Date;
  endDate?: Date;

  // Product-specific fields
  technicalStandards?: string[];
  productDeliveryDate?: Date;
  qualityRequirements?: string;

  // Service-specific fields
  performanceMetrics?: string;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
  serviceBudget?: number;
  location?: string;

  // Logistics-specific fields
  weight?: number;
  dimensions?: string;
  pickupDate?: Date;
  deliveryDate?: Date;
  specialHandling?: string;

  // Additional fields for EnhancedBasicInfoStep
  businessJustification?: string;
  department?: string;
  costCenter?: string;
  requestedBy?: string;
  urgency?: boolean;
  estimatedBudget?: number;
  budgetApproved?: boolean;
}
