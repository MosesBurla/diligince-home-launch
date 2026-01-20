import apiService from '@/services/core/api.service';
import { buildQueryString } from '@/services/core/api.config';
import { vendorRolesRoutes } from './vendor-roles.routes';
import type {
  VendorRolesListResponse,
  VendorRoleDetailResponse,
  VendorPermissionTemplateResponse,
  VendorRoleActionResponse,
  VendorRoleFilters,
  CreateVendorRoleRequest,
  UpdateVendorRoleRequest,
  DuplicateVendorRoleRequest,
  ToggleVendorRoleStatusRequest,
} from './vendor-roles.types';

class VendorRolesService {
  /**
   * Get all vendor roles with optional filters
   */
  async getRoles(filters?: VendorRoleFilters): Promise<VendorRolesListResponse> {
    const queryString = buildQueryString(filters);
    const url = `${vendorRolesRoutes.getRoles}${queryString}`;
    return apiService.get<VendorRolesListResponse>(url);
  }

  /**
   * Get vendor role by ID
   */
  async getRoleById(roleId: string): Promise<VendorRoleDetailResponse> {
    const url = vendorRolesRoutes.getRoleById(roleId);
    return apiService.get<VendorRoleDetailResponse>(url);
  }

  /**
   * Get permission template for creating new vendor roles
   */
  async getPermissionTemplate(): Promise<VendorPermissionTemplateResponse> {
    return apiService.get<VendorPermissionTemplateResponse>(vendorRolesRoutes.getPermissionTemplate);
  }

  /**
   * Create new vendor role
   */
  async createRole(data: CreateVendorRoleRequest): Promise<VendorRoleActionResponse> {
    return apiService.post<VendorRoleActionResponse, CreateVendorRoleRequest>(
      vendorRolesRoutes.createRole,
      data
    );
  }

  /**
   * Update existing vendor role
   */
  async updateRole(roleId: string, data: UpdateVendorRoleRequest): Promise<VendorRoleActionResponse> {
    const url = vendorRolesRoutes.updateRole(roleId);
    return apiService.put<VendorRoleActionResponse, UpdateVendorRoleRequest>(url, data);
  }

  /**
   * Delete vendor role
   */
  async deleteRole(roleId: string): Promise<VendorRoleActionResponse> {
    const url = vendorRolesRoutes.deleteRole(roleId);
    return apiService.remove<VendorRoleActionResponse>(url);
  }

  /**
   * Duplicate vendor role
   */
  async duplicateRole(
    roleId: string,
    data: DuplicateVendorRoleRequest
  ): Promise<VendorRoleActionResponse> {
    const url = vendorRolesRoutes.duplicateRole(roleId);
    return apiService.post<VendorRoleActionResponse, DuplicateVendorRoleRequest>(url, data);
  }

  /**
   * Toggle vendor role active status
   */
  async toggleRoleStatus(
    roleId: string,
    data: ToggleVendorRoleStatusRequest
  ): Promise<VendorRoleActionResponse> {
    const url = vendorRolesRoutes.toggleRoleStatus(roleId);
    return apiService.put<VendorRoleActionResponse, ToggleVendorRoleStatusRequest>(url, data);
  }
}

export const vendorRolesService = new VendorRolesService();
export default vendorRolesService;
