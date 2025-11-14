import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Info, Lock, Mail, Shield, User, Users, X } from "lucide-react";

const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const twoFactorSchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  phoneNumber: z.string().optional(),
  receiveBackupCodes: z.boolean().default(false),
});

const notificationsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  loginAlerts: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
  projectUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const privacySchema = z.object({
  profileVisibility: z.boolean().default(true),
  showContactInfo: z.boolean().default(true),
  showCompanyDetails: z.boolean().default(true),
  allowDataSharing: z.boolean().default(false),
});

const userAccessSchema = z.object({
  adminEmails: z.array(z.string().email()).default([]),
  // This would typically have more fields for different access levels
});

type SecuritySettings = z.infer<typeof securitySchema>;
type TwoFactorSettings = z.infer<typeof twoFactorSchema>;
type NotificationSettings = z.infer<typeof notificationsSchema>;
type PrivacySettings = z.infer<typeof privacySchema>;
type UserAccessSettings = z.infer<typeof userAccessSchema>;

// Mock team members with access
const teamMembers = [
  {
    id: "1",
    name: "Raj Mehta",
    email: "raj.mehta@techserve.com",
    role: "Admin",
    status: "active"
  },
  {
    id: "2",
    name: "Priya Shah",
    email: "priya.shah@techserve.com",
    role: "Editor",
    status: "active"
  },
  {
    id: "3",
    name: "Ankit Patel",
    email: "ankit.patel@techserve.com",
    role: "Viewer",
    status: "invited"
  },
];

const AccountSettingsForm = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [isSecuritySubmitting, setIsSecuritySubmitting] = useState(false);
  const [isTwoFactorSubmitting, setIsTwoFactorSubmitting] = useState(false);
  const [isNotificationsSubmitting, setIsNotificationsSubmitting] = useState(false);
  const [isPrivacySubmitting, setIsPrivacySubmitting] = useState(false);
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");
  const [localTeamMembers, setLocalTeamMembers] = useState(teamMembers);

  // Security Form
  const securityForm = useForm<SecuritySettings>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Two-Factor Form
  const twoFactorForm = useForm<TwoFactorSettings>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      enableTwoFactor: false,
      phoneNumber: "",
      receiveBackupCodes: false,
    },
  });

  // Notifications Form
  const notificationsForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      loginAlerts: true,
      paymentNotifications: true,
      projectUpdates: true,
      marketingEmails: false,
    },
  });

  // Privacy Form
  const privacyForm = useForm<PrivacySettings>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: true,
      showContactInfo: true,
      showCompanyDetails: true,
      allowDataSharing: false,
    },
  });

  const onSubmitSecurity = (values: SecuritySettings) => {
    setIsSecuritySubmitting(true);
    
    setTimeout(() => {
      console.log("Security values:", values);
      setIsSecuritySubmitting(false);
      toast.success("Password updated successfully!");
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1500);
  };

  const onSubmitTwoFactor = (values: TwoFactorSettings) => {
    setIsTwoFactorSubmitting(true);
    
    setTimeout(() => {
      console.log("Two-factor values:", values);
      setIsTwoFactorSubmitting(false);
      toast.success("Two-factor authentication settings updated!");
    }, 1500);
  };

  const onSubmitNotifications = (values: NotificationSettings) => {
    setIsNotificationsSubmitting(true);
    
    setTimeout(() => {
      console.log("Notification values:", values);
      setIsNotificationsSubmitting(false);
      toast.success("Notification preferences updated!");
    }, 1000);
  };

  const onSubmitPrivacy = (values: PrivacySettings) => {
    setIsPrivacySubmitting(true);
    
    setTimeout(() => {
      console.log("Privacy values:", values);
      setIsPrivacySubmitting(false);
      toast.success("Privacy settings updated!");
    }, 1000);
  };

  const inviteTeamMember = () => {
    if (!newTeamMemberEmail || !newTeamMemberEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    const newMember = {
      id: `${Date.now()}`,
      name: newTeamMemberEmail.split('@')[0],
      email: newTeamMemberEmail,
      role: "Viewer",
      status: "invited"
    };
    
    setLocalTeamMembers([...localTeamMembers, newMember]);
    setNewTeamMemberEmail("");
    toast.success("Invitation sent successfully!");
  };

  const removeTeamMember = (id: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setLocalTeamMembers(localTeamMembers.filter(member => member.id !== id));
      toast.success("Team member removed successfully!");
    }
  };

  const changeRole = (id: string, role: string) => {
    setLocalTeamMembers(
      localTeamMembers.map(member => 
        member.id === id ? { ...member, role } : member
      )
    );
    toast.success("Role updated successfully!");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Account Settings</CardTitle>
        <CardDescription>
          Manage your account security, access, and preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="two-factor">Two-Factor</TabsTrigger>
            <TabsTrigger value="team-access">Team Access</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter current password" 
                              type="password"
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter new password" 
                              type="password" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Confirm new password" 
                              type="password" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSecuritySubmitting || !securityForm.formState.isDirty}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isSecuritySubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="two-factor">
            <Form {...twoFactorForm}>
              <form onSubmit={twoFactorForm.handleSubmit(onSubmitTwoFactor)} className="space-y-6">
                <div className="rounded-lg border p-6 pb-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Shield className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  
                  <FormField
                    control={twoFactorForm.control}
                    name="enableTwoFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Require a verification code when logging in
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {twoFactorForm.watch("enableTwoFactor") && (
                    <div className="space-y-4 mt-4">
                      <FormField
                        control={twoFactorForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number for SMS Verification</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormDescription>
                              We'll send a verification code to this number when you log in
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={twoFactorForm.control}
                        name="receiveBackupCodes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Generate and download backup codes
                              </FormLabel>
                              <FormDescription>
                                Backup codes can be used to access your account if you lose your phone
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isTwoFactorSubmitting || !twoFactorForm.formState.isDirty}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isTwoFactorSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="team-access">
            <div className="space-y-6">
              <div className="rounded-lg border p-6 pb-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-2">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Team Member Access</h3>
                    <p className="text-sm text-gray-500">
                      Manage who can access your vendor profile
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex mb-4">
                    <Input
                      placeholder="Enter team member's email"
                      value={newTeamMemberEmail}
                      onChange={(e) => setNewTeamMemberEmail(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      onClick={inviteTeamMember} 
                      className="rounded-l-none bg-orange-600 hover:bg-orange-700"
                      disabled={!newTeamMemberEmail}
                    >
                      Invite
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="p-3 bg-muted text-sm font-medium grid grid-cols-12">
                      <div className="col-span-4">Team Member</div>
                      <div className="col-span-4">Access Level</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {localTeamMembers.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">
                          No team members added yet
                        </div>
                      ) : (
                        localTeamMembers.map((member) => (
                          <div key={member.id} className="p-3 grid grid-cols-12 items-center text-sm">
                            <div className="col-span-4 flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-orange-100 text-orange-600">
                                  {member.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.email}</div>
                              </div>
                            </div>
                            <div className="col-span-4">
                              <select
                                className="border rounded p-1 text-sm w-full max-w-[150px]"
                                value={member.role}
                                onChange={(e) => changeRole(member.id, e.target.value)}
                              >
                                <option value="Admin">Admin (Full Access)</option>
                                <option value="Editor">Editor (Can Edit)</option>
                                <option value="Viewer">Viewer (Read Only)</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <Badge className={`${
                                member.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {member.status === 'active' ? 'Active' : 'Invited'}
                              </Badge>
                            </div>
                            <div className="col-span-2 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTeamMember(member.id)}
                                className="h-8 w-8 text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md flex items-start gap-2">
                  <Info className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong>Access levels:</strong>
                    <ul className="mt-1 ml-5 list-disc space-y-1">
                      <li><strong>Admin:</strong> Can manage all aspects including team access</li>
                      <li><strong>Editor:</strong> Can edit profile but cannot manage team members</li>
                      <li><strong>Viewer:</strong> Can only view information, no editing allowed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                <div className="rounded-lg border p-6 pb-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <p className="text-sm text-gray-500">
                        Control which notifications you receive
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="loginAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Login Alerts</FormLabel>
                            <FormDescription>
                              Get notified about new logins to your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="paymentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Payment Notifications</FormLabel>
                            <FormDescription>
                              Receive updates about payments and invoices
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="projectUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Project Updates</FormLabel>
                            <FormDescription>
                              Get notifications about project status changes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive promotional emails and platform updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isNotificationsSubmitting || !notificationsForm.formState.isDirty}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isNotificationsSubmitting ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Form {...privacyForm}>
              <form onSubmit={privacyForm.handleSubmit(onSubmitPrivacy)} className="space-y-6">
                <div className="rounded-lg border p-6 pb-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <User className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Privacy Settings</h3>
                      <p className="text-sm text-gray-500">
                        Control your profile visibility and data sharing
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <FormField
                      control={privacyForm.control}
                      name="profileVisibility"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Profile Visibility</FormLabel>
                            <FormDescription>
                              Make your vendor profile visible to industrial clients
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="showContactInfo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Contact Information</FormLabel>
                            <FormDescription>
                              Display your contact information on your profile
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="showCompanyDetails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Company Details</FormLabel>
                            <FormDescription>
                              Show company registration and tax details on your profile
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="allowDataSharing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Data Sharing</FormLabel>
                            <FormDescription>
                              Allow Diligince.ai to share your profile data with partner platforms
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isPrivacySubmitting || !privacyForm.formState.isDirty}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isPrivacySubmitting ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsForm;
