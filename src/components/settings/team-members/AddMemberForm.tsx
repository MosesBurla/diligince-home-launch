import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleSelectionCombobox } from "./RoleSelectionCombobox";
import { CreateMemberRequest, RoleDetails } from "@/services/modules/team-members/team-members.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, ChevronDown } from "lucide-react";
import { parsePhoneNumber } from "libphonenumber-js";

const addMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(10, "Phone number is required").refine((value) => {
    try {
      const phoneNumber = parsePhoneNumber(value, 'IN');
      return phoneNumber.isValid();
    } catch {
      return false;
    }
  }, "Invalid phone number"),
  department: z.string().optional(),
  designation: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  sendInvitation: z.boolean().default(true),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface AddMemberFormProps {
  roles: RoleDetails[];
  rolesLoading: boolean;
  onSubmit: (data: CreateMemberRequest) => Promise<void>;
}

export const AddMemberForm = ({ roles, rolesLoading, onSubmit }: AddMemberFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      sendInvitation: true,
    },
  });

  const roleId = watch("roleId");
  const sendInvitation = watch("sendInvitation");

  const handleFormSubmit = async (data: AddMemberFormData) => {
    const memberData: CreateMemberRequest = {
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      department: data.department,
      designation: data.designation,
      roleId: data.roleId,
      sendInvitation: data.sendInvitation,
    };
    await onSubmit(memberData);
    reset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto py-4 px-6 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Add New Team Member</span>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 space-y-0 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Add New Team Member</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john.doe@company.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+91 9876543210"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    {...register("department")}
                    placeholder="Procurement"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    {...register("designation")}
                    placeholder="Manager"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label>Assign Role *</Label>
                <RoleSelectionCombobox
                  value={roleId}
                  onChange={(value) => setValue("roleId", value)}
                  roles={roles}
                  disabled={isSubmitting || rolesLoading}
                />
                {errors.roleId && (
                  <p className="text-xs text-destructive mt-1">{errors.roleId.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendInvitation"
                  checked={sendInvitation}
                  onCheckedChange={(checked) => setValue("sendInvitation", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="sendInvitation"
                  className="text-sm font-normal cursor-pointer"
                >
                  Send verification email & SMS immediately
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Member..." : "Add Member"}
              </Button>
            </div>
          </form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
