
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
// MODIFIED: Import useFieldArray for dynamic address fields
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
// MODIFIED: Import new icons for add/remove functionality
import { Building, Mail, Phone, Calendar, MapPin, CheckCircle2, XCircle, Loader2, AlertTriangle, Edit, PlusCircle, Trash2, Globe, Check } from "lucide-react";
import { countryCodes, CountryCodeSelectField } from "@/components/ui/CountryCodeSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/vendor/ui/MultiSelect";
import { Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { industries } from "@/constants/Types";
import { Info } from "lucide-react";


const indianStatesAndCities: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada", "Rajahmundry", "Nellore", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Raigarh", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Hisar", "Rohtak", "Karnal", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Kullu", "Mandi", "Hamirpur", "Chamba"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Kalaburagi (Gulbarga)", "Shivamogga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad (Chhatrapati Sambhaji Nagar)", "Solapur", "Thane", "Kolhapur"],
  "Manipur": ["Imphal", "Churachandpur", "Bishnupur", "Thoubal"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur", "Balasore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida", "Prayagraj (Allahabad)", "Meerut", "Bareilly", "Aligarh", "Gorakhpur", "Jhansi"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Haldia", "Kharagpur", "Darjeeling"]
};

const indianStates = Object.keys(indianStatesAndCities).map(state => ({ label: state, value: state }));
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const phoneCharRegex = /^\+?[\d\s-()]*$/;
const currentYear = new Date().getFullYear();
// OTP Input (unchanged)
interface OtpInputProps { value: string; onChange: (value: string) => void; length: number; disabled?: boolean; }
const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length, disabled }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => { const entry = e.target.value; if (/^\d$/.test(entry) || entry === "") { const newOtp = value.split(''); newOtp[index] = entry; onChange(newOtp.join('').slice(0, length)); if (entry && index < length - 1) { inputRefs.current[index + 1]?.focus(); } } };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => { if (e.key === "Backspace" && !value[index] && index > 0) { inputRefs.current[index - 1]?.focus(); } };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); const pastedData = e.clipboardData.getData("text").trim().slice(0, length); if (/^\d+$/.test(pastedData)) { onChange(pastedData); const nextFocusIndex = Math.min(pastedData.length, length - 1); setTimeout(() => inputRefs.current[nextFocusIndex]?.focus(), 0); } };
  return (<div className="flex items-center space-x-2" onPaste={handlePaste}>{Array.from({ length }).map((_, index) => (<Input key={index} ref={(el) => (inputRefs.current[index] = el)} type="tel" inputMode="numeric" maxLength={1} value={value[index] || ""} onChange={(e) => handleInputChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} disabled={disabled} className="w-12 h-12 text-center text-lg font-semibold" aria-label={`OTP digit ${index + 1}`} />))}</div>);
};

const phoneValidation = z.string().optional().or(z.literal("")).refine((value) => { if (!value) return true; if (!phoneCharRegex.test(value)) return false; const digits = value.replace(/\D/g, ''); return digits.length >= 7 && digits.length <= 15; }, { message: "Please enter a valid number with 7 to 15 digits." });

// MODIFIED: Address schema now includes an 'isPrimary' flag
const addressSchema = z.object({
  id: z.string().optional(), // For React key prop, not part of the data itself
  line1: z.string().min(5, { message: "Required" }),
  city: z.string().min(1, { message: "Required" }),
  state: z.string().min(1, { message: "Required" }),
  pincode: z
    .string()
    .min(1, { message: "Required" })
    .regex(/^\d{6}$/, { message: "Please enter a valid 6-digit pincode" }),
  isPrimary: z.boolean().default(false).optional(),
});

// MODIFIED: Main company schema now uses an array of addresses
const companySchema = z.object({
  companyName: z.string().min(1, { message: "Required" }),
  industryType: z.string().min(1, { message: "Required" }),
  companyDescription: z
    .string()
    .min(50, { message: "Required" })
    .max(1000, { message: "Company description cannot exceed 1000 characters" }),
  gstNumber: z
    .string()
    .min(1, { message: "Required" })
    .refine((value) => gstRegex.test(value), {
      message: "Invalid GST Number format. Please check and try again.",
    }),
  registrationNumber: z.string().min(1, { message: "Required" }),
  email: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Invalid email address" }),

  // ✅ Make `mobile` required, others optional
  telephone: phoneValidation.optional(),
  mobile: z.string().min(1, { message: "Required" }).pipe(phoneValidation),
  fax: phoneValidation.optional(),

  addresses: z.array(addressSchema)
    .min(1, "Required")
    .refine((addresses) => addresses.filter(addr => addr.isPrimary).length === 1, {
      message: "Exactly one address must be marked as primary.",
      path: ["addresses"],
    }),
  warehouseLocations: z.array(z.string()),

  yearEstablished: z.string()
    .min(4, { message: "Required" })
    .refine((val) => /^\d{4}$/.test(val), { // Fix: Corrected typo (`refine` not `refine`)
      message: "Year must be exactly 4 digits",
    })
    .refine((val) => parseInt(val) <= currentYear, {
      message: `Year cannot be in the future (max ${currentYear})`,
    }),

  website: z.string().optional(), // Optional
});


type FormValues = z.infer<typeof companySchema>;

// const industryOptions = [ { label: "Sugar Mill", value: "sugar_mill" }, { label: "Cement Plant", value: "cement_plant" }, { label: "Steel Plant", value: "steel_plant" }, { label: "Pharmaceutical", value: "pharmaceutical" }, { label: "Food Processing", value: "food_processing" }, { label: "Automotive", value: "automotive" }, { label: "Chemical", value: "chemical" }, { label: "Textile", value: "textile" }, { label: "Refinery", value: "refinery" }, { label: "Power Plant", value: "power_plant" }, { label: "Paper Mill", value: "paper_mill" }, { label: "Mining", value: "mining" }, ].sort((a, b) => a.label.localeCompare(b.label));
// const productCategoryOptions = [ { label: "Electrical Components", value: "electrical" }, { label: "Mechanical Parts", value: "mechanical" }, { label: "Pneumatic Systems", value: "pneumatic" }, { label: "Hydraulic Components", value: "hydraulic" }, { label: "Safety Equipment", value: "safety" }, { label: "Instrumentation", value: "instrumentation" }, { label: "Process Control", value: "process_control" }, { label: "Pumps & Valves", "value": "pumps_valves" }, { label: "Motors & Drives", value: "motors_drives" }, { label: "Maintenance Tools", value: "maintenance_tools" }, { label: "Laboratory Equipment", value: "laboratory" }, { label: "Raw Materials", value: "raw_materials" }, ].sort((a, b) => a.label.localeCompare(b.label));
// const phoneTypes = [ { id: "mobile", label: "Mobile" }, { id: "telephone", label: "Landline" }, { id: "fax", label: "Fax" }, ];

// MODIFIED: Default values now use the 'addresses' array structure
const defaultValues: FormValues = {
  companyName: "",
  industryType: "",
  companyDescription: "",
  gstNumber: "",
  registrationNumber: "",
  email: "",
  telephone: "",
  mobile: "",
  fax: "",
  // MODIFIED: Initial addresses array
  addresses: [
    {
      line1: "",
      city: "",
      state: "",
      pincode: "",
      isPrimary: true, // First address is primary by default
    },
    {
      line1: "",
      city: "",
      state: "",
      pincode: "",
      isPrimary: false,
    },
  ],
  warehouseLocations: ["", ""],
  yearEstablished: "",
  website: "",
};


const CompanyInfoForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // (State for verifications remains the same)
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [gstVerificationStatus, setGstVerificationStatus] = useState<'idle' | 'success' | 'not_found' | 'error'>('idle');
  const [verifiedGstData, setVerifiedGstData] = useState<{ legalName: string } | null>(null);
  const [isVerifyingRegNo, setIsVerifyingRegNo] = useState(false);
  const [regNoVerificationStatus, setRegNoVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isVerifyingMobileOtp, setIsVerifyingMobileOtp] = useState(false);
  const [showMobileOtpInput, setShowMobileOtpInput] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileTimer, setMobileTimer] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(companySchema),
    defaultValues,
    mode: "onChange",
  });

  // NEW: Setting up useFieldArray for dynamic addresses
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
    keyName: "id", // Use 'id' from addressSchema for React keys
  });

  // (useEffect hooks remain the same)
  useEffect(() => { if (emailTimer <= 0) return; const interval = setInterval(() => setEmailTimer((prev) => prev - 1), 1000); return () => clearInterval(interval); }, [emailTimer]);
  useEffect(() => { if (mobileTimer <= 0) return; const interval = setInterval(() => setMobileTimer((prev) => prev - 1), 1000); return () => clearInterval(interval); }, [mobileTimer]);
  useEffect(() => { const subscription = form.watch((value, { name }) => { if (!isEditing) return; if (name === 'gstNumber') { setGstVerificationStatus('idle'); setVerifiedGstData(null); } if (name === 'registrationNumber') { setRegNoVerificationStatus('idle'); } if (name === 'email') { setEmailVerified(false); setShowEmailOtpInput(false); setEmailOtp(""); setEmailTimer(0); } if (name === 'mobile') { setMobileVerified(false); setShowMobileOtpInput(false); setMobileOtp(""); setMobileTimer(0); } }); return () => subscription.unsubscribe(); }, [form, isEditing]);

  // (Verification handlers remain the same)
  const handleVerifyGst = async () => { const isFormatValid = await form.trigger("gstNumber"); if (!isFormatValid) { toast.error("Please enter a valid GSTIN format before verifying."); return; } const gstValue = form.getValues("gstNumber"); if (!gstValue) return; setIsVerifyingGst(true); setGstVerificationStatus('idle'); setVerifiedGstData(null); setTimeout(() => { if (gstValue.endsWith('Z5')) { setGstVerificationStatus('success'); setVerifiedGstData({ legalName: 'DUMMY INNOVATECH SOLUTIONS' }); toast.success("GSTIN verified successfully!"); } else if (gstValue.endsWith('Z4')) { setGstVerificationStatus('not_found'); toast.warning("GSTIN not found in the official registry."); } else { setGstVerificationStatus('error'); toast.error("An error occurred during verification."); } setIsVerifyingGst(false); }, 1500); };
  const handleVerifyRegNo = async () => { const isFormatValid = await form.trigger("registrationNumber"); if (!isFormatValid) return; const regNoValue = form.getValues("registrationNumber"); if (!regNoValue) return; setIsVerifyingRegNo(true); setRegNoVerificationStatus('idle'); setTimeout(() => { if (regNoValue.toUpperCase().includes('FAIL')) { setRegNoVerificationStatus('error'); toast.error("Registration Number could not be verified."); } else { setRegNoVerificationStatus('success'); toast.success("Registration Number verified successfully!"); } setIsVerifyingRegNo(false); }, 1500); };
  const handleSendOtp = async (type: 'email' | 'mobile') => { const fieldIsValid = await form.trigger(type); if (!fieldIsValid) return; if (type === 'email') { setIsSendingEmailOtp(true); setTimeout(() => { setIsSendingEmailOtp(false); setShowEmailOtpInput(true); setEmailTimer(30); toast.success(`OTP sent to ${form.getValues("email")}`); }, 1000); } else { setIsSendingMobileOtp(true); setTimeout(() => { setIsSendingMobileOtp(false); setShowMobileOtpInput(true); setMobileTimer(30); toast.success(`OTP sent to ${form.getValues("mobile")}`); }, 1000); } };
  const handleVerifyOtp = async (type: 'email' | 'mobile') => { const otpValue = type === 'email' ? emailOtp : mobileOtp; if (otpValue !== '1234') { toast.error("Invalid OTP. Please try again."); return; } if (type === 'email') { setIsVerifyingEmailOtp(true); setTimeout(() => { setEmailVerified(true); setShowEmailOtpInput(false); toast.success("Email verified successfully!"); setIsVerifyingEmailOtp(false); }, 1000); } else { setIsVerifyingMobileOtp(true); setTimeout(() => { setMobileVerified(true); setShowMobileOtpInput(false); toast.success("Mobile number verified successfully!"); setIsVerifyingMobileOtp(false); }, 1000); } };


  const [showInfo, setShowInfo] = useState(false);

  const onSubmit = (values: FormValues) => {
    if (isEditing && (!emailVerified || (form.getValues("mobile") && !mobileVerified))) {
      toast.error("Please verify your email and mobile number before saving.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      // NEW: Example of how to pull primary address data for other sections
      const primaryAddress = values.addresses.find(addr => addr.isPrimary);
      console.log("Form values:", values);
      console.log("Primary Address for other sections:", primaryAddress);

      setIsSubmitting(false);
      setIsEditing(false);
      toast.success("Company information updated successfully!");
      form.reset(values); // Reset with the new saved values
    }, 1000);
  };

  const handleCancel = () => { form.reset(defaultValues); setIsEditing(false); setGstVerificationStatus('idle'); setVerifiedGstData(null); setRegNoVerificationStatus('idle'); setEmailVerified(false); setShowEmailOtpInput(false); setEmailOtp(""); setEmailTimer(0); setMobileVerified(false); setShowMobileOtpInput(false); setMobileOtp(""); setMobileTimer(0); };
  const onFormError = (errors: any) => { console.error("Form validation errors:", errors); toast.error("Please correct the highlighted errors before saving."); if (errors.addresses?.message) toast.error(errors.addresses.message); };

  // (Warehouse and Phone Type handlers remain the same)
  const [newWarehouseLocation, setNewWarehouseLocation] = useState("");
  const addWarehouseLocation = () => { if (newWarehouseLocation.trim() === "") return; const currentLocations = form.getValues("warehouseLocations") || []; form.setValue("warehouseLocations", [...currentLocations, newWarehouseLocation.trim()]); setNewWarehouseLocation(""); };
  const removeWarehouseLocation = (index: number) => { const currentLocations = form.getValues("warehouseLocations") || []; form.setValue("warehouseLocations", currentLocations.filter((_, i) => i !== index)); };
  const handlePhoneTypeChange = (id: 'telephone' | 'mobile' | 'fax', checked: boolean) => { if (!isEditing) return; if (checked) { form.setValue(id, ""); } else { form.setValue(id, undefined); form.clearErrors(id); if (id === 'mobile') { setMobileVerified(false); setShowMobileOtpInput(false); setMobileOtp(""); setMobileTimer(0); } } };

  // NEW: Handlers for dynamic addresses
  const handleAddAddress = () => {
    append({
      line1: "",
      city: "",
      state: "",
      pincode: "",
      // If it's the very first address, make it primary. Otherwise, don't.
      isPrimary: fields.length === 0,
    });
  };

  const handleRemoveAddress = (index: number) => {
    const currentAddresses = form.getValues("addresses");
    const addressToRemove = currentAddresses[index];
    if (addressToRemove.isPrimary) {
      const isConfirmed = window.confirm(
        "This is your primary address. Are you sure you want to delete it?\nA new primary address will be assigned automatically."
      );

      // If the user clicks "Cancel" on the dialog, stop the function here.
      if (!isConfirmed) {
        return;
      }
    }

    // If we're removing the primary address and there's more than one address...
    if (addressToRemove.isPrimary && currentAddresses.length > 1) {
      // Find the next available address to make primary.
      const newPrimaryIndex = index === 0 ? 1 : 0;
      form.setValue(`addresses.${newPrimaryIndex}.isPrimary`, true);
    }

    remove(index);
    form.trigger("addresses"); // Re-validate the addresses array
  };

  const handleSetPrimary = (selectedIndex: number) => {
    fields.forEach((_field, index) => {
      form.setValue(`addresses.${index}.isPrimary`, index === selectedIndex, {
        shouldDirty: true,
        shouldTouch: true,
        // We prevent validation on each loop to avoid performance issues
        shouldValidate: false,
      });
    });
    // After all values are set, we trigger validation for the addresses array once.
    form.trigger("addresses");
  };

  const handleCountryCodeSelectionChange = () => {
    form.setValue("mobile", "");
    form.clearErrors("mobile");
  };

  const industryOptions = industries.map((industry:any) => ({
    label: industry,
    value: industry,
  }));

  const phoneTypes = [
    { id: "mobile", label: "Mobile" },
    { id: "telephone", label: "Landline" },
    { id: "fax", label: "Fax" },
  ];
  return (
    <Card className="border-0 bg-white m-6">
      <div>
        <CardHeader className="flex flex-row items-start justify-between">
          {/* Left side - Title + Info (aligned to top) */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <CardTitle className="mr-2 mt-2 text-primary-500">Company Information</CardTitle>
              <button
                type="button"
                onClick={() => setShowInfo((prev) => !prev)}
                className="text-muted-foreground hover:text-blue-900 transition"
              >
                <Info className="h-5 w-5 mt-2" />
              </button>
            </div>

            {/* Fixed space for description (prevents layout shift) */}
            <div className="min-h-[20px]"> {/* `min-h` ensures space even when empty */}
              {showInfo && (
                <CardDescription className="text-sm text-muted-foreground">
                  {isEditing ? "Update your company details." : "View your company details."}
                </CardDescription>
              )}
            </div>
          </div>

          {/* Right side - Edit button (aligned to top) */}
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="mt-[10px] text-primary-500">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          )}
        </CardHeader>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-500 text-primary-500">Company Name</FormLabel>
                    <div className="relative">
                      {/* <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                      <FormControl>
                        <Input placeholder="e.g Tech Solutions"  {...field} disabled={!isEditing} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="yearEstablished" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-500">Year Established</FormLabel>
                    <div className="relative">
                      {/* <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                      <FormControl>
                        <Input placeholder="e.g 2010" {...field} disabled={!isEditing} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField
                control={form.control}
                name="industryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-500">Industry Type</FormLabel>
                    <FormControl>
                      {isEditing ? (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue className="text-gray-200" placeholder="Select industries" />
                          </SelectTrigger>
                          <SelectContent
                            side="bottom"
                            className="w-full max-h-60 overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
                          >
                            <div className="max-h-60 overflow-y-auto">
                              {industryOptions.map((industry) => (
                                <SelectItem
                                  key={industry.value}
                                  value={industry.value}
                                  className="pr-3"
                                >
                                  <div className="w-full text-left">{industry.label}</div>
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>

                      ) : (
                        <div className="flex flex-wrap gap-2 min-h-[40px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm">
                          {field.value ? (
                            <div className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
                              {
                                industryOptions.find(opt => opt.value === field.value)?.label || field.value
                              }
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Select Industries</span>
                          )}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />




              <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-500">Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g Describe your company, specialization, and value proposition"
                        className="min-h-32"
                        {...field}
                        maxLength={1000}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <FormMessage className="text-left truncate" />
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <FormDescription className="text-right">
                          {field.value?.length || 0} / 1000
                        </FormDescription>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-primary-500">
                        GST Number
                        {gstVerificationStatus === "success" && verifiedGstData && ( // Only show if status is success and data exists
                          <Badge className="bg-green-100 text-green-600 hover:bg-green-200 flex items-center space-x-1 ml-2">
                            <Check className="h-3 w-3" />
                            <span>Verified</span>
                          </Badge>
                        )}
                      </FormLabel>

                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="e.g 29AAAAA0000A1Z5"
                            {...field}
                            value={field.value ?? ""}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        {isEditing && (
                          <Button
                            type="button"
                            onClick={handleVerifyGst}
                            disabled={isVerifyingGst || !field.value}
                            className="bg-[#1890ff] text-white hover:bg-blue-700"
                          >
                            {isVerifyingGst ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        )}
                      </div>

                      {/* 🛠 Move this above the verification messages */}
                      <FormMessage className="text-sm text-red-600 mt-1" />

                      {/* Verification Messages */}
                      <div className="mt-1 text-sm min-h-[20px]">
                        {/* {gstVerificationStatus === "success" && verifiedGstData && (
      <div className="flex items-center text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        <span>
          Verified: <strong>{verifiedGstData.legalName}</strong>
        </span>
      </div>
    )} */}
                        {gstVerificationStatus === "not_found" && (
                          <div className="flex items-center text-yellow-600">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <span>This GSTIN could not be found.</span>
                          </div>
                        )}
                        {gstVerificationStatus === "error" && (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span>Verification failed. Please try again later.</span>
                          </div>
                        )}
                      </div>
                    </FormItem>

                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-primary-500">
                        Registeration Number
                        {regNoVerificationStatus === "success" && ( // Only show if status is success
                          <Badge className="bg-green-100 text-green-600 hover:bg-green-200 flex items-center space-x-1 ml-2">
                            <Check className="h-3 w-3" />
                            <span>Verified</span>
                          </Badge>
                        )}
                      </FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="e.g U74999DL2010PTC201234"
                            {...field}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        {isEditing && (
                          <Button
                            type="button"
                            onClick={handleVerifyRegNo}
                            disabled={isVerifyingRegNo || !field.value}
                            className="bg-[#1890ff] text-white hover:bg-blue-700"
                          >
                            {isVerifyingRegNo ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        )}
                      </div>

                      {/* ✅ Move this here just below the input */}
                      <FormMessage className="text-sm text-red-600 mt-1" />

                      {/* Verification Message */}
                      <div className="mt-1 text-sm min-h-[20px]">
                        {/* {regNoVerificationStatus === "success" && (
      <div className="flex items-center text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        <span>Verified successfully.</span>
      </div>
    )} */}
                        {regNoVerificationStatus === "error" && (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span>Verification failed. Please try again.</span>
                          </div>
                        )}
                      </div>
                    </FormItem>

                  )}
                />
              </div>

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-primary-500">Email {emailVerified && <Badge className="bg-green-100 text-green-600 hover:bg-green-200 flex items-center space-x-1 ml-2">
                    <Check className="h-3 w-3" />
                    <span>Verified</span>
                  </Badge>}</FormLabel>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">

                      <FormControl>
                        <Input placeholder="e.g contact@innovatech.com"  {...field} disabled={!isEditing || showEmailOtpInput} />
                      </FormControl>
                    </div>
                    {isEditing && !emailVerified && <Button className="bg-[#1890ff] text-white hover:bg-blue-700" type="button" onClick={() => handleSendOtp('email')} disabled={isSendingEmailOtp || emailTimer > 0 || !!form.getFieldState('email').error}>
                      {isSendingEmailOtp ? <Loader2 className="h-4 w-4 animate-spin" /> :
                        emailTimer > 0 ? `Resend in ${emailTimer}s` :
                          showEmailOtpInput ? 'Resend OTP' : 'Verify'}
                    </Button>}
                  </div>
                  <FormMessage />
                  {showEmailOtpInput && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md border space-y-2">
                      <FormLabel>Enter 4-Digit OTP for Email</FormLabel>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                        <OtpInput value={emailOtp} onChange={setEmailOtp} length={4} disabled={isVerifyingEmailOtp} />
                        <Button type="button" onClick={() => handleVerifyOtp('email')} disabled={isVerifyingEmailOtp || emailOtp.length !== 4}>
                          {isVerifyingEmailOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                        </Button>
                      </div>
                    </div>
                  )}
                </FormItem>
              )} />

              <div className="space-y-2">
                <FormLabel className="text-primary-500">Contact Numbers</FormLabel>
                <div className="flex items-center space-x-4 pt-2">
                  {phoneTypes.map((phone) => (
                    <div key={phone.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={phone.id}
                        checked={form.watch(phone.id as 'telephone' | 'mobile' | 'fax') !== undefined}
                        onCheckedChange={(checked) =>
                          handlePhoneTypeChange(phone.id as 'telephone' | 'mobile' | 'fax', !!checked)
                        }
                        onClick={phone.id === 'mobile' ? (e) => e.preventDefault() : undefined}
                        disabled={!isEditing}
                        className={phone.id === 'mobile' ? 'opacity-40 pointer-events-none' : ''}
                      />
                      <label
                        htmlFor={phone.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {phone.label}
                      </label>
                    </div>
                  ))}
                </div>



                {form.watch('mobile') !== undefined && (
                  <FormField control={form.control} name="mobile" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-primary-500 space-x-4 pt-4">
                        Mobile
                        {mobileVerified && <Badge className="bg-green-100 text-green-600 hover:bg-green-200 flex items-center space-x-1 ml-2">
                          <Check className="h-3 w-3" />
                          <span>Verified</span>
                        </Badge>}
                      </FormLabel>
                      <div className="flex items-center space-x-2">



                        {/* ISO Code Dropdown */}
                        <CountryCodeSelectField className="w-28"
                          control={form.control}
                          name="countryCode"
                          onValueChange={handleCountryCodeSelectionChange}
                          triggerPlaceholder="ISD"
                          disabled={!isEditing}
                        />

                        {/* Mobile number input */}
                        <div className="relative flex-grow">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="e.g 9876543210"
                              {...field}
                              value={field.value ?? ""}
                              disabled={!isEditing || showMobileOtpInput}
                              className="pl-10"
                            />
                          </FormControl>
                        </div>

                        {isEditing && !mobileVerified && (
                          <Button
                            type="button"
                            className="bg-[#1890ff] text-white hover:bg-blue-700"
                            onClick={() => handleSendOtp('mobile')}
                            disabled={isSendingMobileOtp || mobileTimer > 0 || !field.value || !!form.getFieldState('mobile').error}
                          >
                            {isSendingMobileOtp ? <Loader2 className="h-4 w-4 animate-spin" /> :
                              mobileTimer > 0 ? `Resend in ${mobileTimer}s` :
                                showMobileOtpInput ? 'Resend OTP' : 'Verify'}
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                      {showMobileOtpInput && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md border space-y-2">
                          <FormLabel>Enter 4-Digit OTP for Mobile</FormLabel>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                            <OtpInput value={mobileOtp} onChange={setMobileOtp} length={4} disabled={isVerifyingMobileOtp} />
                            <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto" onClick={() => handleVerifyOtp('mobile')} disabled={isVerifyingMobileOtp || mobileOtp.length !== 4}>
                              {isVerifyingMobileOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )} />
                )}
                {form.watch('telephone') !== undefined && (
                  <FormField control={form.control} name="telephone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-500">Landline (Optional)</FormLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="e.g 01145678901" {...field} value={typeof field.value === "string" ? field.value : ""} disabled={!isEditing} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                {form.watch('fax') !== undefined && (
                  <FormField control={form.control} name="fax" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-500">Fax (Optional)</FormLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="e.g 5551234567" {...field} value={field.value ?? ""} disabled={!isEditing} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>

              <div className="space-y-4">
                <FormLabel className="text-base font-semibold text-primary-500">Company Addresses</FormLabel>
                {fields.map((field, index) => {
                  const selectedState = form.watch(`addresses.${index}.state`);
                  const citiesForThisAddress = selectedState ? (indianStatesAndCities[selectedState] || []).map(city => ({ label: city, value: city })) : [];
                  return (
                    <div key={field.id} className="space-y-4 rounded-md border p-4 relative bg-slate-50/50">
                      {/* --- MODIFIED HEADER SECTION --- */}
                      <div className="flex justify-between items-center mb-2">
                        {/* Group for left-aligned content: Title and Primary Status */}
                        <div className="flex items-center gap-x-4">
                          <h4 className="text-base font-semibold text-primary-500">
                            {index === 0
                              ? "Registered Address"
                              : index === 1
                                ? "Plant Address"
                                : `Address ${index + 1}`}
                          </h4>


                          {/* MOVED: Primary status badge for view mode */}
                          {!isEditing && form.getValues(`addresses.${index}.isPrimary`) && (
                            <div className="flex items-center text-sm font-semibold text-green-700 bg-green-100/60 rounded-full px-3 py-1">
                              <Check className="h-4 w-4 mr-2" /> Primary Address
                            </div>
                          )}

                          {/* MOVED & RESTYLED: Primary status checkbox for edit mode */}
                          {isEditing && (
                            <FormField control={form.control} name={`addresses.${index}.isPrimary`} render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={() => handleSetPrimary(index)} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    Set as Primary Address
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )} />
                          )}
                        </div>

                        {/* Remove button remains on the right */}
                        {isEditing && (<Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleRemoveAddress(index)} disabled={fields.length <= 1} aria-label="Remove Address"><Trash2 className="h-4 w-4" /></Button>)}
                      </div>

                      {/* Address Line */}
                      <FormField control={form.control} name={`addresses.${index}.line1`} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-500">Address Line</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="e.g Plot 123, Industrial Area" {...field} disabled={!isEditing} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name={`addresses.${index}.state`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary-500">State</FormLabel>
                            <Select onValueChange={(value) => { field.onChange(value); form.setValue(`addresses.${index}.city`, ""); }} value={field.value} disabled={!isEditing}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger></FormControl>
                              <SelectContent>{indianStates.map((state) => (<SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`addresses.${index}.city`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary-500">City</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing || !selectedState}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger></FormControl>
                              <SelectContent>{citiesForThisAddress.map((city) => (<SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`addresses.${index}.pincode`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary-500">PIN Code</FormLabel>
                            <FormControl><Input placeholder="e.g., 400001" {...field} disabled={!isEditing} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      {/* --- DELETED --- The primary address elements that were previously here have been moved to the header */}

                    </div>
                  )
                })}
                {isEditing && (
                  <Button type="button" variant="outline" className="w-full" onClick={handleAddAddress}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Address
                  </Button>
                )}
                <FormMessage>{form.formState.errors.addresses?.message}</FormMessage>
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-500">

                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="e.g https://www.tataindustries.com"
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>

            {isEditing && (
              <CardFooter className="flex justify-end gap-2 border-t bg-gray-50/50 px-6 py-4">
                <Button type="submit" disabled={isSubmitting} className="bg-[#1890ff] hover:bg-blue-700">
                  {isSubmitting ? (<span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</span>) : ("Save")}
                </Button>
                <Button variant="outline" type="button" disabled={isSubmitting} onClick={handleCancel}>Cancel</Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default CompanyInfoForm;