/**
 * Utilities for optimizing chart data rendering
 * These functions help improve performance with large datasets
 */

/**
 * Downsamples a time series dataset to a maximum number of points
 * using a simple averaging algorithm
 * 
 * @param data Array of data points with date/time and value
 * @param maxPoints Maximum number of points to return
 * @param xKey Key for the date/time value
 * @param yKey Key for the numeric value to average
 * @returns Downsampled array of data points
 */
export function downsampleTimeSeries<T>(
  data: T[],
  maxPoints: number,
  xKey: keyof T,
  yKey: keyof T
): T[] {
  // If data is already small enough, return as is
  if (data.length <= maxPoints) {
    return data;
  }

  // Calculate the sampling interval
  const samplingInterval = Math.ceil(data.length / maxPoints);
  const result: T[] = [];

  // Process data in chunks
  for (let i = 0; i < data.length; i += samplingInterval) {
    // Get the chunk
    const chunk = data.slice(i, Math.min(i + samplingInterval, data.length));
    
    // Calculate the average y value for this chunk
    const sum = chunk.reduce((acc, item) => {
      const value = Number(item[yKey]);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);
    
    const avg = sum / chunk.length;
    
    // Use the middle point from the chunk for x value
    const middleIndex = Math.floor(chunk.length / 2);
    const representative = { ...chunk[middleIndex] };
    
    // Assign the average to the y value
    (representative[yKey] as any) = avg;
    
    result.push(representative);
  }

  return result;
}

/**
 * Groups data points by categories and aggregates values
 * Useful for pie/donut charts with too many small slices
 * 
 * @param data Array of data points
 * @param categoryKey Key for the category name
 * @param valueKey Key for the value to sum
 * @param maxCategories Maximum number of categories to show (others will be grouped)
 * @param otherLabel Label for the "Others" category
 * @returns Optimized array of data points with at most maxCategories + 1 items
 */
export function optimizeCategoricalData<T>(
  data: T[],
  categoryKey: keyof T,
  valueKey: keyof T,
  maxCategories: number = 10,
  otherLabel: string = "Others"
): T[] {
  // If data is already small enough, return as is
  if (data.length <= maxCategories) {
    return data;
  }

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => {
    const valueA = Number(a[valueKey]);
    const valueB = Number(b[valueKey]);
    return valueB - valueA;
  });

  // Take the top N categories
  const topCategories = sortedData.slice(0, maxCategories);
  
  // Sum the values of the remaining categories
  const otherSum = sortedData.slice(maxCategories).reduce((acc, item) => {
    const value = Number(item[valueKey]);
    return acc + (isNaN(value) ? 0 : value);
  }, 0);
  
  // Create the "Others" category if there are any remaining items
  if (otherSum > 0) {
    const otherCategory = { ...sortedData[0] };
    (otherCategory[categoryKey] as any) = otherLabel;
    (otherCategory[valueKey] as any) = otherSum;
    
    topCategories.push(otherCategory);
  }
  
  return topCategories;
}

/**
 * Applies progressive loading for large datasets in charts
 * Shows a subset of data initially, then loads more as rendering completes
 * 
 * @param data Full dataset
 * @param initialCount Initial number of data points to render
 * @param onDataChange Callback when data chunk is ready
 * @param chunkSize Size of each additional chunk to load
 * @param interval Milliseconds between loading chunks
 */
export function progressiveChartLoading<T>(
  data: T[],
  initialCount: number,
  onDataChange: (data: T[]) => void,
  chunkSize: number = 50,
  interval: number = 100
): () => void {
  // Render initial data
  const initialData = data.slice(0, initialCount);
  onDataChange(initialData);
  
  // If all data is already shown, no need to continue
  if (data.length <= initialCount) {
    return () => {};
  }
  
  // Set up progressive loading
  let currentIndex = initialCount;
  
  const timer = setInterval(() => {
    // Calculate next chunk end
    const nextIndex = Math.min(currentIndex + chunkSize, data.length);
    
    // If we've reached the end, clear the interval
    if (currentIndex >= data.length) {
      clearInterval(timer);
      return;
    }
    
    // Update with additional data
    const updatedData = data.slice(0, nextIndex);
    onDataChange(updatedData);
    
    // Move to next chunk
    currentIndex = nextIndex;
    
    // If we've reached the end, clear the interval
    if (currentIndex >= data.length) {
      clearInterval(timer);
    }
  }, interval);
  
  // Return cleanup function
  return () => clearInterval(timer);
}

/**
 * Detects if chart data exceeds recommended rendering limits
 * Can be used to automatically optimize data
 * 
 * @param data Dataset to check
 * @param limit Recommended maximum data points
 * @returns Whether optimization is recommended
 */
export function shouldOptimizeChart<T>(
  data: T[],
  limit: number = 1000
): boolean {
  return data.length > limit;
}
