
import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import type { DropdownModule } from "@/services/modules/dropdowns/dropdown.types";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  businessName: z.string().min(1, { message: "Business name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  vendorCategory: z.string().min(1, { message: "Vendor category is required" }),
  specialization: z.array(z.string()).min(1, { message: "Select at least one specialization" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
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
});

const vendorCategories = [
  "Service Vendor",
  "Product Vendor", 
  "Logistics Vendor"
];

// Map vendor category to API module
const getVendorModule = (category: string): DropdownModule => {
  switch (category) {
    case 'Service Vendor': return 'serviceVendor';
    case 'Product Vendor': return 'productVendor';
    case 'Logistics Vendor': return 'logisticsVendor';
    default: return 'serviceVendor';
  }
};

export function VendorFormEnhanced() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { signUp, isLoading } = useAuth();

  // Fetch specialization options based on selected category
  const vendorModule = getVendorModule(selectedCategory);
  const { options: specializationOptions, isLoading: isLoadingOptions } = useDropdownOptions(
    vendorModule, 
    'specialization',
    { enabled: !!selectedCategory }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      businessName: "",
      email: "",
      phone: "",
      vendorCategory: "",
      specialization: [],
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const navigate = useNavigate();

  // Clear specialization when category changes
  useEffect(() => {
    if (selectedCategory) {
      form.setValue("specialization", []);
    }
  }, [selectedCategory, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const registrationData = {
      email: values.email,
      password: values.password,
      phone: values.phone,
      userType: 'Vendor',
      userSubType: values.vendorCategory.replace(' ', ''),
      firstName: values.firstName,
      lastName: values.lastName,
      businessName: values.businessName,
      vendorCategory: values.vendorCategory,
      specialization: values.specialization,
      termsAccepted: values.termsAccepted,
      privacyAccepted: values.privacyAccepted
    };

    const result = await signUp(registrationData);
    
    // Redirect to vendor settings instead of dashboard
    if (result.success) {
      navigate('/vendor-settings');
    }
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

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
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Business Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Coastal Services Ltd." 
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
          
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vendorCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Vendor Category</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200">
                        <SelectValue placeholder="Select vendor category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white shadow-lg border border-gray-200 z-50">
                      {vendorCategories.map((category) => (
                        <SelectItem key={category} value={category} className="text-gray-900 hover:bg-gray-100">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Specialization</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={specializationOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select specializations"
                      isLoading={isLoadingOptions}
                      disabled={!selectedCategory}
                      error={!!form.formState.errors.specialization}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
    </>
  );
}
