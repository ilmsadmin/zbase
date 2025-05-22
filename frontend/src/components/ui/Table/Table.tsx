import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpIcon, ArrowDownIcon, FunnelIcon, 
  MagnifyingGlassIcon, ArrowPathIcon,
  ChevronLeftIcon, ChevronRightIcon,
  ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from '@heroicons/react/20/solid';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import TablePagination from './TablePagination';
import TableFilter from './TableFilter';

export type SortDirection = 'asc' | 'desc';

export interface Column<T = any> {
  header: string;
  accessor: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'number' | 'select' | 'date';
  filterOptions?: { value: string; label: string }[];
  minWidth?: string;
  maxWidth?: string;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  primaryKey: keyof T;
  isLoading?: boolean;
  onSort?: (field: keyof T | string, direction: SortDirection) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPaginate?: (page: number, pageSize: number) => void;
  serverSide?: boolean;
  totalItems?: number;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  actions?: (item: T) => React.ReactNode;
  noDataMessage?: string;
  onExport?: (type: 'csv' | 'excel') => void;
  className?: string;
}

export default function Table<T>({
  columns,
  data,
  primaryKey,
  isLoading = false,
  onSort,
  onFilter,
  onPaginate,
  serverSide = false,
  totalItems,
  selectable = false,
  onRowSelect,
  actions,
  noDataMessage = "Không có dữ liệu",
  onExport,
  className = ""
}: TableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sorting
  const handleSort = (field: keyof T | string) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    
    setSortField(field);
    setSortDirection(direction);
    
    if (onSort && serverSide) {
      onSort(field, direction);
    }
  };
  
  // Handle filtering
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    if (onFilter && serverSide) {
      onFilter(newFilters);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (onPaginate && serverSide) {
      onPaginate(page, pageSize);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    
    if (onPaginate && serverSide) {
      onPaginate(1, size);
    }
  };

  // Handle row selection
  const handleSelectRow = (row: T) => {
    setSelectedRows(prevSelected => {
      const rowId = row[primaryKey];
      const isSelected = prevSelected.some(item => item[primaryKey] === rowId);
      
      let newSelection: T[];
      if (isSelected) {
        newSelection = prevSelected.filter(item => item[primaryKey] !== rowId);
      } else {
        newSelection = [...prevSelected, row];
      }
      
      if (onRowSelect) {
        onRowSelect(newSelection);
      }
      
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(filteredData);
      if (onRowSelect) {
        onRowSelect(filteredData);
      }
    } else {
      setSelectedRows([]);
      if (onRowSelect) {
        onRowSelect([]);
      }
    }
  };

  // Reset selection when data changes
  useEffect(() => {
    setSelectedRows([]);
    setSelectAll(false);
  }, [data]);

  // Client-side filtering, sorting, pagination
  const filteredData = useMemo(() => {
    if (serverSide) return data;
    
    // Apply search filter globally
    let filtered = [...data];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return columns.some(column => {
          const accessor = String(column.accessor);
          const value = item[accessor as keyof T];
          return value !== undefined && 
                 String(value).toLowerCase().includes(lowerSearchTerm);
        });
      });
    }
    
    // Apply column-specific filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filtered = filtered.filter(item => {
          const itemValue = item[key as keyof T];
          
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          } 
          else if (typeof value === 'number') {
            return Number(itemValue) === value;
          }
          else if (value instanceof Date) {
            const itemDate = itemValue instanceof Date 
              ? itemValue 
              : new Date(String(itemValue));
            return itemDate.toDateString() === value.toDateString();
          }
          
          return itemValue === value;
        });
      }
    });
    
    return filtered;
  }, [data, filters, searchTerm, serverSide, columns]);
  
  // Client-side sorting
  const sortedData = useMemo(() => {
    if (serverSide || !sortField) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];
      
      if (aValue === bValue) return 0;
      
      const compareResult = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  }, [filteredData, sortField, sortDirection, serverSide]);
  
  // Client-side pagination
  const paginatedData = useMemo(() => {
    if (serverSide) return sortedData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, serverSide]);

  const displayData = paginatedData;
  const totalRows = serverSide ? totalItems || 0 : filteredData.length;
  
  return (
    <div className={`bg-white shadow-sm rounded-lg border border-gray-200 ${className}`}>
      {/* Table header with search and actions */}
      <div className="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-3 sm:space-y-0">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-9 py-2 pr-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className={`${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-500'} 
                      px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-1.5" />
            Bộ lọc
          </button>
          
          {onExport && (
            <div className="relative group">
              <button
                className="bg-white text-gray-500 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1.5" />
                Xuất
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden group-hover:block">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => onExport('csv')}
                >
                  Xuất CSV
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => onExport('excel')}
                >
                  Xuất Excel
                </button>
              </div>
            </div>
          )}
          
          <button 
            className="bg-white text-gray-500 p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            onClick={() => {
              setFilters({});
              setSearchTerm('');
              setSortField(null);
              setSortDirection('asc');
              setCurrentPage(1);
            }}
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <TableFilter 
            columns={columns.filter(col => col.filterable !== false)} 
            filters={filters} 
            onFilter={handleFilter} 
          />
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${column.sortable !== false ? 'cursor-pointer select-none' : ''}`}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    width: column.width
                  }}
                  onClick={() => column.sortable !== false && handleSort(column.accessor)}
                >
                  <div className="group flex items-center">
                    {column.header}
                    {column.sortable !== false && (
                      <span className="ml-2 flex-none rounded text-gray-400">
                        {sortField === column.accessor ? (
                          sortDirection === 'asc' ? (
                            <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpIcon className="h-4 w-4 invisible group-hover:visible group-focus:visible" aria-hidden="true" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              
              {actions && (
                <th scope="col" className="relative px-3 py-3.5 text-right">
                  <span className="sr-only">Thao tác</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="py-10 text-center text-gray-500">
                  <div className="flex justify-center">
                    <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  </div>
                  <div className="mt-2">Đang tải dữ liệu...</div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="py-10 text-center text-gray-500">
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              displayData.map((row) => {
                const isSelected = selectedRows.some(
                  selected => selected[primaryKey] === row[primaryKey]
                );
                
                return (
                  <tr
                    key={String(row[primaryKey])}
                    className={`${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    {selectable && (
                      <td className="relative px-3 py-4 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                        />
                      </td>
                    )}
                    
                    {columns.map((column, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        className="px-3 py-4 text-sm text-gray-900"
                      >
                        {column.cell ? column.cell(row) : String(row[column.accessor as keyof T] ?? '')}
                      </td>
                    ))}
                    
                    {actions && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalRows}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
