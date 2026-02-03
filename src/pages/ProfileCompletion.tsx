import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { industries } from "@/constants/Types";

const formSchema = z.object({
  phone: z.string().optional(),
  // Industry specific
  companyName: z.string().optional(),
  industryType: z.string().optional(),
  // Professional specific
  fullName: z.string().optional(),
  expertise: z.string().optional(),
  // Vendor specific
  businessName: z.string().optional(),
  vendorCategory: z.string().optional(),
  specialization: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const {
    user,
    updateProfile,
    profileCompletion,
    getDashboardUrl,
    setHasCompletedOnboarding,
  } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: user?.profile?.phone || "",
      companyName: user?.profile?.companyName || "",
      industryType: user?.profile?.industryType || "",
      fullName: user?.profile?.fullName || "",
      expertise: user?.profile?.expertise || "",
      businessName: user?.profile?.businessName || "",
      vendorCategory: user?.profile?.vendorCategory || "",
      specialization: user?.profile?.specialization || "",
    },
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const onSubmit = (values: ProfileFormValues) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const filteredEntries = Object.entries(values).filter(
        ([, value]) =>
          value !== undefined &&
          (typeof value !== "string" || value.trim() !== "")
      );

      const profileUpdates = {
        profile: {
          ...user.profile,
          ...Object.fromEntries(filteredEntries),
        },
      };

      updateProfile(profileUpdates);
      setHasCompletedOnboarding(true);

      setIsSubmitting(false);
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        navigate(getDashboardUrl());
      }, 1000);
    }, 1000);
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    navigate(getDashboardUrl());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Help us personalize your experience by completing your profile
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-gray-600">
                  {profileCompletion.percentage}%
                </span>
              </div>
              <Progress
                value={profileCompletion.percentage}
                className="h-2"
                indicatorClassName={
                  profileCompletion.isComplete ? "bg-green-500" : "bg-primary"
                }
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {profileCompletion.isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-primary" />
              )}
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Common field - Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Industry specific fields */}
                {user.role === "industry" && (
                  <>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Steel Industries Ltd."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Professional specific fields */}
                {user.role === "professional" && (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Rahul Sharma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area of Expertise *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Mechanical Engineering"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Vendor specific fields */}
                {user.role === "vendor" && (
                  <>
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Coastal Services Ltd."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Transportation Services"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex gap-3 pt-6">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save & Continue"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip for Now
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletion;

