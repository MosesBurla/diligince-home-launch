import { PermissionAction } from './roleManagement';

/**
 * Basic permission flags for all actions
 */
export interface PermissionFlags {
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
  download: boolean;
}

/**
 * Sub-module permission with hierarchy
 */
export interface SubModulePermission {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
}

/**
 * Module permission with nested submodules
 */
export interface ModulePermissionHierarchy {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
  submodules?: SubModulePermission[];
}

/**
 * Complete industry permissions configuration (hierarchical)
 */
export interface IndustryPermissionsConfig {
  version: string;
  roleName: string;
  modules: ModulePermissionHierarchy[];
}

/**
 * Permission configuration for a specific module or sub-module (flat structure)
 * Used for backward compatibility with existing permission checks
 */
export interface ModulePermission {
  module: string; // e.g., "industry-dashboard", "create-requirement"
  permissions: PermissionFlags;
}

/**
 * Complete user permissions configuration (flat structure)
 * Used for backward compatibility with existing permission checks
 */
export interface UserPermissions {
  permissions: ModulePermission[];
}

/**
 * Module definition with metadata (flat structure)
 * Used for backward compatibility
 */
export interface ModuleDefinition {
  id: string; // e.g., "industry-dashboard"
  name: string; // Display name
  path: string; // Route path
  parentModule?: string; // Parent module ID if this is a sub-module
  availableActions: PermissionAction[]; // Available actions for this module
  description?: string;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasAccess: boolean;
  allowedActions: PermissionAction[];
}

/**
 * API Response types for roleConfiguration
 */
export interface RoleConfigurationResponse {
  name: string;
  displayName: string;
  description: string;
  projectType: string;
  isDefault: boolean;
  permissions: ModulePermissionFromAPI[];
  permissionSummary: PermissionSummary;
}

export interface ModulePermissionFromAPI {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
  submodules?: SubModulePermissionFromAPI[];
  _id?: string;
}

export interface SubModulePermissionFromAPI {
  id: string;
  name: string;
  path: string;
  icon: string;
  permissions: PermissionFlags;
  _id?: string;
}

export interface PermissionSummary {
  totalModules: number;
  totalPermissions: number;
  canRead: number;
  canWrite: number;
  canEdit: number;
  canDelete: number;
  canDownload: number;
}
