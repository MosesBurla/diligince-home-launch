import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
// import { WelcomeModal } from "@/components/shared/WelcomeModal";
import { useAuth } from "../hooks/useAuth";

// Keep the same industries array - sorted alphabetically with Others at end
export const industries = [
  "Automotive Manufacturing",
  "Cement Production",
  "Chemical Manufacturing",
  "Coal Mining",
  "Electronics Manufacturing",
  "Fertilizer Production",
  "Food Processing",
  "Glass Production",
  "Manufacturing",
  "Natural Gas Processing",
  "Oil Refining",
  "Paper Mills",
  "Pharmaceutical Production",
  "Plastics Manufacturing",
  "Plumber and Wood Products",
  "Power Generation",
  "Rice Mills",
  "Steel Manufacturing",
  "Sugar Manufacturing",
  "Textile Manufacturing",
  "Water Treatment",
  "Others"
];

// Convert to options format for SearchableSelect
const industryOptions = industries.map(industry => ({
  value: industry,
  label: industry
}));

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  companyName: z.string().min(1, {
    message: "Company name is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits",
  }),
  industryType: z.string().min(1, {
    message: "Industry type is required",
  }),
  customIndustryType: z.string().optional(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
  privacyAccepted: z.boolean().refine((value) => value === true, {
    message: "You must accept the privacy policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => data.industryType !== "Others" || (data.customIndustryType && data.customIndustryType.length > 0),
  {
    message: "Please specify your industry type",
    path: ["customIndustryType"],
  }
);

export function IndustrySignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  // const [newUser, setNewUser] = useState<any>(null);
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phone: "",
      industryType: "",
      customIndustryType: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const selectedIndustryType = form.watch("industryType");
  const showCustomIndustryField = selectedIndustryType === "Others";

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Generate initials from company name
    // const initials = values.companyName
    //   .split(' ')
    //   .map(word => word.charAt(0))
    //   .join('')
    //   .substring(0, 2)
    //   .toUpperCase();

    // Create user profile
    const registrationData = {
      email: values.email,
      password: values.password,
      phone: values.phone,
      userType: 'Industry',  // Fixed: Changed from 'role' to 'userType'
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
      industryType: values.industryType === "Others" ? values.customIndustryType : values.industryType,
      termsAccepted: values.termsAccepted,
      privacyAccepted: values.privacyAccepted,
    };

    // const result = await signUp(userProfile);

    // if (result.success) {
    //   setNewUser(result.user);
    //   setShowWelcomeModal(true);
    // }
    await signUp(registrationData);
  }

  // const handleCompleteProfile = () => {
  //   setShowWelcomeModal(false);
  //   setTimeout(() => {
  //     navigate("/profile-completion");
  //   }, 300);
  // };

  // const handleGoToDashboard = () => {
  //   setShowWelcomeModal(false);
  //   setTimeout(() => {
  //     navigate("/industry-dashboard");
  //   }, 300);
  // };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Steel Industries Ltd."
                    className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="you@example.com"
                        className="pl-10 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 9876543210"
                      type="tel"
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="industryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Industry Type</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={industryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select your industry type"
                    searchPlaceholder="Search industries..."
                    emptyMessage="No industry found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showCustomIndustryField && (
            <FormField
              control={form.control}
              name="customIndustryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Specify Industry Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please specify your industry type"
                      className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-700">
                    I accept the
                    <a href="/terms" className="text-blue-600 hover:underline ml-1">terms and conditions</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-700">
                    I accept the
                    <a href="/privacy" className="text-blue-600 hover:underline ml-1">privacy policy</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full hover:scale-105 transition-transform duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      {/* {showWelcomeModal && newUser && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          userRole={newUser.role}
          userName={newUser.name}
          onCompleteProfile={handleCompleteProfile}
          onGoToDashboard={handleGoToDashboard}
          profileCompletion={85}
        />
      )} */}
    </>
  );
}
