import React, { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { format, differenceInDays } from 'date-fns';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus, Trash2, ArrowLeft, Eye, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PurchaseOrderStepIndicator from '@/components/purchase-order/PurchaseOrderStepIndicator';
import { ISO9001TermsSection } from '@/components/industry/workflow/ISO9001TermsSection';
import POReviewStep from '@/components/purchase-order/POReviewStep';
import SOWDocumentUpload from '@/components/purchase-order/SOWDocumentUpload';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import { usePOPrefill } from '@/hooks/usePOFromQuotation';

// Type for uploaded files
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Define step type
export type POStepType = 1 | 2 | 3 | 4 | 5;

// Define the form schema
const formSchema = z.object({
  poNumber: z.string().min(1, "PO Number is required"),
  vendor: z.string().min(1, "Vendor is required"),
  projectTitle: z.string().min(3, "Project title must be at least 3 characters"),
  orderValue: z.coerce.number().min(1, "Order value is required"),
  taxPercentage: z.coerce.number().min(0, "Tax percentage cannot be negative"),
  totalValue: z.coerce.number(),
  startDate: z.date({
    required_error: "Start date is required"
  }),
  endDate: z.date({
    required_error: "End date is required"
  }),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  specialInstructions: z.string().default(''),
  scopeOfWork: z.string().min(1, "Scope of work is required"),
  deliverables: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Deliverable description is required")
  })),
  paymentMilestones: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Milestone description is required"),
    percentage: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100"),
    dueDate: z.date({
      required_error: "Due date is required"
    })
  })),
  acceptanceCriteria: z.array(z.object({
    id: z.string(),
    criteria: z.string().min(1, "Acceptance criteria is required")
  }))
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
});

type FormValues = z.infer<typeof formSchema>;

// Type-safe interfaces for component data flow
interface CompletePOData extends FormValues {
  isoTerms?: string[];
  customTerms?: string;
}

interface POValidationState {
  isFormValid: boolean;
  hasRequiredFields: boolean;
  validationErrors: string[];
}

// Custom hook for form data management
const usePOFormData = (form: UseFormReturn<FormValues>) => {
  // Type-safe data preparation for review
  const prepareReviewData = useCallback((): FormValues | null => {
    const values = form.getValues();

    // Validate that all required fields have values
    if (!values.poNumber || !values.vendor || !values.projectTitle ||
      !values.startDate || !values.endDate || !values.paymentTerms ||
      !values.scopeOfWork) {
      return null;
    }

    // After validation, we can safely cast - all required fields are guaranteed to exist
    return values as FormValues;
  }, [form]);

  // Create complete PO data for final submission
  const createCompletePOData = useCallback((isoTerms: string[], customTerms: string): CompletePOData | null => {
    const reviewData = prepareReviewData();
    if (!reviewData) return null;

    return {
      ...reviewData,
      isoTerms,
      customTerms
    };
  }, [prepareReviewData]);

  return {
    prepareReviewData,
    createCompletePOData
  };
};

// Custom hook for form validation state
const usePOValidation = (form: UseFormReturn<FormValues>) => {
  const [validationState, setValidationState] = useState<POValidationState>({
    isFormValid: false,
    hasRequiredFields: false,
    validationErrors: []
  });

  const validateForm = useCallback(async (): Promise<boolean> => {
    const result = await form.trigger();
    const errors = form.formState.errors;
    const errorMessages = Object.values(errors).map(error => error?.message || 'Validation error').filter(Boolean);

    setValidationState({
      isFormValid: result,
      hasRequiredFields: result,
      validationErrors: errorMessages
    });

    return result;
  }, [form]);

  return {
    validationState,
    validateForm
  };
};

const CreatePurchaseOrder: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quotationId = searchParams.get('quotationId') || '';

  const [currentStep, setCurrentStep] = useState<POStepType>(3);
  const [selectedISOTerms, setSelectedISOTerms] = useState<string[]>([]);
  const [customISOTerms, setCustomISOTerms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [sopDocuments, setSopDocuments] = useState<UploadedFile[]>([]);

  // Fetch quotation data for pre-fill if quotationId is present
  const { data: prefillData, isLoading: isPrefillLoading } = usePOPrefill(quotationId || undefined);

  // Generate unique PO number
  const generatePONumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PO-${year}${month}-${random}`;
  }, []);

  // Vendors list - in a real app this would come from API
  const vendors = [
    { id: "1", name: "Acme Industrial Supplies" },
    { id: "2", name: "Tech Manufacturing Co." },
    { id: "3", name: "Global Equipment Ltd." }
  ];

  // Initialize the form with all required fields properly typed
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poNumber: generatePONumber(),
      vendor: "",
      projectTitle: "Industrial Equipment Procurement",
      orderValue: 0,
      taxPercentage: 10,
      totalValue: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      paymentTerms: "",
      specialInstructions: "",
      scopeOfWork: "",
      deliverables: [],
      paymentMilestones: [],
      acceptanceCriteria: []
    }
  });

  // Custom hooks for type-safe data management
  const { prepareReviewData, createCompletePOData } = usePOFormData(form);
  const { validationState, validateForm } = usePOValidation(form);

  // Watch form values for reactive updates
  const orderValue = form.watch("orderValue");
  const taxPercentage = form.watch("taxPercentage");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const deliverables = form.watch("deliverables");
  const acceptanceCriteria = form.watch("acceptanceCriteria");

  // Calculate total value and duration
  useEffect(() => {
    if (orderValue && taxPercentage >= 0) {
      const taxAmount = orderValue * (taxPercentage / 100);
      const total = orderValue + taxAmount;
      form.setValue("totalValue", total);
    }
  }, [orderValue, taxPercentage, form]);

  // Handle step navigation
  const handleStepClick = (step: POStepType) => {
    setCurrentStep(step);
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 3) {
      setCurrentStep((prev) => (prev - 1) as POStepType);
    }
  };

  // Handle next step with validation
  const handleNext = async () => {
    if (currentStep === 3) {
      // Moving from PO Details to Review - validate form
      const isValid = await validateForm();
      if (isValid) {
        setCurrentStep(4);
      } else {
        toast({
          title: "Please Fix Form Errors",
          description: validationState.validationErrors[0] || "Some required fields are missing or invalid. Please review the form.",
          variant: "destructive"
        });
      }
    } else if (currentStep === 4) {
      // Moving from Review to Final Creation
      setCurrentStep(5);
    }
  };

  // Handle going back to edit from review
  const handleBackToEdit = () => {
    setCurrentStep(3);
  };

  // Handle final PO creation and delivery
  const handleCreatePurchaseOrder = async () => {
    setIsSubmitting(true);
    try {
      const completePOData = createCompletePOData(selectedISOTerms, customISOTerms);

      if (!completePOData) {
        throw new Error('Form data is incomplete');
      }

      // Create the purchase order object with pending_approval status
      const purchaseOrder = {
        ...completePOData,
        status: 'pending_approval', // Changed from 'issued' to 'pending_approval'
        createdAt: new Date().toISOString(),
        deliveredToVendor: false, // Will be set to true after approval
        recordedInSystem: true,
      };

      console.log("Creating Purchase Order for Approval:", purchaseOrder);

      // Simulate PO creation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      toast({
        title: "Purchase Order Submitted!",
        description: `PO ${completePOData.poNumber} has been submitted for approval and will be sent to ${vendors.find(v => v.id === completePOData.vendor)?.name || 'the vendor'} after approval.`,
      });

      // Navigate to Purchase Orders page
      setTimeout(() => {
        navigate('/dashboard/purchase-orders');
      }, 2000);

    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast({
        title: "Error Submitting Purchase Order",
        description: "There was an error submitting the purchase order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save as draft - no validation required
  const handleSaveAsDraft = async () => {
    if (!quotationId) {
      toast({
        title: "Missing Quotation",
        description: "Please create a PO from an approved quotation.",
        variant: "destructive"
      });
      return;
    }

    setIsSavingDraft(true);
    try {
      const formValues = form.getValues();

      // Prepare data matching CreatePORequest interface
      const draftData = {
        quotationId,
        projectTitle: formValues.projectTitle || '',
        scopeOfWork: formValues.scopeOfWork || '',
        specialInstructions: formValues.specialInstructions || '',
        startDate: formValues.startDate ? formValues.startDate.toISOString() : new Date().toISOString(),
        endDate: formValues.endDate ? formValues.endDate.toISOString() : new Date().toISOString(),
        paymentTerms: formValues.paymentTerms || '',
        deliverables: (formValues.deliverables || []).map(del => ({
          description: del.description || '',
          quantity: 1,
          unit: 'unit',
          unitPrice: 0,
        })),
        paymentMilestones: (formValues.paymentMilestones || []).map(m => ({
          name: m.description || '',
          description: m.description || '',
          percentage: m.percentage || 0,
          dueDate: m.dueDate ? m.dueDate.toISOString() : new Date().toISOString(),
        })),
        acceptanceCriteria: (formValues.acceptanceCriteria || []).map(ac => ({
          criteria: ac.criteria || '',
        })),
        isoCompliance: {
          termsAndConditions: selectedISOTerms,
          qualityRequirements: [],
          warrantyPeriod: '',
          penaltyClause: customISOTerms || '',
        },
        saveAsDraft: true,
      };

      const response = await purchaseOrdersService.create(draftData);

      toast({
        title: "Draft Saved Successfully",
        description: `Purchase Order ${response.data.poNumber} has been saved as a draft.`
      });

      // Navigate to the saved PO details page
      if (response.data?.id) {
        navigate(`/dashboard/purchase-orders/${response.data.id}`);
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error Saving Draft",
        description: error?.message || "There was an error saving your draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle adding a deliverable
  const handleAddDeliverable = () => {
    const currentDeliverables = form.getValues("deliverables");
    const newDeliverable = {
      id: `del-${Date.now()}`,
      description: ""
    };
    form.setValue("deliverables", [...currentDeliverables, newDeliverable]);
  };

  // Handle removing a deliverable
  const handleRemoveDeliverable = (id: string) => {
    const currentDeliverables = form.getValues("deliverables");
    form.setValue("deliverables", currentDeliverables.filter(del => del.id !== id));
  };

  // Handle adding acceptance criteria
  const handleAddCriteria = () => {
    const currentCriteria = form.getValues("acceptanceCriteria");
    const newCriteria = {
      id: `ac-${Date.now()}`,
      criteria: ""
    };
    form.setValue("acceptanceCriteria", [...currentCriteria, newCriteria]);
  };

  // Handle removing acceptance criteria
  const handleRemoveCriteria = (id: string) => {
    const currentCriteria = form.getValues("acceptanceCriteria");
    form.setValue("acceptanceCriteria", currentCriteria.filter(crit => crit.id !== id));
  };

  // Calculate duration between dates
  const getDuration = () => {
    if (startDate && endDate) {
      return differenceInDays(endDate, startDate);
    }
    return 0;
  };

  // Render different content based on current step
  const renderStepContent = () => {
    if (currentStep === 4) {
      // Review Step
      const reviewData = prepareReviewData();
      if (!reviewData) {
        return (
          <div className="text-center py-12">
            <p className="text-red-600">Form data is incomplete. Please go back and fill all required fields.</p>
          </div>
        );
      }

      return (
        <POReviewStep
          formData={reviewData as any}
          selectedISOTerms={selectedISOTerms}
          customISOTerms={customISOTerms}
          vendors={vendors}
        />
      );
    }

    if (currentStep === 5) {
      // Final Creation Step
      const reviewData = prepareReviewData();
      if (!reviewData) {
        return (
          <div className="text-center py-12">
            <p className="text-red-600">Form data is incomplete. Please go back and complete the form.</p>
          </div>
        );
      }

      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Create Purchase Order</h2>
              <p className="text-gray-600">
                Click the button below to create the purchase order, save it to your records,
                and deliver it to the vendor.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>What happens next:</strong><br />
                • PO will be created and assigned number {reviewData.poNumber}<br />
                • Saved to your industry records<br />
                • Delivered to {vendors.find(v => v.id === reviewData.vendor)?.name || 'the vendor'}<br />
                • Workflow will begin tracking
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default - PO Details Step (Step 3)
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Purchase Order Details */}
        <div className="space-y-8">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-gray-900">Purchase Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">

              <FormField
                control={form.control}
                name="poNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">PO Number*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Vendor*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
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
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Project Title*</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orderValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Order Value*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                            value={field.value || 0}
                            className="pl-7 border-gray-200 bg-gray-50"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Tax Percentage</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                            value={field.value || 0}
                            className="pr-7 border-gray-200 bg-gray-50"
                          />
                          <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="totalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Total Value</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <Input
                          {...field}
                          readOnly
                          value={field.value?.toFixed(2) || '0.00'}
                          className="pl-7 font-semibold border-blue-200 bg-gray-50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">Start Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-200",
                                !field.value && "text-gray-500"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">End Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-200",
                                !field.value && "text-gray-500"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                      {startDate && endDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          Duration: {getDuration()} day(s)
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Payment Terms*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="100_advance">100% advance</SelectItem>
                        <SelectItem value="50_advance_50_completion">50% advance, 50% upon completion</SelectItem>
                        <SelectItem value="30_advance_70_completion">30% advance, 70% upon completion</SelectItem>
                        <SelectItem value="net_15">Net 15 days</SelectItem>
                        <SelectItem value="net_30">Net 30 days</SelectItem>
                        <SelectItem value="net_60">Net 60 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px] border-gray-200 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-gray-900">Scope of Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <FormField
                control={form.control}
                name="scopeOfWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Scope of Work*</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[200px] border-gray-200 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Upload Section */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Supporting Documents (Optional)</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Upload scope of work documents, specifications, or other supporting files.
                </p>
                <SOWDocumentUpload
                  files={sopDocuments}
                  onFilesChange={setSopDocuments}
                  maxFiles={5}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900 text-lg">Deliverables</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddDeliverable}
                    className="border-gray-200 bg-blue-700 hover:bg-blue-600 text-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Deliverable
                  </Button>
                </div>

                <div className="space-y-3">
                  {deliverables.map((deliverable, index) => (
                    <div key={deliverable.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`deliverables.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter deliverable description..."
                                className="border-gray-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveDeliverable(deliverable.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900 text-lg">Acceptance Criteria</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddCriteria}
                    className="border-gray-200 text-gray-50 bg-blue-700 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Criteria
                  </Button>
                </div>

                <div className="space-y-3">
                  {acceptanceCriteria.map((criteria, index) => (
                    <div key={criteria.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`acceptanceCriteria.${index}.criteria`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter acceptance criteria..."
                                className="border-gray-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveCriteria(criteria.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - ISO 9001 Terms */}
        <div>
          <ISO9001TermsSection
            selectedTerms={selectedISOTerms}
            onTermsChange={setSelectedISOTerms}
            customTerms={customISOTerms}
            onCustomTermsChange={setCustomISOTerms}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Purchase Order</h1>
          <p className="text-gray-700 text-lg">Enterprise-grade purchase order management</p>
        </div>

        <div className="mb-10">
          <PurchaseOrderStepIndicator currentStep={currentStep} onStepClick={handleStepClick} />
        </div>

        <Form {...form}>
          <div className="space-y-8">
            {renderStepContent()}

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-3">
              {/* Previous Button - only show on steps 4 and 5 */}
              {currentStep > 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              {/* Save Draft Button - show on step 3 only */}
              {currentStep === 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  disabled={isSavingDraft}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  {isSavingDraft ? "Saving..." : "Save Draft"}
                </Button>
              )}

              {/* Back to Edit Button - show on review step (4) */}
              {currentStep === 4 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToEdit}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </Button>
              )}

              {/* Step 3: Review & Confirm button */}
              {currentStep === 3 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
                >
                  Review & Confirm
                </Button>
              )}

              {/* Step 4: Approve & Proceed button */}
              {currentStep === 4 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
                >
                  Approve & Proceed
                </Button>
              )}

              {/* Step 5: Submit button (changed from Create) */}
              {currentStep === 5 && (
                <Button
                  type="button"
                  onClick={handleCreatePurchaseOrder}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-8"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Approval"}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
