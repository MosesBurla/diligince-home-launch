import api from '../../core/api.service';
import { vendorTeamRoutes } from './vendor-team.routes';
import {
  VendorTeamMember,
  VendorTeamMemberListResponse,
  CreateVendorMemberRequest,
  CreateVendorMemberResponse,
  UpdateVendorMemberRequest,
  UpdateVendorRoleRequest,
  VendorTeamMemberFilters,
  VendorBulkActionRequest,
  VendorBulkActionResponse,
  VendorTeamStatistics,
  VendorRolesListResponse,
  VendorAvailableMembersResponse,
  VendorMemberFilters,
} from './vendor-team.types';

class VendorTeamService {
  /**
   * Get available roles for the vendor company
   */
  async getCompanyRoles(params?: {
    includeSystem?: boolean;
    userType?: string;
  }): Promise<VendorRolesListResponse> {
    return await api.get<VendorRolesListResponse>(vendorTeamRoutes.getRoles, { params });
  }

  /**
   * Get all vendor team members with filters and pagination
   */
  async getMembers(filters?: VendorTeamMemberFilters): Promise<VendorTeamMemberListResponse> {
    return await api.get<VendorTeamMemberListResponse>(vendorTeamRoutes.getMembers, {
      params: filters,
    });
  }

  /**
   * Get a single vendor team member by ID
   */
  async getMemberById(memberId: string): Promise<{ success: boolean; data: VendorTeamMember }> {
    return await api.get<{ success: boolean; data: VendorTeamMember }>(
      vendorTeamRoutes.getMember(memberId)
    );
  }

  /**
   * Create a new vendor team member
   */
  async createMember(data: CreateVendorMemberRequest): Promise<CreateVendorMemberResponse> {
    return await api.post<CreateVendorMemberResponse, CreateVendorMemberRequest>(
      vendorTeamRoutes.createMember,
      data
    );
  }

  /**
   * Update vendor team member basic information
   */
  async updateMember(
    memberId: string,
    data: UpdateVendorMemberRequest
  ): Promise<{ success: boolean; data: VendorTeamMember; message: string }> {
    return await api.patch<
      { success: boolean; data: VendorTeamMember; message: string },
      UpdateVendorMemberRequest
    >(vendorTeamRoutes.updateMember(memberId), data);
  }

  /**
   * Update vendor team member's assigned role
   */
  async updateMemberRole(
    memberId: string,
    data: UpdateVendorRoleRequest
  ): Promise<{ success: boolean; data: any; message: string }> {
    return await api.patch<
      { success: boolean; data: any; message: string },
      UpdateVendorRoleRequest
    >(vendorTeamRoutes.updateMemberRole(memberId), data);
  }

  /**
   * Update vendor team member status
   */
  async updateMemberStatus(
    memberId: string,
    status: 'active' | 'suspended' | 'inactive',
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return await api.patch<
      { success: boolean; message: string },
      { status: string; reason?: string }
    >(vendorTeamRoutes.updateMemberStatus(memberId), {
      status,
      reason,
    });
  }

  /**
   * Remove vendor team member
   */
  async removeMember(
    memberId: string,
    permanent: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    return await api.remove<{ success: boolean; message: string }>(
      vendorTeamRoutes.removeMember(memberId),
      {
        params: { permanent },
      }
    );
  }

  /**
   * Resend verification links
   */
  async resendVerification(
    memberId: string,
    type: 'email' | 'phone' | 'both' = 'both'
  ): Promise<{ success: boolean; message: string }> {
    return await api.post<{ success: boolean; message: string }, { type: string }>(
      vendorTeamRoutes.resendVerification(memberId),
      { type }
    );
  }

  /**
   * Perform bulk action on multiple vendor members
   */
  async bulkAction(data: VendorBulkActionRequest): Promise<VendorBulkActionResponse> {
    return await api.post<VendorBulkActionResponse, VendorBulkActionRequest>(
      vendorTeamRoutes.bulkAction,
      data
    );
  }

  /**
   * Get vendor team statistics
   */
  async getStatistics(): Promise<{ success: boolean; data: VendorTeamStatistics }> {
    return await api.get<{ success: boolean; data: VendorTeamStatistics }>(
      vendorTeamRoutes.getStatistics
    );
  }

  /**
   * Export vendor team members data
   */
  async exportMembers(
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    filters?: VendorTeamMemberFilters
  ): Promise<Blob> {
    return await api.get<Blob>(vendorTeamRoutes.exportMembers, {
      params: { format, ...filters },
      responseType: 'blob',
    });
  }

  /**
   * Get available members for approval matrix assignment
   */
  async getAvailableMembers(filters?: VendorMemberFilters): Promise<VendorAvailableMembersResponse> {
    return await api.get<VendorAvailableMembersResponse>(
      vendorTeamRoutes.getAvailableMembers,
      {
        params: filters,
      }
    );
  }
}

export const vendorTeamService = new VendorTeamService();
