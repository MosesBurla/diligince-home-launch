import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { X, CheckCircle2 } from 'lucide-react';
import { VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';

interface QuotationTechnicalSectionProps {
  form: UseFormReturn<VendorQuotationFormData>;
}

const commonCertifications = [
  'ISO 9001',
  'ISO 14001',
  'ISO 27001',
  'ISO 45001',
  'CE Marking',
  'OHSAS 18001',
  'BIS Certification',
  'NABL Accreditation',
  'CMMI Level 3',
  'CMMI Level 5',
];

export const QuotationTechnicalSection: React.FC<QuotationTechnicalSectionProps> = ({ form }) => {
  const certifications = form.watch('complianceCertifications') || [];

  const toggleCertification = (cert: string) => {
    const current = form.getValues('complianceCertifications') || [];
    if (current.includes(cert)) {
      form.setValue(
        'complianceCertifications',
        current.filter((c) => c !== cert)
      );
    } else {
      form.setValue('complianceCertifications', [...current, cert]);
    }
  };

  const methodologyLength = form.watch('methodology')?.length || 0;

  return (
    <div className="space-y-6">
      {/* Methodology */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Project Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="methodology"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Methodology & Approach *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your approach to completing this project. Include your methodology, processes, and how you plan to achieve the project goals..."
                    className="min-h-[150px] resize-y"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormDescription>
                    Minimum 50 characters required
                  </FormDescription>
                  <span
                    className={`text-xs ${
                      methodologyLength >= 50 ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {methodologyLength}/50 characters
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="technicalSpecifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Specifications (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide technical details, equipment to be used, standards to be followed, technical capabilities, etc."
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualityAssurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quality Assurance (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your QA processes, testing procedures, inspections, quality control measures, etc."
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Compliance & Certifications */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Compliance & Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="complianceCertifications"
            render={() => (
              <FormItem>
                <FormLabel>Select Applicable Certifications</FormLabel>
                <FormDescription className="mb-4">
                  Select the certifications your company holds that are relevant to this project
                </FormDescription>
                <div className="flex flex-wrap gap-2">
                  {commonCertifications.map((cert) => {
                    const isSelected = certifications.includes(cert);
                    return (
                      <Button
                        key={cert}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleCertification(cert)}
                        className="gap-1.5"
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {cert}
                      </Button>
                    );
                  })}
                </div>

                {/* Selected Certifications Summary */}
                {certifications.length > 0 && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Selected certifications:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert) => (
                        <Badge
                          key={cert}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {cert}
                          <button
                            type="button"
                            onClick={() => toggleCertification(cert)}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
