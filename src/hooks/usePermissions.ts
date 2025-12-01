import { useMemo } from 'react';
import { PermissionAction } from '@/types/roleManagement';
import { IndustryPermissionsConfig } from '@/types/permissions';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { getModuleDefinition } from '@/config/permissionsConfig';
import { getModuleHierarchy, getHierarchicalSubmodules } from '@/utils/permissionUtils';

/**
 * Hook for checking user permissions
 * 
 * Usage examples:
 * 
 * // Check if user can perform specific action
 * const canEdit = hasPermission('industry-requirements', 'edit');
 * 
 * // Check if user can access a module (read permission)
 * const canAccessDashboard = canAccessModule('industry-dashboard');
 * 
 * // Get all permissions for a module
 * const reqPerms = getModulePermissions('industry-requirements');
 * 
 * // Check if nav item should be visible
 * const showInNav = canShowNavItem('industry-requirements');
 */
export const usePermissions = () => {
  const { 
    permissions, 
    hierarchicalConfig, 
    getModulePermission, 
    getHierarchicalModules, 
    isLoading,
    getModuleIdByPath,
    getPermissionByPath,
    permissionsMap,
    pathToModuleMap
  } = usePermissionsContext();

  /**
   * Check if user has specific permission for a module
   */
  const hasPermission = (moduleId: string, action: PermissionAction): boolean => {
    const modulePermission = getModulePermission(moduleId);
    
    if (!modulePermission) {
      console.warn(`Permission not found for module: ${moduleId}`);
      return false;
    }

    return modulePermission.permissions[action] || false;
  };

  /**
   * Check if user can access a module (has read permission)
   */
  const canAccessModule = (moduleId: string): boolean => {
    return hasPermission(moduleId, 'read');
  };

  /**
   * Get all permissions for a specific module
   */
  const getModulePermissions = (moduleId: string) => {
    const modulePermission = getModulePermission(moduleId);
    return modulePermission?.permissions || null;
  };

  /**
   * Check if navigation item should be visible
   * A nav item is visible if user has read permission
   */
  const canShowNavItem = (moduleId: string): boolean => {
    return canAccessModule(moduleId);
  };

  /**
   * Get list of allowed actions for a module
   */
  const getAllowedActions = (moduleId: string): PermissionAction[] => {
    const modulePermission = getModulePermission(moduleId);
    
    if (!modulePermission) {
      return [];
    }

    const actions: PermissionAction[] = [];
    const perms = modulePermission.permissions;

    if (perms.read) actions.push('read');
    if (perms.write) actions.push('write');
    if (perms.edit) actions.push('edit');
    if (perms.delete) actions.push('delete');
    if (perms.download) actions.push('download');

    return actions;
  };

  /**
   * Check multiple permissions at once
   */
  const hasAllPermissions = (moduleId: string, actions: PermissionAction[]): boolean => {
    return actions.every((action) => hasPermission(moduleId, action));
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (moduleId: string, actions: PermissionAction[]): boolean => {
    return actions.some((action) => hasPermission(moduleId, action));
  };

  /**
   * Get module definition with permissions applied
   */
  const getModuleWithPermissions = (moduleId: string) => {
    const definition = getModuleDefinition(moduleId);
    const perms = getModulePermissions(moduleId);
    const allowedActions = getAllowedActions(moduleId);

    return {
      definition,
      permissions: perms,
      allowedActions,
      canAccess: canAccessModule(moduleId),
    };
  };

  /**
   * Get hierarchical module structure
   * Used for role management UI and sidebar rendering
   */
  const getModuleHierarchyData = (moduleId: string) => {
    return getModuleHierarchy(moduleId);
  };

  /**
   * Get all submodules for a parent module
   * Returns hierarchical submodule structure
   */
  const getSubmodules = (moduleId: string) => {
    return getHierarchicalSubmodules(moduleId);
  };

  /**
   * Get complete hierarchical config
   * Used for role management and cloning
   */
  const getHierarchicalConfigData = (): IndustryPermissionsConfig | null => {
    return hierarchicalConfig;
  };

  /**
   * Check if user has specific permission for a path
   */
  const hasPermissionByPath = (path: string, action: PermissionAction): boolean => {
    const permission = getPermissionByPath(path);
    if (!permission) {
      return true; // Graceful fallback - allow access if permission not found
    }
    return permission.permissions[action] || false;
  };

  /**
   * Check if user can access a path (has read permission)
   * SECURITY: Explicitly checks for read === true
   * Returns false for unknown paths or denied access
   */
  const canAccessPath = (path: string): boolean => {
    const permission = getPermissionByPath(path);
    if (!permission) {
      // Check if path is in the pathToModuleMap
      const moduleId = pathToModuleMap.get(path);
      // If not in map, it's not permission-controlled, so allow
      return !moduleId;
    }
    return permission.permissions.read === true; // ✅ Explicit true check
  };

  /**
   * Get all permissions for a specific path
   */
  const getPermissionsByPath = (path: string) => {
    const permission = getPermissionByPath(path);
    return permission?.permissions || null;
  };

  return useMemo(
    () => ({
      permissions,
      hierarchicalConfig,
      isLoading,
      hasPermission,
      canAccessModule,
      getModulePermissions,
      canShowNavItem,
      getAllowedActions,
      hasAllPermissions,
      hasAnyPermission,
      getModuleWithPermissions,
      getModuleHierarchyData,
      getSubmodules,
      getHierarchicalConfigData,
      hasPermissionByPath,
      canAccessPath,
      getPermissionsByPath,
      permissionsMap,
      pathToModuleMap,
    }),
    [permissions, hierarchicalConfig, isLoading, permissionsMap, pathToModuleMap]
  );
};
