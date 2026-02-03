import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { POStatus } from '@/services/modules/purchase-orders';

interface VendorOption {
  id: string;
  name: string;
}

interface POFiltersProps {
  statusFilter: POStatus | 'all';
  onStatusChange: (value: POStatus | 'all') => void;
  onClearFilters: () => void;
  showStatusFilter?: boolean;
  // Optional vendor filter
  vendorFilter?: string;
  onVendorChange?: (value: string) => void;
  vendors?: VendorOption[];
  showVendorFilter?: boolean;
}

export const POFilters: React.FC<POFiltersProps> = ({
  statusFilter,
  onStatusChange,
  onClearFilters,
  showStatusFilter = true,
  vendorFilter,
  onVendorChange,
  vendors = [],
  showVendorFilter = false,
}) => {
  const hasActiveFilters = statusFilter !== 'all' || (vendorFilter && vendorFilter !== 'all');

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Status Filter */}
      {showStatusFilter && (
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Vendor Filter */}
      {showVendorFilter && onVendorChange && (
        <Select value={vendorFilter || 'all'} onValueChange={onVendorChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};
