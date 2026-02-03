import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Milestone, AlertCircle, CheckCircle } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PurchaseOrderFormData } from '@/schemas/purchase-order-form.schema';
import { cn } from '@/lib/utils';

interface POFormMilestonesProps {
  form: UseFormReturn<PurchaseOrderFormData>;
}

export const POFormMilestones: React.FC<POFormMilestonesProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "paymentMilestones",
  });

  const milestones = form.watch('paymentMilestones');
  const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage || 0), 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-foreground">Payment Milestones</h3>
          <p className="text-sm text-muted-foreground">Define payment schedule (must total 100%)</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => append({ description: '', percentage: '' as any, dueDate: '' })}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      {/* Percentage indicator */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
              isValid
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
            )}
          >
            {isValid ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>Total: {totalPercentage.toFixed(1)}% / 100%</span>
          </div>
          {form.formState.errors.paymentMilestones?.root && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {form.formState.errors.paymentMilestones.root.message}
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="bg-card/80 backdrop-blur-sm border border-dashed border-border/80 rounded-xl p-8 text-center">
          <Milestone className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No milestones added yet. Click "Add Milestone" to define payment schedule.
          </p>
        </div>
      )}

      {/* Milestone items */}
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
              <span className="text-sm font-medium text-foreground">Milestone {index + 1}</span>
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
              name={`paymentMilestones.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Milestone description"
                      className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name={`paymentMilestones.${index}.percentage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Payment % <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            field.onChange('');
                          } else {
                            // Strip leading zeros visually if possible by parsing and converting back
                            const parsed = parseFloat(val);
                            field.onChange(isNaN(parsed) ? val : parsed);
                          }
                        }}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            field.onChange(val);
                          }
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`paymentMilestones.${index}.dueDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Due Date <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};