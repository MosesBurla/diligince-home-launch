// TypeScript interfaces for Requirement Draft API

import { RequirementFormData } from "@/types/requirement-form.types";

// ============= Request/Response Types =============

export interface DraftMetadata {
  draftId: string;
  currentStep: number;
  lastSaved: string;
  completedSteps: number[];
  isValid: boolean;
  expiresAt: string;
}

export interface DraftResponse {
  success: boolean;
  data: DraftMetadata;
  message: string;
}

export interface DraftDetailResponse {
  success: boolean;
  data: {
    draftId: string;
    formData: RequirementFormData;
    metadata: DraftMetadata;
  };
}

export interface DraftListItem {
  draftId: string;
  title: string;
  category: string;
  currentStep: number;
  lastSaved: string;
  completedSteps: number[];
  progress: number;
}

export interface DraftListResponse {
  success: boolean;
  data: {
    drafts: DraftListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResponse {
  success: boolean;
  data: {
    isValid: boolean;
    step: number;
    errors: ValidationError[];
  };
  message: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    documents: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      size: number;
      documentType: "specification" | "drawing" | "reference" | "compliance" | "other";
      version: number;
      uploadedAt: string;
      uploadedBy: string;
    }>;
    totalSize: number;
    uploadedCount: number;
  };
  message: string;
}

export interface ApprovalWorkflowRequest {
  approvalWorkflowId: string;
  isUrgent: boolean;
  approvalDeadline?: Date;
  emergencyPublish?: boolean;
  emergencyJustification?: string;
}

export interface Approver {
  level: number;
  role: string;
  userId: string;
  name: string;
  email: string;
  deadline: string;
  status: "pending" | "approved" | "rejected";
}

export interface ApprovalWorkflowResponse {
  success: boolean;
  data: {
    approvalWorkflowId: string;
    approvalStatus: "pending" | "approved" | "rejected" | "bypassed";
    workflowName: string;
    approvers: Approver[];
    currentLevel: number;
    estimatedApprovalDate: string;
    notificationsSent: boolean;
    emergencyPublish?: boolean;
    bypassedBy?: string;
    bypassReason?: string;
    publishedImmediately?: boolean;
    postApprovalRequired?: boolean;
    postReviewDeadline?: string;
  };
  message: string;
}

export interface PublishRequirementRequest {
  draftId: string;
  submissionDeadline: Date;
  evaluationCriteria: string[];
  visibility: "all" | "selected";
  selectedVendors?: string[];
  notifyByEmail: boolean;
  notifyByApp: boolean;
  termsAccepted: boolean;
}

export interface PublishResponse {
  success: boolean;
  data: {
    requirementId: string;
    status: "published" | "pending_approval";
    publishedAt?: string;
    submittedAt?: string;
    submissionDeadline: string;
    vendorsNotified?: number;
    viewUrl?: string;
    approvalWorkflow?: {
      workflowId: string;
      approvers: Array<{
        level: number;
        name: string;
        role: string;
        deadline: string;
      }>;
      estimatedPublishDate: string;
    };
    notificationsSent: boolean;
  };
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    [key: string]: any;
  };
}
