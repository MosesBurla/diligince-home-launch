import React, { useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { CalendarIcon, Plus, Trash2, Clock, Milestone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VendorQuotationFormData } from '@/schemas/vendor-quotation-form.schema';

interface QuotationTimelineSectionProps {
  form: UseFormReturn<VendorQuotationFormData>;
}

export const QuotationTimelineSection: React.FC<QuotationTimelineSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const startDate = form.watch('proposedStartDate');
  const completionDate = form.watch('proposedCompletionDate');

  // Calculate duration
  const duration = React.useMemo(() => {
    if (startDate && completionDate) {
      try {
        const days = differenceInDays(parseISO(completionDate), parseISO(startDate));
        return days > 0 ? days : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  }, [startDate, completionDate]);

  const addMilestone = () => {
    append({
      id: `milestone_${Date.now()}`,
      name: '',
      deliverables: '',
      dueDate: '',
      amount: 0,
    });
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Project Dates */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <FormField
              control={form.control}
              name="proposedStartDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Proposed Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(parseISO(field.value), 'PPP')
                          ) : (
                            <span>Select start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Completion Date */}
            <FormField
              control={form.control}
              name="proposedCompletionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Proposed Completion Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(parseISO(field.value), 'PPP')
                          ) : (
                            <span>Select completion date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => {
                          const start = startDate ? parseISO(startDate) : new Date();
                          return date < start;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Duration Display */}
          {duration > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm text-muted-foreground">Estimated Duration: </span>
                <span className="font-semibold">{duration} days</span>
                {duration >= 30 && (
                  <span className="text-muted-foreground text-sm">
                    {' '}(~{Math.round(duration / 30)} months)
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Project Milestones</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMilestone}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Milestone className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">No milestones defined yet</p>
              <Button type="button" variant="outline" onClick={addMilestone}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Milestone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Milestone {index + 1}
                    </span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Milestone Name */}
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Milestone Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Phase 1 - Design" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Due Date */}
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.dueDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(parseISO(field.value), 'PPP')
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? parseISO(field.value) : undefined}
                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Deliverables */}
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.deliverables`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deliverables</FormLabel>
                          <FormControl>
                            <Input placeholder="What will be delivered" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Amount */}
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {/* Milestone Total */}
              {fields.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Milestone Payments</span>
                  <span className="font-semibold">
                    ₹{formatNumber(
                      form.watch('milestones')?.reduce((sum, m) => sum + (m.amount || 0), 0) || 0
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
