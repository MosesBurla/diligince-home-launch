import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IndianRupee,
  Calendar,
  FileText,
  Shield,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';
import { QuotationStep } from './QuotationStepIndicator';

interface QuotationReviewSectionProps {
  form: UseFormReturn<VendorQuotationFormData>;
  onEditSection: (step: QuotationStep) => void;
}

export const QuotationReviewSection: React.FC<QuotationReviewSectionProps> = ({
  form,
  onEditSection,
}) => {
  const data = form.getValues();

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(parseISO(dateString), 'PPP');
    } catch {
      return 'Invalid date';
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    return symbols[currency] || '₹';
  };

  const getPaymentTermsLabel = (value: string) => {
    const labels: Record<string, string> = {
      net_15: 'Net 15 Days',
      net_30: 'Net 30 Days',
      net_45: 'Net 45 Days',
      net_60: 'Net 60 Days',
      milestone: 'Milestone Based',
      advance_50: '50% Advance, 50% on Completion',
      custom: 'Custom Terms',
    };
    return labels[value] || value;
  };

  const getWarrantyLabel = (value: string) => {
    const labels: Record<string, string> = {
      '3_months': '3 Months',
      '6_months': '6 Months',
      '12_months': '12 Months',
      '18_months': '18 Months',
      '24_months': '24 Months',
      '36_months': '36 Months',
      lifetime: 'Lifetime',
      none: 'No Warranty',
    };
    return labels[value] || value;
  };

  const getSupportLabel = (value: string) => {
    const labels: Record<string, string> = {
      business_hours: 'Business Hours (9-6 Mon-Fri)',
      extended: 'Extended (8-8 Mon-Sat)',
      '24x5': '24x5 (Mon-Fri)',
      '24x7': '24x7 Support',
      email_only: 'Email Only',
      none: 'No Support',
    };
    return labels[value] || value;
  };

  const currencySymbol = getCurrencySymbol(data.currency);

  // Validation checks
  const hasLineItems = data.lineItems?.length > 0;
  const hasMethodology = data.methodology?.length >= 50;
  const hasDates = data.proposedStartDate && data.proposedCompletionDate;
  const hasTerms = data.warrantyPeriod && data.supportTerms && data.cancellationPolicy;

  const isComplete = hasLineItems && hasMethodology && hasDates && hasTerms;

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <Card className={isComplete ? 'border-green-500/30 bg-green-50/50' : 'border-amber-500/30 bg-amber-50/50'}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${isComplete ? 'text-green-800' : 'text-amber-800'}`}>
                {isComplete
                  ? 'Your quotation is ready to submit!'
                  : 'Some sections need attention'}
              </p>
              {!isComplete && (
                <ul className="mt-2 text-sm text-amber-700 space-y-1">
                  {!hasLineItems && <li>• Add at least one line item in Pricing</li>}
                  {!hasMethodology && <li>• Methodology requires at least 50 characters</li>}
                  {!hasDates && <li>• Set proposed start and completion dates</li>}
                  {!hasTerms && <li>• Complete all required terms</li>}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Pricing Summary
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditSection('pricing')}
              className="gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.lineItems?.length > 0 ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {data.lineItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.description || 'Unnamed item'} × {item.quantity}
                    </span>
                    <span>{currencySymbol}{formatNumber(item.total)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{currencySymbol}{formatNumber(data.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({data.taxRate}%)</span>
                <span>{currencySymbol}{formatNumber(data.taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-primary text-lg">
                  {currencySymbol}{formatNumber(data.totalAmount)}
                </span>
              </div>
              <div className="pt-2">
                <Badge variant="secondary">
                  Payment: {getPaymentTermsLabel(data.paymentTerms)}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No line items added</p>
          )}
        </CardContent>
      </Card>

      {/* Timeline Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditSection('timeline')}
              className="gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(data.proposedStartDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Date</p>
              <p className="font-medium">{formatDate(data.proposedCompletionDate)}</p>
            </div>
          </div>

          {data.milestones && data.milestones.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="text-sm font-medium mb-2">Milestones ({data.milestones.length})</p>
              <div className="space-y-2">
                {data.milestones.map((milestone, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                    <span>{milestone.name || `Milestone ${index + 1}`}</span>
                    <span className="text-muted-foreground">
                      {currencySymbol}{formatNumber(milestone.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Technical Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Technical Proposal
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditSection('technical')}
              className="gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Methodology</p>
              <p className="text-sm line-clamp-3">
                {data.methodology || 'Not provided'}
              </p>
            </div>

            {data.complianceCertifications && data.complianceCertifications.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {data.complianceCertifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terms Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Terms & Documents
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditSection('terms')}
              className="gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Warranty</p>
              <p className="font-medium">{getWarrantyLabel(data.warrantyPeriod) || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Support</p>
              <p className="font-medium">{getSupportLabel(data.supportTerms) || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="font-medium">{data.documents?.length || 0} uploaded</p>
            </div>
          </div>

          {data.documents && data.documents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.documents.map((doc, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  <FileText className="w-3 h-3" />
                  {doc.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
