import { useState } from "react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TeamMember } from "@/services/modules/team-members/team-members.types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PermissionGate } from "@/components/shared/PermissionGate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AddMemberForm,
  EditMemberModal,
  StatisticsCards,
  TeamMembersTable,
} from "@/components/settings/team-members";
import { Search } from "lucide-react";
import { TableSkeletonLoader, StatisticsBarSkeleton } from "@/components/shared/loading";

export default function TeamMembersPage() {
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });

  const { members, roles, loading, rolesLoading, pagination, statistics, actions } = useTeamMembers();

  const handleEditSubmit = async (memberId: string, data: any) => {
    // Update member info
    if (data.firstName || data.lastName || data.department || data.designation) {
      await actions.updateMember(memberId, {
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        designation: data.designation,
      });
    }
    
    // Update role if changed
    if (data.roleId && data.roleId !== editMember?.assignedRole?.id) {
      await actions.updateMemberRole(memberId, { 
        roleId: data.roleId, 
        reason: data.reason || "-"
      });
    }
  };

  const handleSuspend = async (member: TeamMember) => {
    const newStatus = member.status === "suspended" ? "active" : "suspended";
    await actions.updateMemberStatus(
      member.id,
      newStatus,
      newStatus === "suspended" ? "Suspended by admin" : undefined
    );
  };

  const handleRemove = (member: TeamMember) => {
    setMemberToRemove(member);
  };

  const confirmRemove = async () => {
    if (memberToRemove) {
      await actions.removeMember(memberToRemove.id, false);
      setMemberToRemove(null);
    }
  };

  const handleResendVerification = async (member: TeamMember) => {
    await actions.resendVerification(member.id, "both");
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    actions.fetchMembers({ ...filters, search: value });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    actions.fetchMembers(newFilters);
  };

  if (loading && members.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-80 bg-muted animate-pulse rounded" />
        </div>
        <StatisticsBarSkeleton count={4} />
        <TableSkeletonLoader rows={6} columns={5} showFilters showActions />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization's team and their roles
        </p>
      </div>

      {/* Add Member Form */}
      <PermissionGate moduleId="settings-team-members" action="write">
        <AddMemberForm
          roles={roles}
          rolesLoading={rolesLoading}
          onSubmit={async (data) => {
            await actions.createMember(data);
          }}
        />
      </PermissionGate>

      {/* Statistics */}
      <StatisticsCards statistics={statistics} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members by name or email..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles?.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <TeamMembersTable
        members={members}
        onEdit={setEditMember}
        onSuspend={handleSuspend}
        onRemove={handleRemove}
        onResendVerification={handleResendVerification}
      />

      {/* Edit Member Modal - Unified */}
      <EditMemberModal
        isOpen={!!editMember}
        onClose={() => setEditMember(null)}
        onSubmit={handleEditSubmit}
        member={editMember}
        roles={roles}
        rolesLoading={rolesLoading}
      />

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>
                {memberToRemove?.firstName} {memberToRemove?.lastName}
              </strong>{" "}
              from your team? This action can be undone by re-inviting them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className="bg-destructive hover:bg-destructive/90">
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
