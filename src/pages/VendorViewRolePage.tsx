import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { DetailPageSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Shield, Check, X } from "lucide-react";
import type { ModulePermissionV2 } from "@/services/modules/roles/roles.types";

export default function VendorViewRolePage() {
    const navigate = useNavigate();
    const { id: roleId } = useParams<{ id: string }>();
    const { actions, isLoading } = useRoles();
    const [role, setRole] = useState<any>(null);

    useEffect(() => {
        if (roleId) {
            loadRole();
        }
    }, [roleId]);

    const loadRole = async () => {
        if (!roleId) return;

        const roleData = await actions.getRoleById(roleId);
        if (roleData) {
            setRole(roleData);
        }
    };

    if (isLoading || !role) {
        return <DetailPageSkeleton />;
    }

    const getPermissionCount = (permissions: ModulePermissionV2[]) => {
        let total = 0;
        let granted = 0;

        permissions.forEach((module) => {
            // Count module-level permissions
            Object.values(module.permissions).forEach((value) => {
                total++;
                if (value) granted++;
            });

            // Count submodule permissions
            module.submodules?.forEach((submodule) => {
                Object.values(submodule.permissions).forEach((value) => {
                    total++;
                    if (value) granted++;
                });
            });
        });

        return { total, granted };
    };

    const { total, granted } = getPermissionCount(role.permissionsV2 || []);

    return (
        <PermissionGate moduleId="sv-team-roles" action="read">
            <div className="min-h-screen bg-background">
                <div className="container mx-auto py-8 px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/dashboard/team/roles")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-foreground">
                                        {role.displayName}
                                    </h1>
                                    <Badge variant={role.isActive ? "default" : "secondary"}>
                                        {role.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {role.isSystemRole && (
                                        <Badge variant="outline">
                                            <Shield className="h-3 w-3 mr-1" />
                                            System Role
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-1">
                                    {role.description || "No description provided"}
                                </p>
                            </div>
                        </div>
                        <PermissionGate moduleId="sv-team-roles" action="edit">
                            <Button onClick={() => navigate(`/dashboard/team/roles/${roleId}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Role
                            </Button>
                        </PermissionGate>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Role Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Role Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Role Identifier</p>
                                        <p className="text-base font-medium">{role.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Display Name</p>
                                        <p className="text-base font-medium">{role.displayName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Description</p>
                                        <p className="text-base">{role.description || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge variant={role.isActive ? "default" : "secondary"}>
                                            {role.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Module Permissions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Module Permissions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {role.permissionsV2?.map((module: ModulePermissionV2) => (
                                            <div key={module.id} className="border rounded-lg p-4">
                                                <h3 className="font-semibold text-foreground mb-3">
                                                    {module.name}
                                                </h3>

                                                {/* Module-level permissions */}
                                                <div className="mb-3">
                                                    <p className="text-sm text-muted-foreground mb-2">Module Actions:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(module.permissions).map(([action, allowed]) => (
                                                            <Badge
                                                                key={action}
                                                                variant={allowed ? "default" : "outline"}
                                                                className="capitalize"
                                                            >
                                                                {allowed ? (
                                                                    <Check className="h-3 w-3 mr-1" />
                                                                ) : (
                                                                    <X className="h-3 w-3 mr-1" />
                                                                )}
                                                                {action}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Submodule permissions */}
                                                {module.submodules && module.submodules.length > 0 && (
                                                    <div className="mt-4 space-y-3 border-t pt-3">
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            Submodules:
                                                        </p>
                                                        {module.submodules.map((submodule) => (
                                                            <div key={submodule.id} className="pl-4 border-l-2">
                                                                <p className="text-sm font-medium mb-2">{submodule.name}</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {Object.entries(submodule.permissions).map(([action, allowed]) => (
                                                                        <Badge
                                                                            key={action}
                                                                            variant={allowed ? "default" : "outline"}
                                                                            className="text-xs capitalize"
                                                                        >
                                                                            {allowed ? (
                                                                                <Check className="h-2 w-2 mr-1" />
                                                                            ) : (
                                                                                <X className="h-2 w-2 mr-1" />
                                                                            )}
                                                                            {action}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Users Assigned</p>
                                        <p className="text-2xl font-bold">{role.userCount || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Permissions Granted</p>
                                        <p className="text-2xl font-bold">
                                            {granted} / {total}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created</p>
                                        <p className="text-sm">
                                            {new Date(role.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Updated</p>
                                        <p className="text-sm">
                                            {new Date(role.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PermissionGate>
    );
}
