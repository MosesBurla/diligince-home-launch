export interface FilterOption {
  key: string;
  value: string;
  color?: string;
}

export interface ColumnConfig {
  name: string;
  label: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  filterOptions?: FilterOption[];
  action?: (row: any) => void;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [columnName: string]: string[];
}

export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
  currentPage: number;
  totalItems?: number;
  serverSide?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface TableProps {
  columns: ColumnConfig[];
  data: any[];
  filterCallback?: (filters: FilterConfig) => void;
  searchCallback?: (searchTerm: string, selectedColumns: string[]) => void;
  onRowClick?: (row: any) => void;
  onExport?: {
    xlsx?: () => void;
    csv?: () => void;
  };
  onAdd?: () => void;
  loading?: boolean;
  pagination?: PaginationConfig;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  globalSearchPlaceholder?: string;
  className?: string;
  additionalFilters?: React.ReactNode;
  hideSearch?: boolean;
  hideFilters?: boolean;
}