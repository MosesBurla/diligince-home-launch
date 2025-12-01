import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ColumnConfig, SortConfig, FilterConfig, TableProps } from '../../types/table';
import TableHeader from './TableHeader';
import TableFilters from './TableFilters';
import TablePagination from './TablePagination';
import StatusBadge from './StatusBadge';

const CustomTable: React.FC<TableProps> = ({
  columns,
  data,
  filterCallback,
  searchCallback,
  onRowClick,
  onExport,
  onAdd,
  loading = false,
  pagination = { enabled: true, pageSize: 10, currentPage: 1 },
  selectable = false,
  onSelectionChange,
  globalSearchPlaceholder,
  className = '',
}) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchedData, setSearchedData] = useState(safeData);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10);

  // Update searched data when data prop changes
  useEffect(() => {
    const safe = Array.isArray(data) ? data : [];
    setSearchedData(safe);
  }, [data]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...searchedData];

    // Apply filters
    Object.entries(filters).forEach(([columnName, filterValues]) => {
      if (filterValues.length > 0) {
        result = result.filter((row) => {
          const value = row[columnName];
          return filterValues.includes(String(value));
        });
      }
    });

    return result;
  }, [searchedData, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination.enabled]);

  // Handle sort
  const handleSort = (columnName: string) => {
    const column = columns.find(col => col.name === columnName);
    if (!column?.isSortable) return;

    setSortConfig(prev => {
      if (prev?.key === columnName) {
        if (prev.direction === 'asc') {
          return { key: columnName, direction: 'desc' };
        } else {
          return null; // Remove sort
        }
      }
      return { key: columnName, direction: 'asc' };
    });
  };

  // Handle search
  const handleSearch = (searchTerm: string, selectedColumns: string[]) => {
    searchCallback?.(searchTerm, selectedColumns);
  };

  // Handle selection
  const handleRowSelection = (row: any, checked: boolean) => {
    if (!selectable) return;

    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter(r => r !== row);

    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectable) return;

    const newSelection = checked ? [...paginatedData] : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Handle filters
  const handleFiltersChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    filterCallback?.(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination.onPageChange?.(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    pagination.onPageSizeChange?.(size);
  };

  // Render cell content
  const renderCellContent = (column: ColumnConfig, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row);
    }

    // Auto-detect status badges
    if (column.name.toLowerCase().includes('status') || column.filterOptions) {
      const option = column.filterOptions?.find(opt => opt.key === String(value));
      return <StatusBadge status={String(value)} color={option?.color} />;
    }

    // Auto-detect links for IDs
    if (column.name.toLowerCase().includes('id') && column.action) {
      return (
        <button
          onClick={() => column.action?.(row)}
          className="text-primary hover:underline font-medium"
        >
          #{value}
        </button>
      );
    }

    return value;
  };

  const getSortIcon = (columnName: string) => {
    if (sortConfig?.key === columnName) {
      return sortConfig.direction === 'asc' ?
        <ArrowUp className="w-4 h-4" /> :
        <ArrowDown className="w-4 h-4" />;
    }
    return <ArrowUpDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <TableHeader
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          onSearch={handleSearch}
          columns={columns}
          onExport={onExport}
          onAdd={onAdd}
          globalSearchPlaceholder={globalSearchPlaceholder}
          selectedCount={selectedRows.length}
        />

        <TableFilters
          columns={columns}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectable && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width ? `w-${column.width}` : ''
                      }`}
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-1">
                        {column.isSortable ? (
                          <div
                            onClick={() => handleSort(column.name)}
                            className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200 w-full cursor-pointer"
                          >
                            <span className='whitespace-normal'>{column.label}</span>
                            {getSortIcon(column.name)}
                          </div>
                        ) : (
                          <span className='whitespace-normal'>{column.label}</span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(row)}
                    className={`hover:bg-blue-50/50 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''
                      }`}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row)}
                          onChange={(e) => handleRowSelection(row, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.name}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${column.align || 'left'}`}
                      >
                        {renderCellContent(column, row[column.name], row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.enabled && (
          <TablePagination
            currentPage={currentPage}
            totalItems={sortedData.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default CustomTable;