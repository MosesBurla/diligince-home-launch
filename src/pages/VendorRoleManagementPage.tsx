import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { CardGridSkeletonLoader, StatisticsBarSkeleton } from "@/components/shared/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    RoleListHeader,
    RoleStatisticsBar,
    RoleCard,
    RoleFilters,
} from "@/components/roleManagement";
import type { RoleFilters as RoleFiltersType } from "@/services/modules/roles/roles.types";

export default function VendorRoleManagementPage() {
    const navigate = useNavigate();
    const { roles, isLoading, statistics, actions } = useRoles();
    const { canAccessModule } = usePermissions();
    const [filters, setFilters] = useState<RoleFiltersType>({
        page: 1,
        limit: 10,
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    // Check access permission for vendor role management
    if (!canAccessModule("sv-team-roles")) {
        return (
            <div className="container mx-auto py-6">
                <Alert>
                    <AlertDescription>
                        You don't have permission to access Role Management.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const handleCreateRole = () => {
        navigate("/dashboard/team/roles/create");
    };

    const handleViewRole = (roleId: string) => {
        navigate(`/dashboard/team/roles/${roleId}`);
    };

    const handleEditRole = (roleId: string) => {
        navigate(`/dashboard/team/roles/${roleId}/edit`);
    };

    const handleDuplicateRole = async (roleId: string) => {
        const role = roles.find((r) => r.id === roleId);
        if (!role) return;

        const success = await actions.duplicateRole(roleId, {
            name: `${role.name}_Copy`,
            displayName: `${role.displayName} (Copy)`,
            description: `Copy of ${role.description}`,
        });

        if (success) {
            actions.fetchRoles(filters);
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;

        const success = await actions.deleteRole(roleId);
        if (success) {
            actions.fetchRoles(filters);
        }
    };

    const handleToggleStatus = async (roleId: string, isActive: boolean) => {
        await actions.toggleRoleStatus(roleId, isActive);
        actions.fetchRoles(filters);
    };

    const handleFilterChange = (newFilters: RoleFiltersType) => {
        setFilters(newFilters);
        actions.fetchRoles(newFilters);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    </div>
                    <StatisticsBarSkeleton count={4} />
                    <CardGridSkeletonLoader count={6} columns={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
                {/* Header */}
                <RoleListHeader onCreateRole={handleCreateRole} />

                {/* Statistics Bar */}
                <RoleStatisticsBar statistics={statistics} />

                {/* Filters */}
                <RoleFilters filters={filters} onFilterChange={handleFilterChange} />

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onView={() => handleViewRole(role.id)}
                            onEdit={() => handleEditRole(role.id)}
                            onDuplicate={() => handleDuplicateRole(role.id)}
                            onDelete={() => handleDeleteRole(role.id)}
                            onToggleStatus={(isActive) => handleToggleStatus(role.id, isActive)}
                        />
                    ))}
                </div>

                {roles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No roles found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
