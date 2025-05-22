import { useState, useEffect } from 'react';
import { Column } from './Table';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/20/solid';

interface TableFilterProps {
  columns: Column[];
  filters: Record<string, any>;
  onFilter: (filters: Record<string, any>) => void;
}

export default function TableFilter({ 
  columns, 
  filters, 
  onFilter 
}: TableFilterProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(filters);
  
  // Update local filters when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (accessor: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [accessor]: value
    }));
  };
  
  const handleClearFilter = (accessor: string) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[accessor];
      return newFilters;
    });
  };
  
  const handleClearAllFilters = () => {
    setLocalFilters({});
  };
  
  const handleApplyFilters = () => {
    onFilter(localFilters);
  };
  
  const renderFilterInput = (column: Column) => {
    const value = localFilters[column.accessor as string] || '';
    
    switch (column.filterType) {
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFilterChange(column.accessor as string, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={`Lọc theo ${column.header}`}
          />
        );
        
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(column.accessor as string, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
        
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(column.accessor as string, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">-- Chọn --</option>
            {column.filterOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(column.accessor as string, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={`Lọc theo ${column.header}`}
          />
        );
    }
  };
  
  const activeFilterCount = Object.keys(localFilters).length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Bộ lọc nâng cao</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 text-xs font-medium rounded-full bg-blue-100 text-blue-800 py-0.5 px-2">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            Xóa tất cả
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.accessor as string} className="space-y-1">
            <div className="flex items-center justify-between">
              <label 
                htmlFor={`filter-${column.accessor}`}
                className="block text-xs font-medium text-gray-700"
              >
                {column.header}
              </label>
              
              {localFilters[column.accessor as string] && (
                <button
                  type="button"
                  onClick={() => handleClearFilter(column.accessor as string)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </div>
            
            {renderFilterInput(column)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClearAllFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Đặt lại
        </button>
        <button
          type="button"
          onClick={handleApplyFilters}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
}
