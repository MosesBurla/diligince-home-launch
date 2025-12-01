import api from '../../core/api.service';
import { teamMembersRoutes } from './team-members.routes';
import {
  TeamMember,
  TeamMemberListResponse,
  CreateMemberRequest,
  CreateMemberResponse,
  UpdateMemberRequest,
  UpdateRoleRequest,
  TeamMemberFilters,
  BulkActionRequest,
  BulkActionResponse,
  TeamStatistics,
  RolesListResponse,
} from './team-members.types';

class TeamMembersService {
  /**
   * Get available roles for the company
   */
  async getCompanyRoles(params?: {
    includeSystem?: boolean;
    userType?: string;
  }): Promise<RolesListResponse> {
    return await api.get<RolesListResponse>(teamMembersRoutes.getRoles, { params });
  }

  /**
   * Get all team members with filters and pagination
   */
  async getMembers(filters?: TeamMemberFilters): Promise<TeamMemberListResponse> {
    return await api.get<TeamMemberListResponse>(teamMembersRoutes.getMembers, {
      params: filters,
    });
  }

  /**
   * Get a single team member by ID
   */
  async getMemberById(memberId: string): Promise<{ success: boolean; data: TeamMember }> {
    return await api.get<{ success: boolean; data: TeamMember }>(
      teamMembersRoutes.getMember(memberId)
    );
  }

  /**
   * Create a new team member
   */
  async createMember(data: CreateMemberRequest): Promise<CreateMemberResponse> {
    return await api.post<CreateMemberResponse, CreateMemberRequest>(
      teamMembersRoutes.createMember,
      data
    );
  }

  /**
   * Update team member basic information
   */
  async updateMember(
    memberId: string,
    data: UpdateMemberRequest
  ): Promise<{ success: boolean; data: TeamMember; message: string }> {
    return await api.patch<
      { success: boolean; data: TeamMember; message: string },
      UpdateMemberRequest
    >(teamMembersRoutes.updateMember(memberId), data);
  }

  /**
   * Update team member's assigned role
   */
  async updateMemberRole(
    memberId: string,
    data: UpdateRoleRequest
  ): Promise<{ success: boolean; data: any; message: string }> {
    return await api.patch<
      { success: boolean; data: any; message: string },
      UpdateRoleRequest
    >(teamMembersRoutes.updateMemberRole(memberId), data);
  }

  /**
   * Update team member status
   */
  async updateMemberStatus(
    memberId: string,
    status: 'active' | 'suspended' | 'inactive',
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return await api.patch<
      { success: boolean; message: string },
      { status: string; reason?: string }
    >(teamMembersRoutes.updateMemberStatus(memberId), {
      status,
      reason,
    });
  }

  /**
   * Remove team member
   */
  async removeMember(
    memberId: string,
    permanent: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    return await api.remove<{ success: boolean; message: string }>(
      teamMembersRoutes.removeMember(memberId),
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
      teamMembersRoutes.resendVerification(memberId),
      { type }
    );
  }

  /**
   * Perform bulk action on multiple members
   */
  async bulkAction(data: BulkActionRequest): Promise<BulkActionResponse> {
    return await api.post<BulkActionResponse, BulkActionRequest>(
      teamMembersRoutes.bulkAction,
      data
    );
  }

  /**
   * Get team statistics
   */
  async getStatistics(): Promise<{ success: boolean; data: TeamStatistics }> {
    return await api.get<{ success: boolean; data: TeamStatistics }>(
      teamMembersRoutes.getStatistics
    );
  }

  /**
   * Export team members data
   */
  async exportMembers(
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    filters?: TeamMemberFilters
  ): Promise<Blob> {
    return await api.get<Blob>(teamMembersRoutes.exportMembers, {
      params: { format, ...filters },
      responseType: 'blob',
    });
  }
}

export const teamMembersService = new TeamMembersService();
