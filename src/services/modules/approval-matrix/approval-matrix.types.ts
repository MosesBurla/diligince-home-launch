// Approval Matrix Module Types

export interface UserRef {
  id: string;
  name: string;
  email?: string;
}

export interface LevelApprover {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment?: string;
  isMandatory: boolean;
  sequence: number;
  assignedAt: string;
  assignedBy: UserRef;
}

export interface ApprovalLevel {
  id: string;
  order: number;
  name: string;
  description?: string;
  maxApprovalTimeHours: number;
  isRequired: boolean;
  approvers: LevelApprover[];
}

export interface MatrixStatistics {
  totalLevels: number;
  totalApprovers: number;
  mandatoryApprovers: number;
  optionalApprovers: number;
  activeWorkflows: number;
  completedWorkflows: number;
}

export interface ApprovalMatrix {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  levels: ApprovalLevel[];
  statistics: MatrixStatistics;
  createdBy: UserRef;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApprovalLevelRequest {
  order: number;
  name: string;
  description?: string;
  maxApprovalTimeHours: number;
  isRequired: boolean;
  approvers: {
    memberId: string;
    isMandatory: boolean;
    sequence: number;
  }[];
}

export interface CreateMatrixRequest {
  name: string;
  description: string;
  isDefault?: boolean;
  priority?: number;
  levels: CreateApprovalLevelRequest[];
}

export interface UpdateMatrixRequest {
  name?: string;
  description?: string;
  priority?: number;
  levels?: CreateApprovalLevelRequest[];
}

export interface MatrixFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  isDefault?: boolean;
  sortBy?: 'name' | 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface MatrixListStatistics {
  totalMatrices: number;
  activeMatrices: number;
  inactiveMatrices: number;
  defaultMatrix: number;
  totalApprovers: number;
}

export interface MatrixListResponse {
  success: boolean;
  data: {
    matrices: ApprovalMatrix[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: MatrixListStatistics;
  };
}

export interface MatrixResponse {
  success: boolean;
  data: ApprovalMatrix;
  message?: string;
}

export interface ToggleStatusRequest {
  isActive: boolean;
  reason?: string;
}

export interface DuplicateMatrixRequest {
  name: string;
  description?: string;
  copyApprovers?: boolean;
}

export interface AvailableMember {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  designation?: string;
  isActive: boolean;
  profilePicture?: string;
}

export interface AvailableMembersResponse {
  success: boolean;
  data: {
    members: AvailableMember[];
    totalMembers: number;
  };
}

export interface MemberFilters {
  search?: string;
  role?: string;
  department?: string;
  excludeMatrixId?: string;
}
