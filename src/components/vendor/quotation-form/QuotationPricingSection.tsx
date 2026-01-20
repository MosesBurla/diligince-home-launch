import React, { useEffect, useCallback } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2, IndianRupee } from 'lucide-react';
import { VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';

interface QuotationPricingSectionProps {
  form: UseFormReturn<VendorQuotationFormData>;
}

const currencies = [
  { value: 'INR', label: '₹ INR', symbol: '₹' },
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' },
];

const paymentTermsOptions = [
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_45', label: 'Net 45 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
  { value: 'milestone', label: 'Milestone Based' },
  { value: 'advance_50', label: '50% Advance, 50% on Completion' },
  { value: 'custom', label: 'Custom Terms' },
];

export const QuotationPricingSection: React.FC<QuotationPricingSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const watchTaxRate = form.watch('taxRate');
  const watchLineItems = form.watch('lineItems');
  const currency = form.watch('currency') || 'INR';

  const currencySymbol = currencies.find((c) => c.value === currency)?.symbol || '₹';

  // Recalculate summary totals
  const recalculateSummary = useCallback(() => {
    const lineItems = form.getValues('lineItems') || [];
    const taxRate = form.getValues('taxRate') || 0;

    const subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    form.setValue('subtotal', subtotal, { shouldValidate: false });
    form.setValue('taxAmount', taxAmount, { shouldValidate: false });
    form.setValue('totalAmount', totalAmount, { shouldValidate: false });
  }, [form]);

  // Recalculate when tax rate changes
  useEffect(() => {
    recalculateSummary();
  }, [watchTaxRate, recalculateSummary]);

  // Update line item total when quantity or unit price changes
  const handleLineItemChange = (index: number) => {
    const quantity = form.getValues(`lineItems.${index}.quantity`) || 0;
    const unitPrice = form.getValues(`lineItems.${index}.unitPrice`) || 0;
    const total = quantity * unitPrice;
    form.setValue(`lineItems.${index}.total`, total, { shouldValidate: false });
    recalculateSummary();
  };

  const addLineItem = () => {
    append({
      id: `item_${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
    setTimeout(() => recalculateSummary(), 0);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Currency & Payment Terms */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Payment Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'INR'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
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
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentTermsOptions.map((option) => (
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
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Line Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <IndianRupee className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">No line items added yet</p>
              <Button type="button" variant="outline" onClick={addLineItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              {/* Line Items */}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 md:p-0 border md:border-0 rounded-lg"
                >
                  {/* Description */}
                  <div className="md:col-span-5">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1.5 block">
                      Description
                    </Label>
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Item description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1.5 block">
                      Quantity
                    </Label>
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              className="text-center"
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                handleLineItemChange(index);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1.5 block">
                      Unit Price ({currencySymbol})
                    </Label>
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              className="text-right"
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                handleLineItemChange(index);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Total (Read-only) */}
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1.5 block">
                      Total
                    </Label>
                    <div className="h-10 px-3 py-2 text-right font-medium bg-muted rounded-md">
                      {currencySymbol}{formatNumber(watchLineItems?.[index]?.total || 0)}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {currencySymbol}{formatNumber(form.watch('subtotal') || 0)}
              </span>
            </div>

            {/* Tax Rate Input */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tax Rate</span>
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-1">
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          className="w-16 h-8 text-center text-sm"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">%</span>
                    </FormItem>
                  )}
                />
              </div>
              <span className="font-medium text-sm">
                {currencySymbol}{formatNumber(form.watch('taxAmount') || 0)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  {currencySymbol}{formatNumber(form.watch('totalAmount') || 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
