import { useState, useEffect, useCallback } from 'react';
import { teamMembersService } from '@/services/modules/team-members';
import {
  TeamMember,
  CreateMemberRequest,
  UpdateMemberRequest,
  UpdateRoleRequest,
  TeamMemberFilters,
  RoleDetails,
} from '@/services/modules/team-members/team-members.types';
import { toast } from 'sonner';

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<RoleDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [statistics, setStatistics] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingVerification: 0,
    suspended: 0,
    byRole: {} as Record<string, number>,
  });

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      const response = await teamMembersService.getCompanyRoles();
      setRoles(response.data.roles);
    } catch (error: any) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async (filters?: TeamMemberFilters) => {
    try {
      setLoading(true);
      const response = await teamMembersService.getMembers(filters);
      setMembers(response.data.members);
      setPagination(response.data.pagination);
      setStatistics(response.data.statistics);
    } catch (error: any) {
      console.error('Failed to fetch members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMember = useCallback(async (data: CreateMemberRequest) => {
    try {
      const response = await teamMembersService.createMember(data);
      toast.success(response.message || 'Team member invited successfully');
      await fetchMembers();
      return response.data.member;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create member';
      toast.error(message);
      throw error;
    }
  }, [fetchMembers]);

  const updateMember = useCallback(async (memberId: string, data: UpdateMemberRequest) => {
    try {
      const response = await teamMembersService.updateMember(memberId, data);
      toast.success(response.message || 'Member updated successfully');
      await fetchMembers();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update member';
      toast.error(message);
      throw error;
    }
  }, [fetchMembers]);

  const updateMemberRole = useCallback(async (memberId: string, data: UpdateRoleRequest) => {
    try {
      const response = await teamMembersService.updateMemberRole(memberId, data);
      toast.success(response.message || 'Member role updated successfully');
      await fetchMembers();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update role';
      toast.error(message);
      throw error;
    }
  }, [fetchMembers]);

  const updateMemberStatus = useCallback(async (
    memberId: string,
    status: 'active' | 'suspended' | 'inactive',
    reason?: string
  ) => {
    try {
      const response = await teamMembersService.updateMemberStatus(memberId, status, reason);
      toast.success(response.message || 'Member status updated successfully');
      await fetchMembers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      throw error;
    }
  }, [fetchMembers]);

  const removeMember = useCallback(async (memberId: string, permanent: boolean = false) => {
    try {
      const response = await teamMembersService.removeMember(memberId, permanent);
      toast.success(response.message || 'Member removed successfully');
      await fetchMembers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
      throw error;
    }
  }, [fetchMembers]);

  const resendVerification = useCallback(async (
    memberId: string,
    type: 'email' | 'phone' | 'both' = 'both'
  ) => {
    try {
      const response = await teamMembersService.resendVerification(memberId, type);
      toast.success(response.message || 'Verification links sent successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend verification';
      toast.error(message);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchMembers();
  }, [fetchRoles, fetchMembers]);

  return {
    members,
    roles,
    loading,
    rolesLoading,
    pagination,
    statistics,
    actions: {
      fetchMembers,
      fetchRoles,
      createMember,
      updateMember,
      updateMemberRole,
      updateMemberStatus,
      removeMember,
      resendVerification,
    },
  };
};
