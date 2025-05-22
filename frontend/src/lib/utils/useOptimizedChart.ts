import { useState, useEffect, useMemo } from 'react';
import { downsampleTimeSeries, optimizeCategoricalData, shouldOptimizeChart } from './chart-optimization';

type ChartDataType = 'timeSeries' | 'categorical';

interface UseOptimizedChartOptions {
  maxDataPoints?: number;
  type: ChartDataType;
  threshold?: number;
  maxCategories?: number;
  otherLabel?: string;
}

/**
 * A hook to optimize chart data for better performance
 * 
 * @param data Raw chart data
 * @param options Configuration options
 * @returns Optimized chart data
 */
export function useOptimizedChart<T>(
  data: T[],
  options: UseOptimizedChartOptions
): {
  optimizedData: T[];
  isOptimized: boolean;
  dataCount: number;
} {
  const {
    maxDataPoints = 100,
    type,
    threshold = 1000,
    maxCategories = 10,
    otherLabel = 'Others'
  } = options;

  const [isOptimized, setIsOptimized] = useState(false);

  // Memoize optimized data to avoid unnecessary recalculations
  const optimizedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Check if data needs optimization
    if (!shouldOptimizeChart(data, threshold)) {
      setIsOptimized(false);
      return data;
    }

    // Apply appropriate optimization strategy
    setIsOptimized(true);
    
    if (type === 'timeSeries') {
      // For time series data, assume the first item has the expected structure to get keys
      const sampleItem = data[0] as Record<string, any>;
      
      // Try to find date/time and value keys
      const keys = Object.keys(sampleItem);
      const dateKey = keys.find(k => 
        k.toLowerCase().includes('date') || 
        k.toLowerCase().includes('time') ||
        k.toLowerCase() === 'x'
      );
      
      const valueKey = keys.find(k => 
        k.toLowerCase().includes('value') ||
        k.toLowerCase().includes('amount') ||
        k.toLowerCase().includes('revenue') ||
        k.toLowerCase().includes('sales') ||
        k.toLowerCase() === 'y'
      );
      
      if (dateKey && valueKey) {
        return downsampleTimeSeries(
          data, 
          maxDataPoints, 
          dateKey as keyof T, 
          valueKey as keyof T
        );
      }
    } else if (type === 'categorical') {
      // For categorical data, assume the first item has the expected structure to get keys
      const sampleItem = data[0] as Record<string, any>;
      
      // Try to find category and value keys
      const keys = Object.keys(sampleItem);
      const labelKey = keys.find(k => 
        k.toLowerCase().includes('name') || 
        k.toLowerCase().includes('category') || 
        k.toLowerCase().includes('label') ||
        k.toLowerCase() === 'x'
      );
      
      const valueKey = keys.find(k => 
        k.toLowerCase().includes('value') ||
        k.toLowerCase().includes('amount') ||
        k.toLowerCase().includes('count') ||
        k.toLowerCase() === 'y'
      );
      
      if (labelKey && valueKey) {
        return optimizeCategoricalData(
          data, 
          labelKey as keyof T, 
          valueKey as keyof T, 
          maxCategories,
          otherLabel
        );
      }
    }

    // If optimization failed or wasn't needed, return original data
    setIsOptimized(false);
    return data;
  }, [data, maxDataPoints, type, threshold, maxCategories, otherLabel]);

  return {
    optimizedData,
    isOptimized,
    dataCount: data?.length || 0,
  };
}

export default useOptimizedChart;
