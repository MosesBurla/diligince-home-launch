export interface FilterOption {
  key: string;
  value: string;
  color?: string;
}

export interface ColumnConfig<T = Record<string, any>> {
  name: string;
  label: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  filterOptions?: FilterOption[];
  action?: (row: T) => void;
  render?: (value: any, row: T) => React.ReactNode;
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

export interface TableProps<T = Record<string, any>> {
  columns: ColumnConfig<T>[];
  data: T[];
  filterCallback?: (filters: FilterConfig) => void;
  searchCallback?: (searchTerm: string, selectedColumns: string[]) => void;
  onRowClick?: (row: T) => void;
  onExport?: {
    xlsx?: () => void;
    csv?: () => void;
  };
  onAdd?: () => void;
  loading?: boolean;
  pagination?: PaginationConfig;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  globalSearchPlaceholder?: string;
  className?: string;
  additionalFilters?: React.ReactNode;
  hideSearch?: boolean;
  hideFilters?: boolean;
}