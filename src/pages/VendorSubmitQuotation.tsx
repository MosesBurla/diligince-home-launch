import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FormPageSkeleton } from '@/components/shared/loading';

import { vendorRFQsService, vendorQuotationsService } from '@/services';
import { vendorQuotationFormSchema, type VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';

import { QuotationPricingSection } from '@/components/vendor/quotation-form/QuotationPricingSection';
import { QuotationTimelineSection } from '@/components/vendor/quotation-form/QuotationTimelineSection';
import { QuotationTechnicalSection } from '@/components/vendor/quotation-form/QuotationTechnicalSection';
import { QuotationDocumentsSection } from '@/components/vendor/quotation-form/QuotationDocumentsSection';
import { QuotationTermsSection } from '@/components/vendor/quotation-form/QuotationTermsSection';

const VendorSubmitQuotation: React.FC = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pricing');

  // Fetch RFQ details
  const { data: rfqDetail, isLoading: loadingRFQ } = useQuery({
    queryKey: ['rfq', rfqId],
    queryFn: () => vendorRFQsService.getRFQDetails(rfqId!),
    enabled: !!rfqId,
  });

  const form = useForm<VendorQuotationFormData>({
    resolver: zodResolver(vendorQuotationFormSchema),
    defaultValues: {
      rfqId: rfqId || '',
      lineItems: [],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      totalAmount: 0,
      currency: 'USD',
      paymentTerms: '',
      proposedStartDate: '',
      proposedCompletionDate: '',
      methodology: '',
      warrantyPeriod: '',
      supportTerms: '',
      cancellationPolicy: '',
      status: 'draft',
    },
  });

  // Submit quotation mutation
  const submitMutation = useMutation({
    mutationFn: (data: any) => 
      vendorQuotationsService.submitQuotation({
        ...data,
        rfqId: rfqId!,
      } as any),
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
    mutationFn: (data: any) =>
      vendorQuotationsService.submitQuotation({
        ...data,
        rfqId: rfqId!,
        status: 'draft',
      } as any),
    onSuccess: () => {
      toast.success('Quotation saved as draft');
      navigate('/dashboard/vendor/quotations');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save draft');
    },
  });

  const onSubmit = (data: VendorQuotationFormData) => {
    submitMutation.mutate({ ...data, status: 'submitted' } as any);
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    saveDraftMutation.mutate({ ...data, status: 'draft' } as any);
  };

  if (loadingRFQ) {
    return <FormPageSkeleton sections={3} fieldsPerSection={4} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Submit Quotation | Vendor Dashboard</title>
      </Helmet>

      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Submit Quotation</h1>
              <p className="text-muted-foreground">
                {rfqDetail?.title || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* RFQ Details Card */}
        {rfqDetail && (
          <Card>
            <CardHeader>
              <CardTitle>RFQ Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{rfqDetail.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{rfqDetail.budget}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium">{rfqDetail.deadline}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quotation Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-4">
              <QuotationPricingSection form={form} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <QuotationTimelineSection form={form} />
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <QuotationTechnicalSection form={form} />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <QuotationDocumentsSection form={form} />
            </TabsContent>

            <TabsContent value="terms" className="space-y-4">
              <QuotationTermsSection form={form} />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
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
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Quotation
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default VendorSubmitQuotation;
