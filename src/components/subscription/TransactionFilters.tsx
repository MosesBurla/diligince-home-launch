import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import type { TransactionStatus } from '@/data/mockSubscriptionData';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface TransactionFiltersProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  status: TransactionStatus | 'all';
  onStatusChange: (status: TransactionStatus | 'all') => void;
  plan: string;
  onPlanChange: (plan: string) => void;
  availablePlans: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const TransactionFilters = ({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  plan,
  onPlanChange,
  availablePlans,
  onClearFilters,
  hasActiveFilters
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal min-w-[240px]',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => 
              onDateRangeChange({ from: range?.from, to: range?.to })
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Select value={status} onValueChange={(val) => onStatusChange(val as TransactionStatus | 'all')}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/* Plan Filter */}
      <Select value={plan} onValueChange={onPlanChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Plans" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Plans</SelectItem>
          {availablePlans.map((planName) => (
            <SelectItem key={planName} value={planName}>
              {planName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default TransactionFilters;
