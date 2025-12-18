import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { ColumnConfig, FilterConfig } from '../../types/table';

interface TableFiltersProps {
  columns: ColumnConfig[];
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  additionalFilters?: React.ReactNode;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  columns,
  filters,
  onFiltersChange,
  additionalFilters,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdown = dropdownRefs.current[openDropdown];
        if (dropdown && !dropdown.contains(target)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleFilterChange = (columnName: string, value: string, checked: boolean) => {
    const currentFilters = filters[columnName] || [];
    let newFilters;

    if (checked) {
      newFilters = [...currentFilters, value];
    } else {
      newFilters = currentFilters.filter(f => f !== value);
    }

    onFiltersChange({
      ...filters,
      [columnName]: newFilters,
    });
  };

  const clearFilter = (columnName: string) => {
    const newFilters = { ...filters };
    delete newFilters[columnName];
    onFiltersChange(newFilters);
  };

  const getActiveFilterCount = (columnName: string) => {
    return filters[columnName]?.length || 0;
  };

  const filterableColumns = columns.filter(col => col.isFilterable && col.filterOptions);

  if (filterableColumns.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filterableColumns.map((column) => (
        <div
          key={column.name}
          className="relative"
          ref={(el) => (dropdownRefs.current[column.name] = el)}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === column.name ? null : column.name)}
            className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${getActiveFilterCount(column.name) > 0
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Filter className="w-4 h-4" />
            <span>{column.label}</span>
            {getActiveFilterCount(column.name) > 0 && (
              <span className="bg-white text-primary px-1.5 py-0.5 rounded text-xs font-medium">
                {getActiveFilterCount(column.name)}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown === column.name && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-medium text-gray-900">Filter by {column.label}</span>
                {getActiveFilterCount(column.name) > 0 && (
                  <button
                    onClick={() => clearFilter(column.name)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {column.filterOptions?.map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters[column.name]?.includes(option.key) || false}
                      onChange={(e) => handleFilterChange(column.name, option.key, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{option.value}</span>
                    {option.color && (
                      <span
                        className={`inline-block w-2 h-2 rounded-full`}
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      {additionalFilters && (
        <div className="flex items-center">
          {additionalFilters}
        </div>
      )}
    </div>
  );
};

export default TableFilters;