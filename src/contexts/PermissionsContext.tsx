import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  UserPermissions, 
  ModulePermission, 
  IndustryPermissionsConfig 
} from '@/types/permissions';
import { 
  createPathToModuleMap, 
  createPermissionsMap,
  flattenAPIPermissions,
  transformAPIToHierarchical 
} from '@/utils/permissionUtils';
import { toast } from 'sonner';

interface PermissionsContextType {
  permissions: UserPermissions;
  hierarchicalConfig: IndustryPermissionsConfig;
  setPermissions: (permissions: UserPermissions) => void;
  isLoading: boolean;
  getModulePermission: (moduleId: string) => ModulePermission | undefined;
  getHierarchicalModules: () => IndustryPermissionsConfig;
  getModuleIdByPath: (path: string) => string | null;
  getPermissionByPath: (path: string) => ModulePermission | undefined;
  permissionsMap: Map<string, ModulePermission>;
  pathToModuleMap: Map<string, string>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: ReactNode;
}

/**
 * PermissionsProvider - Global permissions management
 * 
 * Currently initializes with mock data (all permissions enabled)
 * Future: Will integrate with login API response
 */
export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [permissions, setPermissionsState] = useState<UserPermissions>({ permissions: [] });
  const [hierarchicalConfig, setHierarchicalConfig] = useState<IndustryPermissionsConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle no permissions case - logout and show toast
  const handleNoPermissions = () => {
    toast.error("Don't have any Module Access");
    // Clear all auth data
    localStorage.removeItem('roleConfiguration');
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('verificationStatus');
    localStorage.removeItem('hasCompletedOnboarding');
    // Redirect to login
    setTimeout(() => {
      window.location.href = '/signin';
    }, 1000);
  };

  // Validate that permissions have at least one readable module
  const validatePermissions = (roleConfig: any): boolean => {
    if (!roleConfig?.permissions || roleConfig.permissions.length === 0) {
      return false;
    }
    
    // Check if user has at least one module with read access
    const hasAnyAccess = roleConfig.permissions.some((m: any) => 
      m.permissions?.read === true || 
      m.submodules?.some((s: any) => s.permissions?.read === true)
    );
    
    return hasAnyAccess;
  };

  // Initialize permissions on mount
  useEffect(() => {
    const initializePermissions = () => {
      try {
        const cachedRoleConfig = localStorage.getItem('roleConfiguration');
        
        if (cachedRoleConfig) {
          try {
            const roleConfig = JSON.parse(cachedRoleConfig);
            
            // Validate permissions
            if (!validatePermissions(roleConfig)) {
              handleNoPermissions();
              return;
            }
            
            // Transform and set permissions from cached data
            const flatPermissions = flattenAPIPermissions(roleConfig.permissions);
            const hierarchical = transformAPIToHierarchical(roleConfig);
            
            setPermissionsState({ permissions: flatPermissions });
            setHierarchicalConfig(hierarchical);
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[Permissions] Loaded from localStorage:', {
                modules: roleConfig.permissions.length,
                flatPermissions: flatPermissions.length
              });
            }
          } catch (parseError) {
            console.error('Failed to parse cached permissions:', parseError);
            handleNoPermissions();
          }
        }
        // If no cached data, wait for login to provide permissions
      } catch (error) {
        console.error('Failed to initialize permissions:', error);
        handleNoPermissions();
      } finally {
        setIsLoading(false);
      }
    };

    initializePermissions();
  }, []);

  // Listen for permissions update event from login
  useEffect(() => {
    const handlePermissionsUpdate = (event: CustomEvent) => {
      const roleConfig = event.detail;
      
      // Validate permissions
      if (!validatePermissions(roleConfig)) {
        handleNoPermissions();
        return;
      }
      
      // Transform and set permissions
      try {
        const flatPermissions = flattenAPIPermissions(roleConfig.permissions);
        const hierarchical = transformAPIToHierarchical(roleConfig);
        
        setPermissionsState({ permissions: flatPermissions });
        setHierarchicalConfig(hierarchical);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Permissions] Updated from login event:', {
            modules: roleConfig.permissions.length,
            flatPermissions: flatPermissions.length
          });
        }
      } catch (error) {
        console.error('Failed to transform permissions from event:', error);
        handleNoPermissions();
      }
    };
    
    window.addEventListener('permissions:update', handlePermissionsUpdate as EventListener);
    return () => window.removeEventListener('permissions:update', handlePermissionsUpdate as EventListener);
  }, []);


  /**
   * Update permissions - manual update method (backward compatibility)
   */
  const setPermissions = (newPermissions: UserPermissions) => {
    setPermissionsState(newPermissions);
    
    // Optional: Persist to localStorage for session management
    try {
      localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
    } catch (error) {
      console.error('Failed to cache permissions:', error);
    }
  };

  /**
   * Get permissions for a specific module
   */
  const getModulePermission = (moduleId: string): ModulePermission | undefined => {
    return permissions.permissions.find((p) => p.module === moduleId);
  };

  /**
   * Get hierarchical modules configuration
   * Used for role management UI and sidebar rendering
   */
  const getHierarchicalModules = (): IndustryPermissionsConfig | null => {
    return hierarchicalConfig;
  };

  // Create path-to-module mapping for quick lookups
  const pathToModuleMap = useMemo(() => {
    if (!hierarchicalConfig) {
      return new Map<string, string>();
    }
    const map = createPathToModuleMap(hierarchicalConfig);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Permissions] pathToModuleMap entries:', map.size);
      console.log('[Permissions] Sample paths:', Array.from(map.entries()).slice(0, 3));
    }
    return map;
  }, [hierarchicalConfig]);

  // Create permissions map for efficient lookups
  const permissionsMap = useMemo(() => {
    const map = createPermissionsMap(permissions.permissions);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Permissions] permissionsMap entries:', map.size);
      console.log('[Permissions] Sample permission:', Array.from(map.entries())[0]);
    }
    return map;
  }, [permissions]);

  const getModuleIdByPath = (path: string): string | null => {
    return pathToModuleMap.get(path) || null;
  };

  const getPermissionByPath = (path: string): ModulePermission | undefined => {
    const moduleId = getModuleIdByPath(path);
    if (!moduleId) return undefined;
    return getModulePermission(moduleId);
  };

  const value: PermissionsContextType = {
    permissions,
    hierarchicalConfig,
    setPermissions,
    isLoading,
    getModulePermission,
    getHierarchicalModules,
    getModuleIdByPath,
    getPermissionByPath,
    permissionsMap,
    pathToModuleMap,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

/**
 * Hook to access permissions context
 */
export const usePermissionsContext = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissionsContext must be used within PermissionsProvider');
  }
  return context;
};
