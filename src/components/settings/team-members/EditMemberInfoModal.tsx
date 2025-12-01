import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamMember, UpdateMemberRequest } from "@/services/modules/team-members/team-members.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const editMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  department: z.string().optional(),
  designation: z.string().optional(),
});

type EditMemberFormData = z.infer<typeof editMemberSchema>;

interface EditMemberInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberId: string, data: UpdateMemberRequest) => Promise<void>;
  member: TeamMember | null;
}

export const EditMemberInfoModal = ({
  isOpen,
  onClose,
  onSubmit,
  member,
}: EditMemberInfoModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
  });

  useEffect(() => {
    if (member) {
      reset({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        department: member.department || "",
        designation: member.designation || "",
      });
    }
  }, [member, reset]);

  const handleFormSubmit = async (data: EditMemberFormData) => {
    if (!member) return;
    
    await onSubmit(member.id, data);
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Current:</strong> {member.email} | {member.phone}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Email & phone cannot be changed)
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Personal Information</Label>
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

            <div>
              <Label className="text-sm font-medium mb-2 block">Work Details</Label>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
