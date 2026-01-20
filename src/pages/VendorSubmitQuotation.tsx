import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Building2, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

import { vendorRFQsService, vendorQuotationsService } from '@/services';
import { vendorQuotationFormSchema, type VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';

import { QuotationStepIndicator, QuotationStep } from '@/components/vendor/quotation-form/QuotationStepIndicator';
import { QuotationPricingSection } from '@/components/vendor/quotation-form/QuotationPricingSection';
import { QuotationTimelineSection } from '@/components/vendor/quotation-form/QuotationTimelineSection';
import { QuotationTechnicalSection } from '@/components/vendor/quotation-form/QuotationTechnicalSection';
import { QuotationTermsSection } from '@/components/vendor/quotation-form/QuotationTermsSection';
import { QuotationReviewSection } from '@/components/vendor/quotation-form/QuotationReviewSection';

const steps: QuotationStep[] = ['pricing', 'timeline', 'technical', 'terms', 'review'];

const VendorSubmitQuotation: React.FC = () => {
  const { rfqId, quotationId } = useParams<{ rfqId?: string; quotationId?: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<QuotationStep>('pricing');
  const [completedSteps, setCompletedSteps] = useState<QuotationStep[]>([]);

  const isEditMode = !!quotationId;

  // Fetch existing quotation for edit mode
  const { data: existingQuotation, isLoading: loadingQuotation } = useQuery({
    queryKey: ['vendor-quotation-edit', quotationId],
    queryFn: () => vendorQuotationsService.getQuotationDetails(quotationId!),
    enabled: isEditMode,
  });

  // Effective RFQ ID (from params or from existing quotation's requirementId)
  const effectiveRfqId = rfqId || existingQuotation?.requirementId;

  // Fetch RFQ details
  const { data: rfqDetail, isLoading: loadingRFQ } = useQuery({
    queryKey: ['rfq', effectiveRfqId],
    queryFn: () => vendorRFQsService.getRFQDetails(effectiveRfqId!),
    enabled: !!effectiveRfqId,
  });

  const form = useForm<VendorQuotationFormData>({
    resolver: zodResolver(vendorQuotationFormSchema),
    defaultValues: {
      rfqId: rfqId || '',
      lineItems: [],
      subtotal: 0,
      taxRate: 18,
      taxAmount: 0,
      totalAmount: 0,
      currency: 'INR',
      paymentTerms: '',
      proposedStartDate: '',
      proposedCompletionDate: '',
      milestones: [],
      methodology: '',
      technicalSpecifications: '',
      qualityAssurance: '',
      complianceCertifications: [],
      documents: [],
      warrantyPeriod: '',
      supportTerms: '',
      cancellationPolicy: '',
      specialConditions: '',
      status: 'draft',
    },
  });

  // Populate form with existing quotation data when editing
  useEffect(() => {
    if (isEditMode && existingQuotation) {
      console.log('🔍 Populating form with existing quotation:', existingQuotation);
      console.log('📋 Line items from API:', existingQuotation.lineItems);

      // Map line items from backend format (amount) to frontend format (total)
      const mappedLineItems = (existingQuotation.lineItems || []).map((item: any) => ({
        id: item.id || item._id || `item_${Date.now()}_${Math.random()}`,
        description: item.description || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        total: item.total || item.amount || 0, // Backend uses 'amount', frontend uses 'total'
      }));

      console.log('🔄 Mapped line items:', mappedLineItems);

      const formData = {
        rfqId: existingQuotation.requirementId || '',
        lineItems: mappedLineItems,
        subtotal: existingQuotation.subtotal || 0,
        taxRate: existingQuotation.taxRate || 18,
        taxAmount: existingQuotation.taxAmount || 0,
        totalAmount: existingQuotation.quotedAmount || 0,
        currency: existingQuotation.currency || 'INR',
        paymentTerms: existingQuotation.paymentTerms || '',
        proposedStartDate: existingQuotation.proposedStartDate || '',
        proposedCompletionDate: existingQuotation.proposedCompletionDate || '',
        milestones: existingQuotation.milestones || [],
        methodology: existingQuotation.methodology || '',
        technicalSpecifications: existingQuotation.technicalSpecifications || '',
        qualityAssurance: existingQuotation.qualityAssurance || '',
        complianceCertifications: existingQuotation.complianceCertifications || [],
        documents: existingQuotation.documents || [],
        warrantyPeriod: existingQuotation.warrantyPeriod || '',
        supportTerms: existingQuotation.supportTerms || '',
        cancellationPolicy: existingQuotation.cancellationPolicy || '',
        specialConditions: existingQuotation.specialConditions || '',
        status: (existingQuotation.status === 'draft' ? 'draft' : 'submitted') as 'draft' | 'submitted',
      };

      console.log('📝 Form data being set:', formData);
      form.reset(formData);
      console.log('✅ Form reset complete');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, existingQuotation]);

  // Submit quotation mutation
  const submitMutation = useMutation({
    mutationFn: (data: VendorQuotationFormData) => {
      if (isEditMode && quotationId) {
        return vendorQuotationsService.updateDraftQuotation(quotationId, {
          ...data,
          status: 'submitted',
        } as any);
      }
      return vendorQuotationsService.submitQuotation({
        ...data,
        rfqId: effectiveRfqId!,
        status: 'submitted',
      } as any);
    },
    onSuccess: () => {
      toast.success('Quotation submitted successfully!');
      navigate('/dashboard/vendor/quotations');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit quotation');
    },
  });

  // Save as draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: (data: VendorQuotationFormData) => {
      if (isEditMode && quotationId) {
        return vendorQuotationsService.updateDraftQuotation(quotationId, {
          ...data,
          status: 'draft',
        } as any);
      }
      return vendorQuotationsService.submitQuotation({
        ...data,
        rfqId: effectiveRfqId!,
        status: 'draft',
      } as any);
    },
    onSuccess: () => {
      toast.success('Quotation saved as draft');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save draft');
    },
  });

  const currentStepIndex = steps.indexOf(currentStep);

  const goToStep = useCallback((step: QuotationStep) => {
    setCurrentStep(step);
  }, []);

  const goNext = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep, completedSteps]);

  const goPrevious = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const handleSaveDraft = () => {
    const data = form.getValues();
    saveDraftMutation.mutate(data);
  };

  const onSubmit = (data: VendorQuotationFormData) => {
    submitMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get category display
  const getCategory = (category: string | string[] | undefined): string => {
    if (Array.isArray(category)) return category[0] || 'General';
    return category || 'General';
  };

  if (loadingRFQ || (isEditMode && loadingQuotation)) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{isEditMode ? 'Edit Quotation' : 'Submit Quotation'} | Vendor Dashboard</title>
      </Helmet>

      <main className="container mx-auto p-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Edit Quotation' : 'Submit Quotation'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEditMode && existingQuotation
                ? `${existingQuotation.quotationNumber} - ${existingQuotation.requirementTitle || rfqDetail?.title || 'Draft Quotation'}`
                : rfqDetail?.title || 'Loading...'}
            </p>
          </div>
        </div>

        {/* RFQ Summary Card */}
        {rfqDetail && (
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {getCategory(rfqDetail.category)}
                </Badge>
                {rfqDetail.priority && (
                  <Badge variant="outline" className="text-xs">
                    {rfqDetail.priority} Priority
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Company</p>
                    <p className="font-medium">{rfqDetail.company?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Budget</p>
                    <p className="font-medium">{rfqDetail.budget?.display || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Deadline</p>
                    <p className="font-medium">{formatDate(rfqDetail.timeline?.deadline)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="font-medium">
                      {rfqDetail.location?.city || rfqDetail.location?.state || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Indicator */}
        <Card>
          <CardContent className="p-4">
            <QuotationStepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />
          </CardContent>
        </Card>

        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 'pricing' && <QuotationPricingSection form={form} />}
              {currentStep === 'timeline' && <QuotationTimelineSection form={form} />}
              {currentStep === 'technical' && <QuotationTechnicalSection form={form} />}
              {currentStep === 'terms' && <QuotationTermsSection form={form} />}
              {currentStep === 'review' && (
                <QuotationReviewSection form={form} onEditSection={goToStep} />
              )}
            </div>

            {/* Navigation Buttons */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Previous Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goPrevious}
                    disabled={currentStepIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Center Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSaveDraft}
                      disabled={saveDraftMutation.isPending}
                    >
                      {saveDraftMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Draft
                    </Button>
                  </div>

                  {/* Next/Submit Button */}
                  {currentStep === 'review' ? (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="gap-2"
                    >
                      {submitMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit Quotation
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={goNext}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default VendorSubmitQuotation;
