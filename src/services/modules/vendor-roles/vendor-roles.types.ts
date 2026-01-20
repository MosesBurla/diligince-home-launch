// Vendor Role Management Types

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
  _id?: string;
}

export interface ModulePermissionV2 {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
  submodules: SubmodulePermission[];
  _id?: string;
}

export interface VendorRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  userType: 'ServiceVendorMember' | 'ProductVendorMember' | 'LogisticsVendorMember';
  vendorType: 'ServiceVendor' | 'ProductVendor' | 'LogisticsVendor';
  isSystemRole: boolean;
  isDefault: boolean;
  isActive: boolean;
  permissionsV2: ModulePermissionV2[];
  userCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorRoleStatistics {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  totalAssignments: number;
}

export interface VendorRoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
  vendorType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateVendorRoleRequest {
  name: string;
  displayName: string;
  description: string;
  permissionsV2: ModulePermissionV2[];
}

export interface UpdateVendorRoleRequest {
  displayName?: string;
  description?: string;
  isActive?: boolean;
  permissionsV2?: ModulePermissionV2[];
}

export interface DuplicateVendorRoleRequest {
  name: string;
  displayName: string;
  description: string;
}

export interface ToggleVendorRoleStatusRequest {
  isActive: boolean;
}

// API Response Types
export interface VendorRolesListResponse {
  success: boolean;
  statusCode: number;
  data: {
    roles: VendorRole[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: VendorRoleStatistics;
  };
}

export interface VendorRoleDetailResponse {
  success: boolean;
  statusCode: number;
  data: VendorRole;
}

export interface VendorPermissionTemplateResponse {
  success: boolean;
  statusCode: number;
  data: {
    permissionsV2: ModulePermissionV2[];
  };
}

export interface VendorRoleActionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: VendorRole;
}
