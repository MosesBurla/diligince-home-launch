// Role Management Types (New permissionsV2 structure)

export interface PermissionFlags {
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
  download: boolean;
}

export interface SubmodulePermission {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
  _id?: string; // MongoDB ID (optional)
}

export interface ModulePermissionV2 {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
  submodules: SubmodulePermission[];
  _id?: string; // MongoDB ID (optional)
}

export interface RoleV2 {
  id: string;
  name: string; // Role identifier (e.g., "IndustryAdmin")
  displayName: string; // Human-readable name
  description: string;
  userType: 'IndustryMember';
  isSystemRole: boolean;
  isDefault: boolean;
  isActive: boolean;
  permissionsV2: ModulePermissionV2[];
  userCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleStatistics {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  totalAssignments: number;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description: string;
  permissionsV2: ModulePermissionV2[];
}

export interface UpdateRoleRequest {
  displayName?: string;
  description?: string;
  isActive?: boolean;
  permissionsV2?: ModulePermissionV2[];
}

export interface DuplicateRoleRequest {
  name: string;
  displayName: string;
  description: string;
}

export interface ToggleRoleStatusRequest {
  isActive: boolean;
}

// API Response Types
export interface RolesListResponse {
  success: boolean;
  statusCode: number;
  data: {
    roles: RoleV2[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: RoleStatistics;
  };
}

export interface RoleDetailResponse {
  success: boolean;
  statusCode: number;
  data: RoleV2;
}

export interface PermissionTemplateResponse {
  success: boolean;
  statusCode: number;
  data: {
    permissionsV2: ModulePermissionV2[];
  };
}

export interface RoleActionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: RoleV2;
}
