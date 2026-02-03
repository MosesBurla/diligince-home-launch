import React, { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PurchaseOrderFormData } from '@/schemas/purchase-order-form.schema';
import { AcceptanceCriteriaDocUpload } from './AcceptanceCriteriaDocUpload';

interface POFormAcceptanceCriteriaProps {
  form: UseFormReturn<PurchaseOrderFormData>;
}

export const POFormAcceptanceCriteria: React.FC<POFormAcceptanceCriteriaProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "acceptanceCriteria",
  });

  const [expandedDocs, setExpandedDocs] = useState<Record<number, boolean>>({});

  const toggleDocExpand = (index: number) => {
    setExpandedDocs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-foreground">Acceptance Criteria</h3>
          <p className="text-sm text-muted-foreground">Define criteria for work acceptance</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => append({ criteria: '', documents: [] })}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Criteria
        </Button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="bg-card/80 backdrop-blur-sm border border-dashed border-border/80 rounded-xl p-8 text-center">
          <CheckSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No acceptance criteria added yet. Click "Add Criteria" to define requirements.
          </p>
        </div>
      )}

      {/* Criteria items */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
              {index + 1}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name={`acceptanceCriteria.${index}.criteria`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Acceptance criteria ${index + 1}`}
                          className="h-10 rounded-lg border-border/80 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Document Upload Section */}
              <AcceptanceCriteriaDocUpload
                form={form}
                criteriaIndex={index}
                isExpanded={expandedDocs[index] || false}
                onToggleExpand={() => toggleDocExpand(index)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
