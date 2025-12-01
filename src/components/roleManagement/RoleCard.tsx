import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Shield,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PermissionGate } from "@/components/shared/PermissionGate";
import type { RoleV2 } from "@/services/modules/roles/roles.types";

interface RoleCardProps {
  role: RoleV2;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleStatus: (isActive: boolean) => void;
}

export function RoleCard({
  role,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
}: RoleCardProps) {
  // Count enabled permissions
  const enabledPermissions = role.permissionsV2?.reduce((count, module) => {
    const modulePerms = Object.values(module.permissions).filter(Boolean).length;
    const submodulePerms =
      module.submodules?.reduce(
        (subCount, sub) => subCount + Object.values(sub.permissions).filter(Boolean).length,
        0
      ) || 0;
    return count + modulePerms + submodulePerms;
  }, 0) || 0;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Card Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">
                {role.displayName}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {role.description}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <PermissionGate moduleId="settings-role-management" action="edit">
                <DropdownMenuItem onClick={onEdit} disabled={role.isSystemRole}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Role
                </DropdownMenuItem>
              </PermissionGate>
              <PermissionGate moduleId="settings-role-management" action="write">
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              </PermissionGate>
              <DropdownMenuSeparator />
              <PermissionGate moduleId="settings-role-management" action="delete">
                <DropdownMenuItem
                  onClick={() => onToggleStatus(!role.isActive)}
                  disabled={role.isSystemRole}
                >
                  {role.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  disabled={role.isSystemRole || role.userCount > 0}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </PermissionGate>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {role.isSystemRole && (
            <Badge variant="secondary" className="text-xs">
              System Role
            </Badge>
          )}
          {role.isDefault && (
            <Badge variant="outline" className="text-xs">
              Default
            </Badge>
          )}
          <Badge
            variant={role.isActive ? "default" : "destructive"}
            className="text-xs"
          >
            {role.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{role.userCount} users</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {enabledPermissions} permissions
          </div>
        </div>
      </div>

      {/* Card Footer - Quick Actions */}
      <div className="bg-muted/50 px-6 py-3 border-t border-border flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="flex-1 text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
        <PermissionGate moduleId="settings-role-management" action="edit">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            disabled={role.isSystemRole}
            className="flex-1 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
}
