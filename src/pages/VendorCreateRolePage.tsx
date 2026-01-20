import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { FormPageSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { PermissionMatrixV2 } from "@/components/roleManagement/PermissionMatrixV2";
import { RolePreviewPanel } from "@/components/roleManagement/RolePreviewPanel";
import type { ModulePermissionV2 } from "@/services/modules/roles/roles.types";

export default function VendorCreateRolePage() {
    const navigate = useNavigate();
    const { actions, isTemplateLoading, permissionTemplate } = useRoles();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        description: "",
    });

    const [permissions, setPermissions] = useState<ModulePermissionV2[]>([]);

    useEffect(() => {
        // Fetch permission template for Service Vendor
        actions.fetchPermissionTemplate();
    }, []);

    useEffect(() => {
        if (permissionTemplate && permissionTemplate.length > 0) {
            setPermissions(permissionTemplate);
        }
    }, [permissionTemplate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.displayName.trim()) {
            return;
        }

        setIsSaving(true);
        const success = await actions.createRole({
            name: formData.name.trim(),
            displayName: formData.displayName.trim(),
            description: formData.description.trim(),
            permissionsV2: permissions,
        });

        setIsSaving(false);

        if (success) {
            navigate("/dashboard/team/roles");
        }
    };

    const handlePermissionsChange = (updatedPermissions: ModulePermissionV2[]) => {
        setPermissions(updatedPermissions);
    };

    if (isTemplateLoading) {
        return <FormPageSkeleton showSidebar sections={2} fieldsPerSection={3} />;
    }

    return (
        <PermissionGate moduleId="sv-team-roles" action="write">
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
                                <h1 className="text-3xl font-bold text-foreground">Create New Role</h1>
                                <p className="text-muted-foreground mt-1">
                                    Define a new role with custom permissions
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form Section */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-foreground mb-4">
                                        Basic Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Role Identifier *</Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g., VendorProjectManager"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                required
                                                className="mt-1.5"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                3-50 characters, alphanumeric and underscores only
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="displayName">Display Name *</Label>
                                            <Input
                                                id="displayName"
                                                placeholder="e.g., Project Manager"
                                                value={formData.displayName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, displayName: e.target.value })
                                                }
                                                required
                                                className="mt-1.5"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe the purpose and responsibilities of this role"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                rows={3}
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Permission Matrix */}
                                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-foreground mb-4">
                                        Module Permissions
                                    </h2>
                                    <PermissionMatrixV2
                                        permissions={permissions}
                                        onChange={handlePermissionsChange}
                                    />
                                </div>
                            </div>

                            {/* Preview Panel */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6">
                                    <RolePreviewPanel
                                        roleName={formData.displayName || "New Role"}
                                        description={formData.description}
                                        permissions={permissions}
                                    />

                                    <div className="mt-6 space-y-3">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSaving || !formData.name.trim() || !formData.displayName.trim()}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isSaving ? "Creating..." : "Create Role"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => navigate("/dashboard/team/roles")}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </PermissionGate>
    );
}
