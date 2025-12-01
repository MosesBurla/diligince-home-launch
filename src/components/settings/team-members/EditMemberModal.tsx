import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TeamMember, RoleDetails, UpdateMemberRequest } from "@/services/modules/team-members/team-members.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { RoleSelectionCombobox } from "./RoleSelectionCombobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const editMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  department: z.string().optional(),
  designation: z.string().optional(),
  roleId: z.string().optional(),
  reason: z.string().optional(),
});

type EditMemberFormData = z.infer<typeof editMemberSchema>;

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberId: string, data: EditMemberFormData) => Promise<void>;
  member: TeamMember | null;
  roles: RoleDetails[];
  rolesLoading?: boolean;
}

export const EditMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  member,
  roles,
  rolesLoading = false,
}: EditMemberModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
  });

  const selectedRoleId = watch("roleId");

  useEffect(() => {
    if (member) {
      // Find role ID by matching member.role code with roles list
      let roleId = member.assignedRole?.id || "";
      
      if (!roleId && member.role && roles.length > 0) {
        const matchingRole = roles.find(r => r.role === member.role);
        roleId = matchingRole?.id || "";
      }
      
      reset({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        department: member.department || "",
        designation: member.designation || "",
        roleId: roleId,
        reason: "",
      });
    }
  }, [member, roles, reset]);

  const handleFormSubmit = async (data: EditMemberFormData) => {
    if (!member) return;
    
    await onSubmit(member.id, data);
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            📧 {member.email} | 📱 {member.phone}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Email & phone cannot be changed)
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Personal Information</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Work Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  {...register("department")}
                  placeholder="Procurement"
                />
                {errors.department && (
                  <p className="text-xs text-destructive mt-1">{errors.department.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  {...register("designation")}
                  placeholder="Manager"
                />
                {errors.designation && (
                  <p className="text-xs text-destructive mt-1">{errors.designation.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Role Assignment</Label>
            
            {member.assignedRole && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Current: {member.assignedRole.name}
                    </CardTitle>
                    {member.assignedRole.isDefault && (
                      <Badge variant="outline" className="text-xs">Default Role</Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {member.assignedRole.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <div>
              <Label htmlFor="roleId" className="mb-2 block">Select Role</Label>
              <RoleSelectionCombobox
                value={selectedRoleId}
                onChange={(value) => setValue("roleId", value)}
                roles={roles}
              />
            </div>
          </div>

          {/* Reason for Changes */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Changes (Optional)</Label>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="e.g., Promotion, department transfer, responsibility change..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || rolesLoading}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};