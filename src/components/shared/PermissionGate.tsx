import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionAction } from '@/types/roleManagement';

interface PermissionGateProps {
  moduleId?: string;
  path?: string;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * PermissionGate - Conditionally render children based on permissions
 * 
 * Usage:
 * <PermissionGate moduleId="create-requirement" action="write">
 *   <Button>Create New</Button>
 * </PermissionGate>
 * 
 * Or with path:
 * <PermissionGate path="/dashboard/create-requirement" action="write">
 *   <Button>Create New</Button>
 * </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  moduleId,
  path,
  action,
  children,
  fallback = null
}) => {
  const { hasPermission, hasPermissionByPath } = usePermissions();

  // Check permission by moduleId or path
  let hasAccess = false;
  
  if (moduleId) {
    hasAccess = hasPermission(moduleId, action);
  } else if (path) {
    hasAccess = hasPermissionByPath(path, action);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
