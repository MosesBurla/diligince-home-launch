import { INDUSTRY_MODULES, INDUSTRY_PERMISSIONS_CONFIG } from '@/config/permissionsConfig';
import { 
  ModulePermission, 
  IndustryPermissionsConfig,
  ModulePermissionHierarchy,
  PermissionFlags 
} from '@/types/permissions';
import { PermissionAction } from '@/types/roleManagement';

/**
 * ============================================================================
 * SECURITY NOTICE - IMPORTANT
 * ============================================================================
 * 
 * All permission checks in this file are for CLIENT-SIDE UI ONLY.
 * 
 * NEVER trust client-side permission checks for security:
 * - Users can modify localStorage and bypass client-side checks
 * - All API endpoints MUST validate permissions server-side using JWT
 * - Always verify user permissions on the backend before allowing actions
 * - Client-side checks are for UX only (hiding buttons, menu items, etc.)
 * 
 * Server-side validation requirements:
 * 1. Validate JWT token on every API request
 * 2. Check user's role and permissions in the database
 * 3. Reject requests if user lacks required permissions
 * 4. Log all permission denials for audit purposes
 * 
 * ============================================================================
 */

/**
 * Convert a route path to module ID
 * 
 * Examples:
 * /dashboard/requirements -> industry-requirements
 * /dashboard/create-requirement -> create-requirement
 * /dashboard/requirements/123 -> view-requirement
 */
export const getModuleIdFromPath = (path: string): string | null => {
  // Remove leading/trailing slashes
  const cleanPath = path.replace(/^\/|\/$/g, '');
  
  // Try exact match first
  const exactMatch = INDUSTRY_MODULES.find((m) => {
    const modulePath = m.path.replace(/^\/|\/$/g, '');
    return modulePath === cleanPath;
  });
  
  if (exactMatch) {
    return exactMatch.id;
  }
  
  // Try pattern match for dynamic routes (e.g., /requirements/:id)
  const pathSegments = cleanPath.split('/');
  const patternMatch = INDUSTRY_MODULES.find((m) => {
    const modulePath = m.path.replace(/^\/|\/$/g, '');
    const moduleSegments = modulePath.split('/');
    
    if (moduleSegments.length !== pathSegments.length) {
      return false;
    }
    
    return moduleSegments.every((segment, index) => {
      return segment === pathSegments[index] || segment.startsWith(':');
    });
  });
  
  if (patternMatch) {
    return patternMatch.id;
  }
  
  console.warn(`No module found for path: ${path}`);
  return null;
};

/**
 * Filter navigation items based on user permissions
 * Only show items where user has read permission
 */
export const filterNavItemsByPermissions = <T extends { path: string }>(
  items: T[],
  permissionsMap: Map<string, ModulePermission>
): T[] => {
  return items.filter((item) => {
    const moduleId = getModuleIdFromPath(item.path);
    
    if (!moduleId) {
      // If no module found, hide by default for security
      return false;
    }
    
    const permission = permissionsMap.get(moduleId);
    return permission?.permissions.read || false;
  });
};

/**
 * Get allowed actions for a module from permissions
 */
export const getAllowedActions = (
  moduleId: string,
  permissionsMap: Map<string, ModulePermission>
): PermissionAction[] => {
  const permission = permissionsMap.get(moduleId);
  
  if (!permission) {
    return [];
  }
  
  const actions: PermissionAction[] = [];
  const perms = permission.permissions;
  
  if (perms.read) actions.push('read');
  if (perms.write) actions.push('write');
  if (perms.edit) actions.push('edit');
  if (perms.delete) actions.push('delete');
  if (perms.download) actions.push('download');
  
  return actions;
};

/**
 * Check if a specific action is allowed for a module
 */
export const isActionAllowed = (
  moduleId: string,
  action: PermissionAction,
  permissionsMap: Map<string, ModulePermission>
): boolean => {
  const permission = permissionsMap.get(moduleId);
  return permission?.permissions[action] || false;
};

/**
 * Create a permissions map for quick lookups
 */
export const createPermissionsMap = (
  permissions: ModulePermission[]
): Map<string, ModulePermission> => {
  const map = new Map<string, ModulePermission>();
  
  permissions.forEach((permission) => {
    map.set(permission.module, permission);
  });
  
  return map;
};

/**
 * Merge default permissions with user-specific overrides
 */
export const mergePermissions = (
  defaultPerms: ModulePermission[],
  userPerms: ModulePermission[]
): ModulePermission[] => {
  const merged = new Map<string, ModulePermission>();
  
  // Start with defaults
  defaultPerms.forEach((perm) => {
    merged.set(perm.module, { ...perm });
  });
  
  // Override with user-specific permissions
  userPerms.forEach((perm) => {
    merged.set(perm.module, { ...perm });
  });
  
  return Array.from(merged.values());
};

/**
 * Validate permissions structure
 */
export const validatePermissions = (permissions: ModulePermission[]): boolean => {
  return permissions.every((perm) => {
    return (
      typeof perm.module === 'string' &&
      perm.module.length > 0 &&
      typeof perm.permissions === 'object' &&
      typeof perm.permissions.read === 'boolean' &&
      typeof perm.permissions.write === 'boolean' &&
      typeof perm.permissions.edit === 'boolean' &&
      typeof perm.permissions.delete === 'boolean' &&
      typeof perm.permissions.download === 'boolean'
    );
  });
};

/**
 * Flatten hierarchical permissions config to flat array
 * Used for backward compatibility with existing permission checks
 */
export const flattenPermissions = (config: IndustryPermissionsConfig): ModulePermission[] => {
  const flattened: ModulePermission[] = [];
  
  config.modules.forEach((module) => {
    // Add main module
    flattened.push({
      module: module.id,
      permissions: { ...module.permissions },
    });
    
    // Add submodules
    if (module.submodules) {
      module.submodules.forEach((submodule) => {
        flattened.push({
          module: submodule.id,
          permissions: { ...submodule.permissions },
        });
      });
    }
  });
  
  return flattened;
};

/**
 * Get module hierarchy from config
 * Returns the hierarchical structure for a specific module
 */
export const getModuleHierarchy = (moduleId: string): ModulePermissionHierarchy | undefined => {
  return INDUSTRY_PERMISSIONS_CONFIG.modules.find((m) => m.id === moduleId);
};

/**
 * Clone hierarchical config for role creation
 * Deep clones the entire config so it can be modified for a new role
 */
export const cloneConfigForRole = (
  config: IndustryPermissionsConfig,
  newRoleName: string
): IndustryPermissionsConfig => {
  return {
    version: config.version,
    roleName: newRoleName,
    modules: config.modules.map((module) => ({
      ...module,
      permissions: { ...module.permissions },
      submodules: module.submodules?.map((sub) => ({
        ...sub,
        permissions: { ...sub.permissions },
      })),
    })),
  };
};

/**
 * Set all permissions to a specific value
 * Useful for "Select All" or "Deselect All" functionality
 */
export const setAllPermissions = (
  config: IndustryPermissionsConfig,
  value: boolean
): IndustryPermissionsConfig => {
  const allTrue: PermissionFlags = {
    read: value,
    write: value,
    edit: value,
    delete: value,
    download: value,
  };
  
  return {
    ...config,
    modules: config.modules.map((module) => ({
      ...module,
      permissions: { ...allTrue },
      submodules: module.submodules?.map((sub) => ({
        ...sub,
        permissions: { ...allTrue },
      })),
    })),
  };
};

/**
 * Get all submodules for a parent module from hierarchical config
 */
export const getHierarchicalSubmodules = (moduleId: string): ModulePermissionHierarchy['submodules'] => {
  const module = getModuleHierarchy(moduleId);
  return module?.submodules || [];
};

/**
 * Transform API roleConfiguration permissions to flat array
 * Used for backward compatibility with existing permission checks
 */
export const flattenAPIPermissions = (modules: any[]): ModulePermission[] => {
  const flat: ModulePermission[] = [];
  
  modules.forEach((module) => {
    // Add main module
    flat.push({
      module: module.id,
      permissions: { ...module.permissions },
    });
    
    // Add submodules
    if (module.submodules && Array.isArray(module.submodules)) {
      module.submodules.forEach((sub: any) => {
        flat.push({
          module: sub.id,
          permissions: { ...sub.permissions },
        });
      });
    }
  });
  
  return flat;
};

/**
 * Transform API roleConfiguration to hierarchical config
 * Converts API response format to internal IndustryPermissionsConfig format
 */
export const transformAPIToHierarchical = (roleConfig: any): IndustryPermissionsConfig => {
  return {
    version: '1.0.0',
    roleName: roleConfig.name || roleConfig.displayName,
    modules: roleConfig.permissions.map((m: any) => ({
      id: m.id,
      name: m.name,
      path: m.path,
      icon: m.icon,
      permissions: { ...m.permissions },
      submodules: m.submodules?.map((s: any) => ({
        id: s.id,
        name: s.name,
        path: s.path,
        icon: s.icon,
        permissions: { ...s.permissions },
      })) || [],
    })),
  };
};

/**
 * Create a map from paths to module IDs for quick lookups
 */
export const createPathToModuleMap = (config: IndustryPermissionsConfig): Map<string, string> => {
  const map = new Map<string, string>();
  
  config.modules.forEach(module => {
    map.set(module.path, module.id);
    module.submodules?.forEach(sub => {
      map.set(sub.path, sub.id);
    });
  });
  
  return map;
};

/**
 * Get permissions by path from the flat permissions array
 */
export const getPermissionsByPath = (
  path: string,
  permissionsMap: Map<string, ModulePermission>,
  pathToModuleMap: Map<string, string>
): PermissionFlags | null => {
  const moduleId = pathToModuleMap.get(path);
  if (!moduleId) return null;
  
  const permission = permissionsMap.get(moduleId);
  return permission?.permissions || null;
};

/**
 * Check if a path can be accessed (has read permission)
 */
export const canAccessPath = (
  path: string,
  permissionsMap: Map<string, ModulePermission>,
  pathToModuleMap: Map<string, string>
): boolean => {
  const permissions = getPermissionsByPath(path, permissionsMap, pathToModuleMap);
  // Default to true if permission not found (graceful fallback)
  return permissions?.read !== false;
};
