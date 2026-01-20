// Vendor Team Members Module Types

export interface VendorTeamMember {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'ServiceVendorMember' | 'ServiceVendorAdmin' | 'ProductVendorMember' | 'ProductVendorAdmin';
  vendorType: 'ServiceVendor' | 'ProductVendor' | 'LogisticsVendor';
  status: 'active' | 'suspended' | 'inactive' | 'pending_verification';
  profileId: string;
  department?: string;
  designation?: string;
  assignedRole?: VendorAssignedRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  firstLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VendorAssignedRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Record<string, string[]>;
  isDefault: boolean;
  assignedAt: string;
  assignedBy: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface VendorRoleDetails {
  id: string;
  name: string;
  displayName: string;
  description: string;
  role?: string;
  userType: string;
  isSystemRole: boolean;
  isDefault: boolean;
  permissions: Record<string, string[]>;
  userCount: number;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

export interface CreateVendorMemberRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  department?: string;
  designation?: string;
  roleId: string;
  sendInvitation?: boolean;
}

export interface UpdateVendorMemberRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  designation?: string;
  memberId?: string;
}

export interface UpdateVendorRoleRequest {
  roleId: string;
  reason?: string;
  memberId?: string;
}

export interface VendorTeamMemberFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  vendorType?: string;
  sortBy?: 'createdAt' | 'name' | 'email' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

export interface VendorTeamMemberListResponse {
  success: boolean;
  data: {
    members: VendorTeamMember[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: {
      totalMembers: number;
      activeMembers: number;
      pendingVerification: number;
      suspended: number;
      byRole: Record<string, number>;
    };
  };
}

export interface CreateVendorMemberResponse {
  success: boolean;
  data: {
    member: VendorTeamMember & {
      tempPassword?: string;
      verificationStatus: {
        email: string;
        phone: string;
      };
    };
  };
  message: string;
}

export interface VendorRolesListResponse {
  success: boolean;
  data: {
    roles: VendorRoleDetails[];
    statistics: {
      totalRoles: number;
      defaultRoles: number;
      customRoles: number;
      totalAssignments: number;
    };
  };
}

export interface VendorBulkActionRequest {
  action: 'suspend' | 'activate' | 'delete' | 'resend_verification';
  memberIds: string[];
  reason?: string;
}

export interface VendorBulkActionResponse {
  success: boolean;
  data: {
    successful: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  };
}

export interface VendorTeamStatistics {
  overview: {
    totalMembers: number;
    activeMembers: number;
    pendingVerification: number;
    suspended: number;
    inactive: number;
  };
  verificationStatus: {
    emailVerified: number;
    phoneVerified: number;
    bothVerified: number;
    noneVerified: number;
  };
  activityMetrics: {
    activeToday: number;
    activeThisWeek: number;
    activeThisMonth: number;
    neverLoggedIn: number;
  };
  departmentDistribution: Record<string, number>;
  roleDistribution: Record<string, number>;
  recentActivity: Array<{
    memberId: string;
    memberName: string;
    action: string;
    timestamp: string;
  }>;
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
