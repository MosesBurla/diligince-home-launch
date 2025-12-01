import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2 } from "lucide-react";
import type { ModulePermissionV2 } from "@/services/modules/roles/roles.types";

interface RolePreviewPanelProps {
  roleName: string;
  description?: string;
  permissions: ModulePermissionV2[];
}

export function RolePreviewPanel({
  roleName,
  description,
  permissions,
}: RolePreviewPanelProps) {
  const stats = useMemo(() => {
    let totalModules = 0;
    let modulesWithRead = 0;
    let totalSubmodules = 0;
    let submodulesWithRead = 0;

    (permissions || []).forEach((module) => {
      totalModules++;
      if (module.permissions?.read) {
        modulesWithRead++;
      }

      (module.submodules || []).forEach((sub) => {
        totalSubmodules++;
        if (sub.permissions?.read) {
          submodulesWithRead++;
        }
      });
    });

    return {
      totalModules,
      modulesWithRead,
      totalSubmodules,
      submodulesWithRead,
      totalAccessPoints: modulesWithRead + submodulesWithRead,
    };
  }, [permissions]);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Role Preview</h3>
      </div>

      <div className="space-y-4">
        {/* Role Name */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Role Name</p>
          <p className="font-medium text-foreground">
            {roleName || "Untitled Role"}
          </p>
        </div>

        {/* Description */}
        {description && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground">{description}</p>
          </div>
        )}

        {/* Permission Summary */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3">Permission Summary</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Modules</span>
              <Badge variant="secondary">{stats.totalModules}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Accessible Modules</span>
              <Badge variant="default">{stats.modulesWithRead}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Submodules</span>
              <Badge variant="secondary">{stats.totalSubmodules}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Accessible Submodules</span>
              <Badge variant="default">{stats.submodulesWithRead}</Badge>
            </div>
          </div>
        </div>

        {/* Access Level Indicator */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-foreground">
              {stats.totalAccessPoints} Access Points Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
