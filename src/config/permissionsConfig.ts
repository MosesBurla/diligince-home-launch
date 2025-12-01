import { 
  ModuleDefinition, 
  UserPermissions, 
  IndustryPermissionsConfig,
  ModulePermissionHierarchy 
} from '@/types/permissions';
import industryModulePermissions from '@/data/industry_module_permissions.json';

/**
 * Master hierarchical configuration imported from JSON
 * This is the single source of truth for all permission structures
 */
export const INDUSTRY_PERMISSIONS_CONFIG: IndustryPermissionsConfig = industryModulePermissions as IndustryPermissionsConfig;

/**
 * Complete list of all industry modules and sub-modules (flat structure)
 * Generated from hierarchical config for backward compatibility
 */
export const INDUSTRY_MODULES: ModuleDefinition[] = [
  // Core Dashboard
  {
    id: 'industry-dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    availableActions: ['read'],
  },

  // Requirements Management
  {
    id: 'industry-requirements',
    name: 'Requirements',
    path: '/dashboard/requirements',
    availableActions: ['read', 'write', 'edit', 'delete', 'download'],
  },
  {
    id: 'create-requirement',
    name: 'Create Requirement',
    path: '/dashboard/create-requirement',
    parentModule: 'industry-requirements',
    availableActions: ['read', 'write', 'edit'],
  },
  {
    id: 'view-requirement',
    name: 'View Requirement',
    path: '/dashboard/requirements/:id',
    parentModule: 'industry-requirements',
    availableActions: ['read', 'write', 'edit', 'delete', 'download'],
  },

  // Quotations Management
  {
    id: 'industry-quotations',
    name: 'Quotations',
    path: '/dashboard/quotations',
    availableActions: ['read', 'write', 'edit', 'delete', 'download'],
  },
  {
    id: 'view-quotation',
    name: 'View Quotation',
    path: '/dashboard/quotations/:id',
    parentModule: 'industry-quotations',
    availableActions: ['read', 'write', 'edit', 'delete', 'download'],
  },

  // Purchase Orders
  {
    id: 'industry-purchase-orders',
    name: 'Purchase Orders',
    path: '/dashboard/purchase-orders',
    availableActions: ['read', 'write', 'edit', 'delete', 'download'],
  },
  {
    id: 'create-purchase-order',
    name: 'Create Purchase Order',
    path: '/dashboard/create-purchase-order',
    parentModule: 'industry-purchase-orders',
    availableActions: ['read', 'write', 'edit'],
  },
  {
    id: 'view-purchase-order',
    name: 'View Purchase Order',
    path: '/dashboard/purchase-orders/:id',
    parentModule: 'industry-purchase-orders',
    availableActions: ['read', 'write', 'edit', 'delete', 'download'],
  },

  // Projects
  {
    id: 'industry-projects',
    name: 'Projects',
    path: '/dashboard/projects',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },
  {
    id: 'create-project',
    name: 'Create Project',
    path: '/dashboard/create-project',
    parentModule: 'industry-projects',
    availableActions: ['read', 'write', 'edit'],
  },
  {
    id: 'view-project',
    name: 'View Project',
    path: '/dashboard/projects/:id',
    parentModule: 'industry-projects',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },

  // Workflow Management
  {
    id: 'industry-workflow',
    name: 'Workflow',
    path: '/dashboard/workflow',
    availableActions: ['read', 'write', 'edit'],
  },

  // Team & Stakeholders
  {
    id: 'industry-team',
    name: 'Team Management',
    path: '/dashboard/team',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },
  {
    id: 'industry-stakeholders',
    name: 'Stakeholders',
    path: '/dashboard/stakeholders',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },

  // Role Management
  {
    id: 'industry-role-management',
    name: 'Role Management',
    path: '/dashboard/role-management',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },

  // Analytics & Reports
  {
    id: 'industry-analytics',
    name: 'Analytics',
    path: '/dashboard/analytics',
    availableActions: ['read', 'download'],
  },
  {
    id: 'industry-reports',
    name: 'Reports',
    path: '/dashboard/reports',
    availableActions: ['read', 'download'],
  },

  // Messages & Communication
  {
    id: 'industry-messages',
    name: 'Messages',
    path: '/dashboard/messages',
    availableActions: ['read', 'write', 'delete'],
  },
  {
    id: 'industry-notifications',
    name: 'Notifications',
    path: '/dashboard/notifications',
    availableActions: ['read', 'delete'],
  },

  // Settings
  {
    id: 'industry-settings',
    name: 'Settings',
    path: '/dashboard/industry-settings',
    availableActions: ['read', 'edit'],
  },
  {
    id: 'industry-settings-profile',
    name: 'Profile Settings',
    path: '/dashboard/industry-settings/profile',
    parentModule: 'industry-settings',
    availableActions: ['read', 'edit'],
  },
  {
    id: 'industry-settings-company',
    name: 'Company Settings',
    path: '/dashboard/industry-settings/company',
    parentModule: 'industry-settings',
    availableActions: ['read', 'edit'],
  },
  {
    id: 'industry-settings-team-members',
    name: 'Team Members Settings',
    path: '/dashboard/industry-settings/team-members',
    parentModule: 'industry-settings',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },
  {
    id: 'industry-settings-security',
    name: 'Security Settings',
    path: '/dashboard/industry-settings/security',
    parentModule: 'industry-settings',
    availableActions: ['read', 'edit'],
  },

  // Vendors
  {
    id: 'industry-vendors',
    name: 'Vendors',
    path: '/dashboard/vendors',
    availableActions: ['read', 'write', 'edit', 'delete'],
  },
  {
    id: 'view-vendor',
    name: 'View Vendor',
    path: '/dashboard/vendors/:id',
    parentModule: 'industry-vendors',
    availableActions: ['read'],
  },

  // Budget Management
  {
    id: 'industry-budget',
    name: 'Budget',
    path: '/dashboard/budget',
    availableActions: ['read', 'write', 'edit'],
  },

  // Approvals
  {
    id: 'industry-approvals',
    name: 'Approvals',
    path: '/dashboard/approvals',
    availableActions: ['read', 'edit'],
  },

  // Archive
  {
    id: 'industry-archive',
    name: 'Archive',
    path: '/dashboard/archive',
    availableActions: ['read', 'download'],
  },

  // Compliance
  {
    id: 'industry-compliance',
    name: 'Compliance',
    path: '/dashboard/compliance',
    availableActions: ['read', 'write', 'edit'],
  },

  // Audit Logs
  {
    id: 'industry-audit-logs',
    name: 'Audit Logs',
    path: '/dashboard/audit-logs',
    availableActions: ['read', 'download'],
  },
];

/**
 * Get default permissions - returns empty permissions
 * Real permissions should come from API only
 * @deprecated Use API permissions from login response
 */
export const getDefaultPermissions = (): UserPermissions => {
  console.warn('[DEPRECATED] getDefaultPermissions() should not be used - use API permissions only');
  return { permissions: [] };
};

/**
 * Find module definition by ID
 */
export const getModuleDefinition = (moduleId: string): ModuleDefinition | undefined => {
  return INDUSTRY_MODULES.find((m) => m.id === moduleId);
};

/**
 * Get all sub-modules for a parent module
 */
export const getSubModules = (parentModuleId: string): ModuleDefinition[] => {
  return INDUSTRY_MODULES.filter((m) => m.parentModule === parentModuleId);
};

/**
 * Get default permissions for IndustryAdmin role
 * @deprecated Use API permissions from login response
 */
export const getIndustryAdminDefaultPermissions = (): UserPermissions => {
  console.warn('[DEPRECATED] getIndustryAdminDefaultPermissions() should not be used - use API permissions only');
  return { permissions: [] };
};

/**
 * Get hierarchical permissions configuration
 * This is the master template for role management UI and MongoDB storage
 */
export const getHierarchicalConfig = (): IndustryPermissionsConfig => {
  return INDUSTRY_PERMISSIONS_CONFIG;
};

/**
 * Get hierarchical module by ID
 */
export const getHierarchicalModule = (moduleId: string): ModulePermissionHierarchy | undefined => {
  return INDUSTRY_PERMISSIONS_CONFIG.modules.find((m) => m.id === moduleId);
};
