import { useState, useEffect, ReactNode } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/20/solid';
import DataTablePagination from './DataTablePagination';

export type SortDirection = 'asc' | 'desc' | 'none';
export type SortConfig = { column: string; direction: SortDirection };
export type FilterConfig = Record<string, any>;
export type FilterType = 'text' | 'select' | 'date' | 'number' | 'boolean';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: { label: string; value: any }[];  // For select type filters
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  idField?: string;
  selectable?: boolean;
  exportable?: boolean;
  exportFilename?: string;
  exportFormats?: ('csv' | 'excel')[];
  onRowClick?: (row: T) => void;
  className?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onSelectionChange?: (selectedRows: T[]) => void;
  isLoading?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  idField = 'id',
  selectable = false,
  exportable = false,
  exportFilename = 'data-export',
  exportFormats = ['csv'],
  onRowClick,
  className = '',
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onSelectionChange,
  isLoading = false
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: '', direction: 'none' });
  const [filters, setFilters] = useState<FilterConfig>({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  // Apply sorting to the data
  const sortedData = [...data].sort((a: any, b: any) => {
    if (sortConfig.direction === 'none') return 0;
    
    const columnKey = sortConfig.column;
    
    if (a[columnKey] === b[columnKey]) return 0;
    
    if (sortConfig.direction === 'asc') {
      return a[columnKey] < b[columnKey] ? -1 : 1;
    } else {
      return a[columnKey] > b[columnKey] ? -1 : 1;
    }
  });

  // Apply filters and search to the data
  const filteredData = sortedData.filter((row: any) => {
    // Apply filters
    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        const column = columns.find(col => col.key === key);
        
        if (column?.filterType === 'select') {
          if (row[key] !== filters[key]) return false;
        } else if (column?.filterType === 'date') {
          // Date comparison logic
          const rowDate = new Date(row[key]);
          const filterDate = new Date(filters[key]);
          if (rowDate.toDateString() !== filterDate.toDateString()) return false;
        } else if (column?.filterType === 'number') {
          if (Number(row[key]) !== Number(filters[key])) return false;
        } else if (column?.filterType === 'boolean') {
          if (Boolean(row[key]) !== Boolean(filters[key])) return false;
        } else {
          // Default text filter - case insensitive contains
          if (!String(row[key]).toLowerCase().includes(String(filters[key]).toLowerCase())) {
            return false;
          }
        }
      }
    }
    
    // Apply search query across all columns
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return columns.some((column) => {
        const value = row[column.key];
        return value !== undefined && String(value).toLowerCase().includes(query);
      });
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle column sort
  const handleSort = (column: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.column === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.column === column && sortConfig.direction === 'desc') {
      direction = 'none';
    }
    
    setSortConfig({ column, direction });
  };

  // Handle filter change
  const handleFilterChange = (column: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle row selection
  const handleRowSelect = (row: T) => {
    if (!selectable) return;
    
    const id = (row as any)[idField];
    const isSelected = selectedRows.some((r: any) => r[idField] === id);
    
    if (isSelected) {
      setSelectedRows(selectedRows.filter((r: any) => r[idField] !== id));
      setAllSelected(false);
    } else {
      setSelectedRows([...selectedRows, row]);
      if (selectedRows.length + 1 === paginatedData.length) {
        setAllSelected(true);
      }
    }
  };

  // Handle "select all" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
      setAllSelected(false);
    } else {
      setSelectedRows([...paginatedData]);
      setAllSelected(true);
    }
  };

  // Export data
  const handleExport = (format: 'csv' | 'excel') => {
    // Sample implementation for CSV export
    if (format === 'csv') {
      const headers = columns.map(col => col.header).join(',');
      const rows = filteredData.map(row => 
        columns.map(col => {
          const value = (row as any)[col.key];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      );
      
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${exportFilename}.csv`);
      link.click();
    }
    // Excel export would require a library like xlsx
  };

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange]);

  return (
    <div className={`bg-white shadow-sm rounded-lg ${className}`}>
      {/* Table Controls */}
      <div className="p-4 border-b border-gray-200 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Filter Button */}
          <button
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Lọc
          </button>
          
          {/* Export Button */}
          {exportable && (
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center"
                  onClick={() => handleExport('csv')}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="p-4 border-b border-gray-200 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {columns.filter(col => col.filterable).map((column) => (
            <div key={`filter-${column.key}`} className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                {column.header}
              </label>
              
              {column.filterType === 'select' ? (
                <select
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {column.filterOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : column.filterType === 'date' ? (
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                />
              ) : column.filterType === 'number' ? (
                <input
                  type="number"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                />
              ) : column.filterType === 'boolean' ? (
                <select
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value === 'true')}
                >
                  <option value="">Tất cả</option>
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                />
              )}
            </div>
          ))}
          
          <div className="col-span-full flex justify-end mt-2">
            <button
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 rounded-md mr-2"
              onClick={() => {
                setFilters({});
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </button>
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-md"
              onClick={() => setShowFilterMenu(false)}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="relative w-12 px-3 py-3.5">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3.5 text-sm font-semibold text-gray-900 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      className="group inline-flex items-center"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.column === column.key && sortConfig.direction !== 'none' ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUpIcon className="h-4 w-4 text-gray-900" aria-hidden="true" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 text-gray-900" aria-hidden="true" />
                          )
                        ) : (
                          <div className="h-4 w-4 text-transparent group-hover:text-gray-400">
                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                          </div>
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              // Loading state
              Array(pageSize).fill(null).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {selectable && <td className="px-3 py-4 whitespace-nowrap"><div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div></td>}
                  {columns.map((column, colIndex) => (
                    <td key={`skeleton-cell-${colIndex}`} className="px-4 py-4 whitespace-nowrap">
                      <div className={`h-4 bg-gray-200 rounded animate-pulse ${colIndex === 0 ? 'w-24' : 'w-16'}`}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              // Data rows
              paginatedData.map((row: any, rowIndex) => {
                const rowId = row[idField];
                const isSelected = selectedRows.some((r: any) => r[idField] === rowId);
                
                return (
                  <tr 
                    key={`row-${rowId || rowIndex}`}
                    className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {selectable && (
                      <td className="relative w-12 px-3 py-4">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center pl-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isSelected}
                            onChange={() => handleRowSelect(row)}
                          />
                        </div>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td 
                        key={`cell-${rowId || rowIndex}-${column.key}`} 
                        className={`px-4 py-3.5 text-sm text-gray-700 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              // Empty state
              <tr>
                <td 
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  className="px-4 py-8 text-sm text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
