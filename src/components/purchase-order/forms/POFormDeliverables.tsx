import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PurchaseOrderFormData } from '@/schemas/purchase-order-form.schema';

interface POFormDeliverablesProps {
  form: UseFormReturn<PurchaseOrderFormData>;
}

export const POFormDeliverables: React.FC<POFormDeliverablesProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliverables",
  });

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-foreground">Deliverables</h3>
          <p className="text-sm text-muted-foreground">Add items with quantities and pricing</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => append({ description: '', quantity: 1, unit: 'unit', unitPrice: 0 })}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="bg-card/80 backdrop-blur-sm border border-dashed border-border/80 rounded-xl p-8 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No deliverables added yet. Click "Add Item" to get started.
          </p>
        </div>
      )}

      {/* Deliverable items */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-foreground">Deliverable {index + 1}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`deliverables.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Item description"
                      className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name={`deliverables.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Qty <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`deliverables.${index}.unit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Unit <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="pcs"
                        className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`deliverables.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Price <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total row */}
            <div className="flex justify-end pt-2 border-t border-border/40">
              <div className="text-sm">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-semibold text-foreground">
                  ${(Number(form.watch(`deliverables.${index}.quantity`)) *
                    Number(form.watch(`deliverables.${index}.unitPrice`))).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};