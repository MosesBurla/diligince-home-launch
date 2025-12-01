import React, { useState, useMemo } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModulePermissionCard } from "./ModulePermissionCard";
import { Search, Layers } from "lucide-react";
import type { ModulePermissionV2 } from "@/services/modules/roles/roles.types";

interface PermissionMatrixV2Props {
  permissions: ModulePermissionV2[];
  onChange: (permissions: ModulePermissionV2[]) => void;
}

export function PermissionMatrixV2({ permissions, onChange }: PermissionMatrixV2Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleModuleChange = (moduleId: string, updatedModule: ModulePermissionV2) => {
    const updated = permissions.map((module) =>
      module.id === moduleId ? updatedModule : module
    );
    onChange(updated);
  };

  // Filter modules based on search query
  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    
    const query = searchQuery.toLowerCase();
    return permissions.filter((module) => {
      const nameMatch = module.name?.toLowerCase().includes(query);
      const pathMatch = module.path?.toLowerCase().includes(query);
      const submoduleMatch = module.submodules?.some((sub) =>
        sub.name?.toLowerCase().includes(query)
      );
      return nameMatch || pathMatch || submoduleMatch;
    });
  }, [permissions, searchQuery]);

  // Calculate statistics
  const enabledModulesCount = useMemo(() => {
    return permissions.filter((module) => {
      const perms = module.permissions || {};
      return Object.values(perms).some(Boolean);
    }).length;
  }, [permissions]);

  if (!permissions || permissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No permissions available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and statistics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {permissions.length} Modules Available
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {enabledModulesCount} with access
          </Badge>
        </div>

        {/* Search bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Module cards */}
      {filteredPermissions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No modules found matching "{searchQuery}"
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {filteredPermissions.map((module) => (
            <ModulePermissionCard
              key={module.id}
              module={module}
              onChange={(updatedModule) => handleModuleChange(module.id, updatedModule)}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
