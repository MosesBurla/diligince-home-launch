import React from 'react';
import { MatrixFilters as MatrixFiltersType } from '@/services/modules/approval-matrix';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface MatrixFiltersProps {
  filters: MatrixFiltersType;
  onFilterChange: (filters: Partial<MatrixFiltersType>) => void;
}

export const MatrixFilters: React.FC<MatrixFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matrices..."
            value={filters?.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters?.status || 'all'}
          onValueChange={(value) =>
            onFilterChange({ status: value === 'all' ? undefined : (value as 'active' | 'inactive') })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Default Filter */}
        <Select
          value={
            filters?.isDefault === true
              ? 'default'
              : filters?.isDefault === false
              ? 'custom'
              : 'all'
          }
          onValueChange={(value) =>
            onFilterChange({
              isDefault: value === 'all' ? undefined : value === 'default',
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="default">Default Matrix</SelectItem>
            <SelectItem value="custom">Custom Matrices</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={filters?.sortBy || 'priority'}
          onValueChange={(value) =>
            onFilterChange({ sortBy: value as 'name' | 'createdAt' | 'priority' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
