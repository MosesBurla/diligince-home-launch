import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Form } from '@/components/ui/form';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import { purchaseOrderFormSchema, PurchaseOrderFormData } from '@/schemas/purchase-order-form.schema';
import { POFormBasicInfo } from '@/components/purchase-order/forms/POFormBasicInfo';
import { POFormDeliverables } from '@/components/purchase-order/forms/POFormDeliverables';
import { POFormMilestones } from '@/components/purchase-order/forms/POFormMilestones';
import { POFormAcceptanceCriteria } from '@/components/purchase-order/forms/POFormAcceptanceCriteria';
import { CreatePOLayout } from '@/components/purchase-order/CreatePOLayout';
import { toast } from 'sonner';

const TOTAL_STEPS = 4;
const STEP_TITLES = ['Basic Info', 'Deliverables', 'Payment Milestones', 'Acceptance Criteria'];

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const CreateEditPurchaseOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const quotationId = searchParams.get('quotationId');
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [sowDocuments, setSowDocuments] = useState<UploadedFile[]>([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Fetch existing PO data if in edit mode
  const { data: poDetail, isLoading: isLoadingPO } = useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => purchaseOrdersService.getById(id!),
    enabled: isEditMode,
  });

  // Fetch prefill data from quotation if quotationId is provided
  const { data: prefillData, isLoading: isLoadingPrefill } = useQuery({
    queryKey: ['po-prefill', quotationId],
    queryFn: () => purchaseOrdersService.getPrefillFromQuotation(quotationId!),
    enabled: !!quotationId && !isEditMode,
  });

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderFormSchema),
    mode: 'onChange',
    defaultValues: {
      projectTitle: '',
      scopeOfWork: '',
      specialInstructions: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      paymentTerms: '',
      deliverables: [],
      paymentMilestones: [],
      acceptanceCriteria: [],
    },
  });

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (poDetail?.data && isEditMode) {
      const po = poDetail.data;
      form.reset({
        quotationId: po.quotationId,
        projectTitle: po.projectTitle,
        scopeOfWork: po.scopeOfWork,
        specialInstructions: po.specialInstructions || '',
        startDate: new Date(po.startDate),
        endDate: new Date(po.endDate),
        paymentTerms: po.paymentTerms,
        deliverables: po.deliverables.map((d: any) => ({
          id: d.id,
          description: d.description,
          quantity: d.quantity,
          unit: d.unit,
          unitPrice: d.unitPrice,
        })),
        paymentMilestones: po.paymentMilestones.map((m: any) => ({
          id: m.id,
          description: m.description,
          percentage: m.percentage,
          dueDate: m.dueDate,
        })),
        acceptanceCriteria: po.acceptanceCriteria.map((a: any) => ({
          id: a.id,
          criteria: a.criteria,
        })),
      });
    }
  }, [poDetail, isEditMode, form]);

  // Populate form with quotation prefill data
  useEffect(() => {
    if (prefillData?.data && quotationId && !isEditMode) {
      const data = prefillData.data;

      // Calculate suggested dates
      const startDate = data.suggestedStartDate ? new Date(data.suggestedStartDate) : new Date();
      const endDate = data.suggestedEndDate ? new Date(data.suggestedEndDate) : new Date(new Date().setDate(new Date().getDate() + (data.proposedDeliveryDays || 30)));

      form.reset({
        quotationId: data.quotationId,
        projectTitle: data.requirementTitle || '',
        scopeOfWork: data.proposalSummary || '', // Pre-filled from quotation
        specialInstructions: '',
        startDate,
        endDate,
        paymentTerms: data.termsFromQuotation?.paymentTerms || '',
        deliverables: data.lineItems?.map((item, index) => ({
          id: `del-${index}`,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
        })) || [],
        paymentMilestones: [],
        acceptanceCriteria: [],
      });

      toast.success('Form pre-filled with quotation data', {
        description: `Vendor: ${data.vendor?.name || 'Unknown'}`,
      });
    }
  }, [prefillData, quotationId, isEditMode, form]);

  const { loading, execute } = useAsyncOperation({
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: isEditMode ? 'Purchase order updated successfully' : 'Purchase order created successfully',
    onSuccess: (data) => {
      if (data?.data?.id) {
        navigate(`/dashboard/purchase-orders/${data.data.id}`);
      } else {
        navigate('/dashboard/industry-purchase-orders');
      }
    },
  });

  // Calculate form completion progress
  const progress = useMemo(() => {
    const values = form.getValues();
    let filled = 0;
    let total = 8; // Total required fields

    // Basic info fields
    if (values.projectTitle?.length >= 3) filled++;
    if (values.scopeOfWork?.length >= 10) filled++;
    if (values.startDate) filled++;
    if (values.endDate) filled++;
    if (values.paymentTerms?.length >= 5) filled++;

    // Array fields
    if (values.deliverables?.length > 0) filled++;
    if (values.paymentMilestones?.length > 0) filled++;
    if (values.acceptanceCriteria?.length > 0) filled++;

    return Math.round((filled / total) * 100);
  }, [form.watch()]);

  // Step validation
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    let fieldsToValidate: any[] = [];

    switch (step) {
      case 1: // Basic Info
        fieldsToValidate = ['projectTitle', 'scopeOfWork', 'startDate', 'endDate', 'paymentTerms'];
        break;
      case 2: // Deliverables
        fieldsToValidate = ['deliverables'];
        break;
      case 3: // Milestones
        fieldsToValidate = ['paymentMilestones'];
        break;
      case 4: // Acceptance Criteria
        fieldsToValidate = ['acceptanceCriteria'];
        break;
      default:
        return true;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      toast.error('Please fix the errors before continuing');
      return false;
    }

    return true;
  }, [form]);

  const handleNext = useCallback(async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStepChange = useCallback(async (step: number) => {
    // Allow going back freely, but validate when moving forward
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep + 1 && await validateStep(currentStep)) {
      setCurrentStep(step);
    }
  }, [currentStep, validateStep]);

  const onSubmit = async (data: PurchaseOrderFormData) => {
    console.log('PO Form Data Submitted:', data);
    await execute(async () => {
      // Transform form data to API format
      const apiData = {
        quotationId: data.quotationId || quotationId || 'temp-quotation-id',
        vendorId: prefillData?.data?.vendor?.id,
        projectTitle: data.projectTitle,
        scopeOfWork: data.scopeOfWork,
        specialInstructions: data.specialInstructions,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],
        paymentTerms: data.paymentTerms,
        deliverables: data.deliverables.map((d) => ({
          description: d.description,
          quantity: d.quantity,
          unit: d.unit,
          unitPrice: d.unitPrice,
        })),
        paymentMilestones: data.paymentMilestones.map((m) => ({
          description: m.description,
          percentage: m.percentage,
          dueDate: m.dueDate,
        })),
        acceptanceCriteria: data.acceptanceCriteria.map((a) => ({
          criteria: a.criteria,
        })),
      };

      console.log('API Request Data:', apiData);

      if (isEditMode) {
        return await purchaseOrdersService.update(id!, apiData);
      } else {
        return await purchaseOrdersService.create(apiData);
      }
    });
  };

  const onInvalid = useCallback((errors: any) => {
    console.error('PO Form Validation Errors:', errors);
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      toast.error('Validation failed', {
        description: `Please check: ${errorFields.join(', ')}`,
      });
    }
  }, []);

  const handleFormSubmit = useCallback(async () => {
    console.log('handleFormSubmit called');
    if (await validateStep(TOTAL_STEPS)) {
      form.handleSubmit(onSubmit, onInvalid)();
    } else {
      console.warn('Step validation failed for final step');
    }
  }, [form, onSubmit, onInvalid, validateStep]);

  // Handle Save Draft - saves without validation
  const handleSaveDraft = useCallback(async () => {
    setIsSavingDraft(true);
    try {
      const formValues = form.getValues();
      const apiData = {
        quotationId: formValues.quotationId || quotationId || 'temp-quotation-id',
        vendorId: prefillData?.data?.vendor?.id,
        projectTitle: formValues.projectTitle || '',
        scopeOfWork: formValues.scopeOfWork || '',
        specialInstructions: formValues.specialInstructions || '',
        startDate: formValues.startDate ? formValues.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: formValues.endDate ? formValues.endDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentTerms: formValues.paymentTerms || '',
        deliverables: (formValues.deliverables || []).map((d) => ({
          description: d.description || '',
          quantity: d.quantity || 1,
          unit: d.unit || 'unit',
          unitPrice: d.unitPrice || 0,
        })),
        paymentMilestones: (formValues.paymentMilestones || []).map((m) => ({
          description: m.description || '',
          percentage: m.percentage || 0,
          dueDate: m.dueDate || new Date().toISOString().split('T')[0],
        })),
        acceptanceCriteria: (formValues.acceptanceCriteria || []).map((a) => ({
          criteria: a.criteria || '',
        })),
        saveAsDraft: true,
      };

      const response = await purchaseOrdersService.create(apiData);

      toast.success('Draft saved successfully', {
        description: `Purchase Order ${response.data?.poNumber || ''} has been saved as a draft.`,
      });

      // Navigate to the saved PO details page
      if (response.data?.id) {
        navigate(`/dashboard/purchase-orders/${response.data.id}`);
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft', {
        description: error?.message || 'There was an error saving your draft. Please try again.',
      });
    } finally {
      setIsSavingDraft(false);
    }
  }, [form, quotationId, prefillData, navigate]);

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <POFormBasicInfo
            form={form}
            sowDocuments={sowDocuments}
            onSowDocumentsChange={setSowDocuments}
          />
        );
      case 2:
        return <POFormDeliverables form={form} />;
      case 3:
        return <POFormMilestones form={form} />;
      case 4:
        return <POFormAcceptanceCriteria form={form} />;
      default:
        return null;
    }
  };

  if ((isEditMode && isLoadingPO) || (quotationId && isLoadingPrefill)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <p className="text-center text-muted-foreground mt-4">
              {quotationId ? 'Loading quotation data...' : 'Loading purchase order...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <CreatePOLayout
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepChange={handleStepChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleFormSubmit}
          onSaveDraft={handleSaveDraft}
          isEditMode={isEditMode}
          isSubmitting={loading}
          isSavingDraft={isSavingDraft}
          progress={progress}
          stepTitle={STEP_TITLES[currentStep - 1]}
        >
          {renderStepContent()}
        </CreatePOLayout>
      </form>
    </Form>
  );
};

export default CreateEditPurchaseOrder;