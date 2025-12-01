import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PermissionToggleGroup } from "./PermissionToggleGroup";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModulePermissionV2, PermissionFlags } from "@/services/modules/roles/roles.types";

interface ModulePermissionCardProps {
  module: ModulePermissionV2;
  onChange: (module: ModulePermissionV2) => void;
}

export function ModulePermissionCard({ module, onChange }: ModulePermissionCardProps) {
  const IconComponent = (LucideIcons as any)[module.icon] || LucideIcons.Circle;

  const handleModulePermissionChange = (permissions: PermissionFlags) => {
    onChange({
      ...module,
      permissions,
    });
  };

  const handleSubmodulePermissionChange = (submoduleId: string, permissions: PermissionFlags) => {
    const updatedSubmodules = (module.submodules || []).map((sub) =>
      sub.id === submoduleId ? { ...sub, permissions } : sub
    );

    onChange({
      ...module,
      submodules: updatedSubmodules,
    });
  };

  const handleSelectAllSubmodules = () => {
    const updatedSubmodules = (module.submodules || []).map((sub) => ({
      ...sub,
      permissions: {
        read: true,
        write: true,
        edit: true,
        delete: true,
        download: true,
      },
    }));

    onChange({
      ...module,
      submodules: updatedSubmodules,
    });
  };

  const handleClearAllSubmodules = () => {
    const updatedSubmodules = (module.submodules || []).map((sub) => ({
      ...sub,
      permissions: {
        read: false,
        write: false,
        edit: false,
        delete: false,
        download: false,
      },
    }));

    onChange({
      ...module,
      submodules: updatedSubmodules,
    });
  };

  const hasSubmodules = module.submodules && module.submodules.length > 0;
  
  // Calculate permission counts
  const modulePerms = module.permissions || {};
  const moduleEnabledCount = Object.values(modulePerms).filter(Boolean).length;
  
  // Get status color for left border
  const getStatusColor = (count: number) => {
    if (count === 0) return "border-l-muted";
    if (count === 5) return "border-l-emerald-500";
    return "border-l-amber-500";
  };

  return (
    <AccordionItem
      value={module.id}
      className={cn(
        "border border-border rounded-lg bg-card overflow-hidden transition-all duration-200",
        "border-l-4",
        getStatusColor(moduleEnabledCount)
      )}
    >
      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group">
        <div className="flex items-center justify-between flex-1 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-foreground">{module.name || "Unnamed Module"}</p>
              </div>
              {module.path && (
                <Badge variant="outline" className="mt-1 text-xs bg-muted/50">
                  {module.path}
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {moduleEnabledCount}/5
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pb-5 pt-2">
        {/* Module-level permissions */}
        <div className="mb-5">
          <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mb-3" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Module Permissions
          </p>
          <PermissionToggleGroup
            permissions={module.permissions || {
              read: false,
              write: false,
              edit: false,
              delete: false,
              download: false,
            }}
            onChange={handleModulePermissionChange}
          />
        </div>

        {/* Submodules */}
        {hasSubmodules && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-border to-transparent" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Submodules ({module.submodules.length})
                </span>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={handleSelectAllSubmodules}
                  type="button"
                >
                  <CheckSquare className="h-3 w-3 mr-1" />
                  All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={handleClearAllSubmodules}
                  type="button"
                >
                  <Square className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {module.submodules.map((submodule) => {
                const SubIconComponent = (LucideIcons as any)[submodule.icon] || LucideIcons.Circle;
                const subPerms = submodule.permissions || {};
                const subEnabledCount = Object.values(subPerms).filter(Boolean).length;
                
                return (
                  <div 
                    key={submodule.id} 
                    className={cn(
                      "bg-muted/30 rounded-lg p-3 border border-border/50",
                      "hover:border-primary/20 hover:bg-muted/50 hover:shadow-sm",
                      "transition-all duration-200",
                      "border-l-4",
                      getStatusColor(subEnabledCount)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 rounded-md bg-background shadow-sm shrink-0">
                          <SubIconComponent className="h-3.5 w-3.5 text-primary/70" />
                        </div>
                        <span className="text-sm font-medium text-foreground truncate">
                          {submodule.name || "Unnamed Submodule"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
                        {subEnabledCount}/5
                      </Badge>
                    </div>
                    <PermissionToggleGroup
                      permissions={submodule.permissions || {
                        read: false,
                        write: false,
                        edit: false,
                        delete: false,
                        download: false,
                      }}
                      onChange={(permissions) =>
                        handleSubmodulePermissionChange(submodule.id, permissions)
                      }
                      compact
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
