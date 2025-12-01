import React from "react";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import type { ModulePermissionV2 } from "@/services/modules/roles/roles.types";

interface PermissionOverviewProps {
  permissions: ModulePermissionV2[];
}

const permissionLabels = {
  read: { label: "Read", color: "bg-blue-50 text-blue-700 border-blue-200" },
  write: { label: "Write", color: "bg-green-50 text-green-700 border-green-200" },
  edit: { label: "Edit", color: "bg-amber-50 text-amber-700 border-amber-200" },
  delete: { label: "Delete", color: "bg-red-50 text-red-700 border-red-200" },
  download: { label: "Download", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

export function PermissionOverview({ permissions }: PermissionOverviewProps) {
  if (!permissions || permissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No permissions configured
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {permissions.map((module) => {
        const IconComponent = (LucideIcons as any)[module.icon] || LucideIcons.Circle;
        const activePermissions = Object.entries(module.permissions || {}).filter(
          ([_, value]) => value === true
        );

        const hasSubmodules = module.submodules && module.submodules.length > 0;

        return (
          <div key={module.id} className="border border-border rounded-lg p-4 bg-card">
            {/* Module Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-md bg-primary/10">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{module.name || "Unnamed Module"}</p>
                <p className="text-xs text-muted-foreground">{module.path || ""}</p>
              </div>
            </div>

            {/* Module Permissions */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activePermissions.length > 0 ? (
                activePermissions.map(([key]) => {
                  const config = permissionLabels[key as keyof typeof permissionLabels];
                  if (!config) return null;
                  
                  return (
                    <Badge
                      key={key}
                      variant="outline"
                      className={config.color}
                    >
                      {config.label}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-xs text-muted-foreground">No permissions</span>
              )}
            </div>

            {/* Submodules */}
            {hasSubmodules && (
              <div className="pl-4 border-l-2 border-border space-y-2 mt-3">
                {module.submodules.map((submodule) => {
                  const SubIconComponent = (LucideIcons as any)[submodule.icon] || LucideIcons.Circle;
                  const subActivePermissions = Object.entries(submodule.permissions || {}).filter(
                    ([_, value]) => value === true
                  );

                  return (
                    <div key={submodule.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <SubIconComponent className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          {submodule.name || "Unnamed Submodule"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-6">
                        {subActivePermissions.length > 0 ? (
                          subActivePermissions.map(([key]) => {
                            const config = permissionLabels[key as keyof typeof permissionLabels];
                            if (!config) return null;
                            
                            return (
                              <Badge
                                key={key}
                                variant="outline"
                                className={`${config.color} text-xs`}
                              >
                                {config.label}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-xs text-muted-foreground">No permissions</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
