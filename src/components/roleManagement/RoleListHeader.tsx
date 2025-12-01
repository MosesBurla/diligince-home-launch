import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PermissionGate } from "@/components/shared/PermissionGate";

interface RoleListHeaderProps {
  onCreateRole: () => void;
}

export function RoleListHeader({ onCreateRole }: RoleListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage roles with custom permissions for your team
        </p>
      </div>

      <PermissionGate moduleId="settings-role-management" action="write">
        <Button
          onClick={onCreateRole}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </PermissionGate>
    </div>
  );
}
