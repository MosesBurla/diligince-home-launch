import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { RoleFilters as RoleFiltersType } from "@/services/modules/roles/roles.types";

interface RoleFiltersProps {
  filters: RoleFiltersType;
  onFilterChange: (filters: RoleFiltersType) => void;
}

export function RoleFilters({ filters, onFilterChange }: RoleFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleTypeChange = (value: string) => {
    const isSystemRole = value === "all" ? undefined : value === "system";
    onFilterChange({ ...filters, isSystemRole, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === "all" ? undefined : value === "active";
    onFilterChange({ ...filters, isActive, page: 1 });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search roles by name or description..."
          value={filters.search || ""}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Type Filter */}
      <Select
        value={
          filters.isSystemRole === undefined
            ? "all"
            : filters.isSystemRole
            ? "system"
            : "custom"
        }
        onValueChange={handleTypeChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Role Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="system">System Roles</SelectItem>
          <SelectItem value="custom">Custom Roles</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={
          filters.isActive === undefined
            ? "all"
            : filters.isActive
            ? "active"
            : "inactive"
        }
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
