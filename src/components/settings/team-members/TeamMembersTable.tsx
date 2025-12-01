import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/shared/PermissionGate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMember } from "@/services/modules/team-members/team-members.types";
import { CheckCircle2, XCircle, Clock, Edit, Trash2, MoreVertical, RefreshCw, Ban, CheckCircle } from "lucide-react";

interface TeamMembersTableProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onSuspend: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
  onResendVerification: (member: TeamMember) => void;
}

export const TeamMembersTable = ({
  members,
  onEdit,
  onSuspend,
  onRemove,
  onResendVerification,
}: TeamMembersTableProps) => {
  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const getVerificationBadge = (isEmailVerified: boolean, isPhoneVerified: boolean) => {
    if (isEmailVerified && isPhoneVerified) {
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    if (!isEmailVerified && !isPhoneVerified) {
      return (
        <Badge variant="outline" className="text-destructive border-destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Unverified
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-600">
        <Clock className="h-3 w-3 mr-1" />
        Partial
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (members?.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No team members found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add your first team member to get started
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-[#fff]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members?.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(member.firstName, member.lastName, member.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.designation || "—"}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{member.email}</p>
                  <p className="text-muted-foreground">{member.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{member.department || "—"}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {member.role || "—"}
                  </span>
                  {member.assignedRole?.isDefault && (
                    <Badge variant="outline" className="w-fit text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(member.status)}</TableCell>
              <TableCell>
                {getVerificationBadge(member.isEmailVerified, member.isPhoneVerified)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background z-50">
                      <PermissionGate moduleId="settings-team-members" action="edit">
                        <DropdownMenuItem onClick={() => onEdit(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                      </PermissionGate>
                      
                      <DropdownMenuItem onClick={() => onResendVerification(member)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Verification
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <PermissionGate moduleId="settings-team-members" action="edit">
                        <DropdownMenuItem 
                          onClick={() => onSuspend(member)}
                          className={member.status === 'suspended' ? 'text-green-600' : 'text-amber-600'}
                        >
                          {member.status === 'suspended' ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate Member
                            </>
                          ) : (
                            <>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend Member
                            </>
                          )}
                        </DropdownMenuItem>
                      </PermissionGate>

                      <PermissionGate moduleId="settings-team-members" action="delete">
                        <DropdownMenuItem 
                          onClick={() => onRemove(member)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </PermissionGate>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
