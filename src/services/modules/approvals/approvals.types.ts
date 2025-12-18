// Approvals module types

export interface ApprovalApprover {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment?: string;
  isMandatory: boolean;
  status: 'pending' | 'approved' | 'rejected';
  notifiedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
  conditions?: string[];
}

export interface ApprovalProgressLevel {
  levelNumber: number;
  name: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'skipped';
  maxApprovalTimeHours: number;
  startedAt?: string;
  completedAt?: string;
  approvers: ApprovalApprover[];
}

export interface ApprovalProgress {
  currentLevel: number;
  totalLevels: number;
  allLevelsCompleted: boolean;
  estimatedCompletionDate?: string;
  levels: ApprovalProgressLevel[];
}

export interface CreatorInfo {
  id: string;
  name: string;
  email: string;
}

export interface PendingApproval {
  requirementId: string;
  draftId?: string;
  title: string;
  category: string;
  priority: string;
  estimatedBudget: number;
  department: string;
  status: 'pending';
  isSentForApproval: boolean;
  sentForApprovalAt: string;
  createdBy: CreatorInfo;
  createdAt: string;
  selectedApprovalMatrix?: {
    id: string;
    name: string;
    totalLevels: number;
  };
  approvalProgress: ApprovalProgress;
  // Computed for current user
  canApprove: boolean;
  canReject: boolean;
  myApproverInfo?: {
    levelNumber: number;
    isMandatory: boolean;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface CreatorFilter {
  id: string;
  name: string;
  email: string;
  count: number;
}

export interface PendingStatistics {
  total: number;
  awaitingMyApproval: number;
  level1Pending: number;
  level2Pending: number;
  level3Pending: number;
  overdueApprovals: number;
}

export interface PendingListResponse {
  items: PendingApproval[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    creators: CreatorFilter[];
  };
  statistics: PendingStatistics;
}

export interface ApprovePayload {
  comments?: string;
  conditions?: string[];
}

export interface RejectPayload {
  reason: string;
  comments?: string;
  allowResubmission?: boolean;
  resubmissionDeadline?: string;
}

export interface ApproveResponse {
  success: boolean;
  message: string;
  data: {
    requirementId: string;
    status: string;
    approvalProgress: ApprovalProgress;
    levelAdvanced: boolean;
    fullyApproved: boolean;
    readyToPublish: boolean;
    nextApprovers?: ApprovalApprover[];
  };
}

export interface RejectResponse {
  success: boolean;
  message: string;
  data: {
    requirementId: string;
    status: 'rejected';
    rejectedAt: string;
    rejectedBy: {
      id: string;
      name: string;
      email: string;
    };
    rejectionDetails: {
      reason: string;
      comments?: string;
      allowResubmission: boolean;
      resubmissionDeadline?: string;
    };
    canResubmit: boolean;
  };
}

export interface PublishPayload {
  notifyVendors?: boolean;
  publishNotes?: string;
  visibility?: 'all' | 'selected' | 'invited';
  selectedVendors?: string[];
  submissionDeadline?: string;
}

export interface PublishResponse {
  success: boolean;
  message: string;
  data: {
    requirementId: string;
    status: 'published';
    publishedAt: string;
    publishedBy: {
      id: string;
      name: string;
      email: string;
    };
    submissionDeadline?: string;
    visibility: string;
    vendorNotifications: {
      totalVendors: number;
      notified: number;
      failed: number;
    };
    publicUrl: string;
  };
}

// Legacy type for backward compatibility
export interface Approval {
  id: string;
  requirementId: string;
  requirementTitle: string;
  priority: string;
  category: string;
  status: string;
  createdAt: string;
}
