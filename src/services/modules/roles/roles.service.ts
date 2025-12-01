import apiService from '@/services/core/api.service';
import { buildQueryString } from '@/services/core/api.config';
import { rolesRoutes } from './roles.routes';
import type {
  RolesListResponse,
  RoleDetailResponse,
  PermissionTemplateResponse,
  RoleActionResponse,
  RoleFilters,
  CreateRoleRequest,
  UpdateRoleRequest,
  DuplicateRoleRequest,
  ToggleRoleStatusRequest,
} from './roles.types';

class RolesService {
  /**
   * Get all roles with optional filters
   */
  async getRoles(filters?: RoleFilters): Promise<RolesListResponse> {
    const queryString = buildQueryString(filters);
    const url = `${rolesRoutes.getRoles}${queryString}`;
    return apiService.get<RolesListResponse>(url);
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string): Promise<RoleDetailResponse> {
    const url = rolesRoutes.getRoleById(roleId);
    return apiService.get<RoleDetailResponse>(url);
  }

  /**
   * Get permission template for creating new roles
   */
  async getPermissionTemplate(): Promise<PermissionTemplateResponse> {
    return apiService.get<PermissionTemplateResponse>(rolesRoutes.getPermissionTemplate);
  }

  /**
   * Create new role
   */
  async createRole(data: CreateRoleRequest): Promise<RoleActionResponse> {
    return apiService.post<RoleActionResponse, CreateRoleRequest>(
      rolesRoutes.createRole,
      data
    );
  }

  /**
   * Update existing role
   */
  async updateRole(roleId: string, data: UpdateRoleRequest): Promise<RoleActionResponse> {
    const url = rolesRoutes.updateRole(roleId);
    return apiService.put<RoleActionResponse, UpdateRoleRequest>(url, data);
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: string): Promise<RoleActionResponse> {
    const url = rolesRoutes.deleteRole(roleId);
    return apiService.remove<RoleActionResponse>(url);
  }

  /**
   * Duplicate role
   */
  async duplicateRole(
    roleId: string,
    data: DuplicateRoleRequest
  ): Promise<RoleActionResponse> {
    const url = rolesRoutes.duplicateRole(roleId);
    return apiService.post<RoleActionResponse, DuplicateRoleRequest>(url, data);
  }

  /**
   * Toggle role active status
   */
  async toggleRoleStatus(
    roleId: string,
    data: ToggleRoleStatusRequest
  ): Promise<RoleActionResponse> {
    const url = rolesRoutes.toggleRoleStatus(roleId);
    return apiService.put<RoleActionResponse, ToggleRoleStatusRequest>(url, data);
  }
}

export const rolesService = new RolesService();
export default rolesService;
