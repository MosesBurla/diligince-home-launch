import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { LoadingSpinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Copy, Trash2, Power } from "lucide-react";
import { PermissionOverview } from "@/components/roleManagement/PermissionOverview";
import type { RoleV2 } from "@/services/modules/roles/roles.types";

export default function ViewRolePage() {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId: string }>();
  const { actions } = useRoles();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<RoleV2 | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      if (!roleId) {
        navigate("/dashboard/role-management");
        return;
      }

      setIsLoading(true);
      const fetchedRole = await actions.getRoleById(roleId);
      
      if (fetchedRole) {
        setRole(fetchedRole);
      } else {
        navigate("/dashboard/role-management");
      }
      
      setIsLoading(false);
    };

    loadRole();
  }, [roleId]);

  const handleEdit = () => {
    if (roleId) {
      navigate(`/dashboard/role-management/${roleId}/edit`);
    }
  };

  const handleDuplicate = async () => {
    if (!role || !roleId) return;

    const success = await actions.duplicateRole(roleId, {
      name: `${role.name}_Copy`,
      displayName: `${role.displayName} (Copy)`,
      description: `Copy of ${role.description || role.displayName}`,
    });

    if (success) {
      navigate("/dashboard/role-management");
    }
  };

  const handleDelete = async () => {
    if (!roleId) return;

    if (confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      const success = await actions.deleteRole(roleId);
      if (success) {
        navigate("/dashboard/role-management");
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!role || !roleId) return;

    await actions.toggleRoleStatus(roleId, !role.isActive);
    const updatedRole = await actions.getRoleById(roleId);
    if (updatedRole) {
      setRole(updatedRole);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!role) {
    return null;
  }

  return (
    <PermissionGate moduleId="settings-role-management" action="read">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/role-management")}
                className="mt-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {role.displayName || role.name}
                  </h1>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {role.isSystemRole && (
                    <Badge variant="outline">System Role</Badge>
                  )}
                  {role.isDefault && (
                    <Badge variant="outline">Default</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {role.description || "No description provided"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Role ID: {role.name}</span>
                  <span>•</span>
                  <span>{role.userCount || 0} users assigned</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <PermissionGate moduleId="settings-role-management" action="edit">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </PermissionGate>

              <PermissionGate moduleId="settings-role-management" action="write">
                <Button variant="outline" size="sm" onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </PermissionGate>

              {!role.isSystemRole && !role.isDefault && (
                <>
                  <PermissionGate moduleId="settings-role-management" action="edit">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleStatus}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      {role.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </PermissionGate>

                  <PermissionGate moduleId="settings-role-management" action="delete">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={role.userCount > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </PermissionGate>
                </>
              )}
            </div>
          </div>

          {/* Role Metadata */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Role Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">User Type</p>
                <p className="text-sm font-medium text-foreground">{role.userType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created At</p>
                <p className="text-sm font-medium text-foreground">
                  {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm font-medium text-foreground">
                  {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Permission Overview */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Module Permissions
            </h2>
            <PermissionOverview permissions={role.permissionsV2 || []} />
          </div>
        </div>
      </div>
    </PermissionGate>
  );
}
