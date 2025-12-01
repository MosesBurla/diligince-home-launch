import { useState, useEffect, useCallback } from 'react';
import { rolesService } from '@/services/modules/roles';
import type {
  RoleV2,
  RoleStatistics,
  RoleFilters,
  CreateRoleRequest,
  UpdateRoleRequest,
  DuplicateRoleRequest,
  ModulePermissionV2,
} from '@/services/modules/roles/roles.types';
import { toast } from 'sonner';

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function useRoles() {
  const [roles, setRoles] = useState<RoleV2[]>([]);
  const [permissionTemplate, setPermissionTemplate] = useState<ModulePermissionV2[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [statistics, setStatistics] = useState<RoleStatistics>({
    totalRoles: 0,
    systemRoles: 0,
    customRoles: 0,
    activeRoles: 0,
    inactiveRoles: 0,
    totalAssignments: 0,
  });

  /**
   * Fetch roles with optional filters
   */
  const fetchRoles = useCallback(async (filters?: RoleFilters) => {
    try {
      setIsLoading(true);
      const response = await rolesService.getRoles(filters);
      
      if (response.success) {
        setRoles(response.data.roles);
        setPagination(response.data.pagination);
        setStatistics(response.data.statistics);
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error(error.message || 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch permission template for creating new roles
   */
  const fetchPermissionTemplate = useCallback(async () => {
    try {
      setIsTemplateLoading(true);
      const response = await rolesService.getPermissionTemplate();
      
      if (response.success) {
        setPermissionTemplate(response.data.permissionsV2);
      }
    } catch (error: any) {
      console.error('Error fetching permission template:', error);
      toast.error(error.message || 'Failed to load permission template');
    } finally {
      setIsTemplateLoading(false);
    }
  }, []);

  /**
   * Get role by ID
   */
  const getRoleById = useCallback(async (roleId: string): Promise<RoleV2 | null> => {
    try {
      const response = await rolesService.getRoleById(roleId);
      
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching role:', error);
      toast.error(error.message || 'Failed to load role details');
      return null;
    }
  }, []);

  /**
   * Create new role
   */
  const createRole = useCallback(async (data: CreateRoleRequest): Promise<boolean> => {
    try {
      const response = await rolesService.createRole(data);
      
      if (response.success) {
        toast.success(response.message || 'Role created successfully');
        fetchRoles(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast.error(error.message || 'Failed to create role');
      return false;
    }
  }, [fetchRoles]);

  /**
   * Update existing role
   */
  const updateRole = useCallback(async (
    roleId: string,
    data: UpdateRoleRequest
  ): Promise<boolean> => {
    try {
      const response = await rolesService.updateRole(roleId, data);
      
      if (response.success) {
        toast.success(response.message || 'Role updated successfully');
        fetchRoles(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update role');
      return false;
    }
  }, [fetchRoles]);

  /**
   * Delete role
   */
  const deleteRole = useCallback(async (roleId: string): Promise<boolean> => {
    try {
      const response = await rolesService.deleteRole(roleId);
      
      if (response.success) {
        toast.success(response.message || 'Role deleted successfully');
        fetchRoles(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error(error.message || 'Failed to delete role');
      return false;
    }
  }, [fetchRoles]);

  /**
   * Duplicate role
   */
  const duplicateRole = useCallback(async (
    roleId: string,
    data: DuplicateRoleRequest
  ): Promise<boolean> => {
    try {
      const response = await rolesService.duplicateRole(roleId, data);
      
      if (response.success) {
        toast.success(response.message || 'Role duplicated successfully');
        fetchRoles(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error duplicating role:', error);
      toast.error(error.message || 'Failed to duplicate role');
      return false;
    }
  }, [fetchRoles]);

  /**
   * Toggle role active status
   */
  const toggleRoleStatus = useCallback(async (
    roleId: string,
    isActive: boolean
  ): Promise<boolean> => {
    try {
      const response = await rolesService.toggleRoleStatus(roleId, { isActive });
      
      if (response.success) {
        toast.success(response.message || 'Role status updated');
        fetchRoles(); // Refresh list
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error updating role status:', error);
      toast.error(error.message || 'Failed to update role status');
      return false;
    }
  }, [fetchRoles]);

  // Initial load
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    permissionTemplate,
    isLoading,
    isTemplateLoading,
    pagination,
    statistics,
    actions: {
      fetchRoles,
      fetchPermissionTemplate,
      getRoleById,
      createRole,
      updateRole,
      deleteRole,
      duplicateRole,
      toggleRoleStatus,
    },
  };
}
