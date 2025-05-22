import { ReactNode, useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number | string;
  width?: number | string;
  className?: string;
  isLoading?: boolean;
  downloadCSV?: () => void;
  onRefresh?: () => void;
  actions?: ReactNode;
}

export default function ChartWrapper({
  title,
  subtitle,
  children,
  height = 300,
  width = '100%',
  className = '',
  isLoading = false,
  downloadCSV,
  onRefresh,
  actions
}: ChartWrapperProps) {
  const [showActions, setShowActions] = useState(false);
  
  // Close the actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showActions) {
        setShowActions(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showActions]);

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}
      style={{ width }}
    >
      {/* Chart Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {onRefresh && (
            <button 
              type="button"
              onClick={onRefresh}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="sr-only">Làm mới</span>
            </button>
          )}
          
          {downloadCSV && (
            <button 
              type="button"
              onClick={downloadCSV}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span className="sr-only">Tải xuống CSV</span>
            </button>
          )}
          
          {actions && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Tùy chọn</span>
              </button>
              
              {showActions && (
                <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Chart Content */}
      <div 
        className="relative"
        style={{ height, minHeight: '200px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <svg 
                className="animate-spin h-8 w-8 text-blue-600" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}
        
        <div className="h-full w-full p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
