// Vendor Role Management API Routes

import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/vendor/roles`;

export const vendorRolesRoutes = {
  // Get all roles with optional filters
  getRoles: BASE_PATH,
  
  // Get single role by ID
  getRoleById: (roleId: string) => `${BASE_PATH}/${roleId}`,
  
  // Get permission template for creating new roles
  getPermissionTemplate: `${BASE_PATH}/template`,
  
  // Create new role
  createRole: BASE_PATH,
  
  // Update existing role
  updateRole: (roleId: string) => `${BASE_PATH}/${roleId}`,
  
  // Delete role
  deleteRole: (roleId: string) => `${BASE_PATH}/${roleId}`,
  
  // Duplicate role
  duplicateRole: (roleId: string) => `${BASE_PATH}/${roleId}/duplicate`,
  
  // Toggle role active status
  toggleRoleStatus: (roleId: string) => `${BASE_PATH}/${roleId}/status`,
} as const;
