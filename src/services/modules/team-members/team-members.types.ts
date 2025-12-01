// Team Members Module Types

export interface TeamMember {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'IndustryMember' | 'IndustryAdmin';
  status: 'active' | 'suspended' | 'inactive' | 'pending_verification';
  profileId: string;
  department?: string;
  designation?: string;
  assignedRole?: AssignedRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  firstLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AssignedRole {
  id: string;
  name: string;
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

export interface RoleDetails {
  id: string;
  name: string;
  description: string;
  role?: string; // Role code identifier (e.g., "IndustryMember", "IndustryAdmin")
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

export interface CreateMemberRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  department?: string;
  designation?: string;
  roleId: string;
  sendInvitation?: boolean;
}

export interface UpdateMemberRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  designation?: string;
  memberId?:string;
}

export interface UpdateRoleRequest {
  roleId: string;
  reason?: string;
  memberId?:string;

}

export interface TeamMemberFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  sortBy?: 'createdAt' | 'name' | 'email' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TeamMemberListResponse {
  success: boolean;
  data: {
    members: TeamMember[];
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

export interface CreateMemberResponse {
  success: boolean;
  data: {
    member: TeamMember & {
      tempPassword?: string;
      verificationStatus: {
        email: string;
        phone: string;
      };
    };
  };
  message: string;
}

export interface RolesListResponse {
  success: boolean;
  data: {
    roles: RoleDetails[];
    statistics: {
      totalRoles: number;
      defaultRoles: number;
      customRoles: number;
      totalAssignments: number;
    };
  };
}

export interface BulkActionRequest {
  action: 'suspend' | 'activate' | 'delete' | 'resend_verification';
  memberIds: string[];
  reason?: string;
}

export interface BulkActionResponse {
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

export interface TeamStatistics {
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
