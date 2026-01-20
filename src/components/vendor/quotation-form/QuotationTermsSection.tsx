import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Upload, FileText, Trash2, X } from 'lucide-react';
import { VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';

interface QuotationTermsSectionProps {
  form: UseFormReturn<VendorQuotationFormData>;
}

const warrantyOptions = [
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: '12_months', label: '12 Months' },
  { value: '18_months', label: '18 Months' },
  { value: '24_months', label: '24 Months' },
  { value: '36_months', label: '36 Months' },
  { value: 'lifetime', label: 'Lifetime' },
  { value: 'none', label: 'No Warranty' },
];

const supportOptions = [
  { value: 'business_hours', label: 'Business Hours Support (9-6 Mon-Fri)' },
  { value: 'extended', label: 'Extended Support (8-8 Mon-Sat)' },
  { value: '24x5', label: '24x5 Support (Mon-Fri)' },
  { value: '24x7', label: '24x7 Support' },
  { value: 'email_only', label: 'Email Support Only' },
  { value: 'none', label: 'No Support Included' },
];

const cancellationOptions = [
  { value: '7_days', label: '7 Days Notice' },
  { value: '15_days', label: '15 Days Notice' },
  { value: '30_days', label: '30 Days Notice' },
  { value: '60_days', label: '60 Days Notice' },
  { value: 'milestone', label: 'At Milestone Completion Only' },
  { value: 'mutual', label: 'Mutual Agreement Required' },
  { value: 'none', label: 'No Cancellation Allowed' },
];

export const QuotationTermsSection: React.FC<QuotationTermsSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        return;
      }

      append({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      });
    });

    // Reset input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Terms & Conditions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warranty Period */}
            <FormField
              control={form.control}
              name="warrantyPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty Period *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warranty period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warrantyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Support Terms */}
            <FormField
              control={form.control}
              name="supportTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Terms *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select support terms" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cancellation Policy */}
          <FormField
            control={form.control}
            name="cancellationPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Policy *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cancellation policy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cancellationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Conditions */}
          <FormField
            control={form.control}
            name="specialConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Conditions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional terms, conditions, or special requirements..."
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

      {/* Documents */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <div className="mb-4">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-1 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                </p>
              </div>
              <Input
                id="document-upload"
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Uploaded Files List */}
          {fields.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Uploaded Documents ({fields.length})
              </p>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] md:max-w-[300px]">
                        {field.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(field.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No documents uploaded yet. Upload relevant documents like technical proposals,
              company profiles, or certifications.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
