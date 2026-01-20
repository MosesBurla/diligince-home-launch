// Vendor Approval Matrix Module Types

export interface VendorUserRef {
  id: string;
  name: string;
  email?: string;
}

export interface VendorLevelApprover {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment?: string;
  isMandatory: boolean;
  sequence: number;
  assignedAt: string;
  assignedBy: VendorUserRef;
}

export interface VendorApprovalLevel {
  id: string;
  order: number;
  name: string;
  description?: string;
  maxApprovalTimeHours: number;
  isRequired: boolean;
  approvers: VendorLevelApprover[];
}

export interface VendorMatrixStatistics {
  totalLevels: number;
  totalApprovers: number;
  mandatoryApprovers: number;
  optionalApprovers: number;
  activeWorkflows: number;
  completedWorkflows: number;
}

export interface VendorApprovalMatrix {
  id: string;
  name: string;
  description: string;
  vendorType: 'ServiceVendor' | 'ProductVendor' | 'LogisticsVendor';
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  levels: VendorApprovalLevel[];
  statistics: VendorMatrixStatistics;
  createdBy: VendorUserRef;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorApprovalLevelRequest {
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

export interface CreateVendorMatrixRequest {
  name: string;
  description: string;
  isDefault?: boolean;
  priority?: number;
  levels: CreateVendorApprovalLevelRequest[];
}

export interface UpdateVendorMatrixRequest {
  name?: string;
  description?: string;
  priority?: number;
  levels?: CreateVendorApprovalLevelRequest[];
}

export interface VendorMatrixFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  isDefault?: boolean;
  vendorType?: string;
  sortBy?: 'name' | 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface VendorMatrixListStatistics {
  totalMatrices: number;
  activeMatrices: number;
  inactiveMatrices: number;
  defaultMatrix: number;
  totalApprovers: number;
}

export interface VendorMatrixListResponse {
  success: boolean;
  data: {
    matrices: VendorApprovalMatrix[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: VendorMatrixListStatistics;
  };
}

export interface VendorMatrixResponse {
  success: boolean;
  data: VendorApprovalMatrix;
  message?: string;
}

export interface VendorToggleStatusRequest {
  isActive: boolean;
  reason?: string;
}

export interface VendorDuplicateMatrixRequest {
  name: string;
  description?: string;
  copyApprovers?: boolean;
}

export interface VendorAvailableMember {
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

export interface VendorAvailableMembersResponse {
  success: boolean;
  data: {
    members: VendorAvailableMember[];
    totalMembers: number;
  };
}

export interface VendorMemberFilters {
  search?: string;
  role?: string;
  department?: string;
  excludeMatrixId?: string;
}
