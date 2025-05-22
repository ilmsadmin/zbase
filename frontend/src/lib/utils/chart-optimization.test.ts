import { 
  downsampleTimeSeries, 
  optimizeCategoricalData, 
  progressiveChartLoading, 
  shouldOptimizeChart 
} from './chart-optimization';

describe('Chart Optimization Utilities', () => {
  describe('downsampleTimeSeries', () => {
    it('should return the original data if it is already small enough', () => {
      const data = [
        { date: '2025-05-01', value: 100 },
        { date: '2025-05-02', value: 200 },
        { date: '2025-05-03', value: 300 }
      ];
      
      const result = downsampleTimeSeries(data, 5, 'date', 'value');
      expect(result).toEqual(data);
    });
    
    it('should downsample time series data to the specified max points', () => {
      const data = Array(100).fill(null).map((_, i) => ({
        date: `2025-05-${(i + 1).toString().padStart(2, '0')}`,
        value: 100 + i
      }));
      
      const result = downsampleTimeSeries(data, 10, 'date', 'value');
      
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result[0].date).toBe(data[5].date); // Confirm we're getting middle points
      
      // Ensure the average calculation is correct
      const firstChunkAvg = data.slice(0, 10).reduce((sum, item) => sum + item.value, 0) / 10;
      expect(result[0].value).toBeCloseTo(firstChunkAvg);
    });
    
    it('should handle empty data', () => {
      const data = [];
      const result = downsampleTimeSeries(data, 10, 'date', 'value');
      expect(result).toEqual([]);
    });
  });
  
  describe('optimizeCategoricalData', () => {
    it('should return original data if already below max categories', () => {
      const data = [
        { name: 'Category 1', value: 100 },
        { name: 'Category 2', value: 200 },
        { name: 'Category 3', value: 300 }
      ];
      
      const result = optimizeCategoricalData(data, 'name', 'value', 5);
      expect(result).toEqual(data);
    });
    
    it('should group small categories into an "Others" category', () => {
      const data = Array(20).fill(null).map((_, i) => ({
        name: `Category ${i + 1}`,
        value: 100 - i * 5 // Higher indices have smaller values
      }));
      
      const result = optimizeCategoricalData(data, 'name', 'value', 10, 'Others');
      
      expect(result.length).toBe(11); // 10 top categories + Others
      expect(result[10].name).toBe('Others');
      
      // Verify top categories are preserved
      expect(result[0].name).toBe('Category 1');
      expect(result[1].name).toBe('Category 2');
      
      // Verify Others contains sum of remaining values
      const sumOfSmallCategories = data.slice(10).reduce((sum, item) => sum + item.value, 0);
      expect(result[10].value).toBe(sumOfSmallCategories);
    });
  });
  
  describe('shouldOptimizeChart', () => {
    it('should return false for data below the limit', () => {
      const data = Array(500).fill(null);
      expect(shouldOptimizeChart(data, 1000)).toBe(false);
    });
    
    it('should return true for data above the limit', () => {
      const data = Array(1500).fill(null);
      expect(shouldOptimizeChart(data, 1000)).toBe(true);
    });
    
    it('should use default limit if not specified', () => {
      const smallData = Array(500).fill(null);
      const largeData = Array(1500).fill(null);
      
      expect(shouldOptimizeChart(smallData)).toBe(false);
      expect(shouldOptimizeChart(largeData)).toBe(true);
    });
  });
  
  describe('progressiveChartLoading', () => {
    it('should initially load the initial count of data points', () => {
      const data = Array(100).fill(null).map((_, i) => ({ id: i, value: i }));
      const onDataChange = jest.fn();
      
      progressiveChartLoading(data, 10, onDataChange);
      
      expect(onDataChange).toHaveBeenCalledWith(data.slice(0, 10));
    });
    
    it('should return a cleanup function', () => {
      const data = Array(100).fill(null);
      const onDataChange = jest.fn();
      
      const cleanup = progressiveChartLoading(data, 10, onDataChange);
      
      expect(typeof cleanup).toBe('function');
      cleanup(); // Call cleanup to ensure it doesn't throw
    });
    
    it('should not set interval if all data is shown initially', () => {
      jest.useFakeTimers();
      
      const data = Array(5).fill(null);
      const onDataChange = jest.fn();
      
      progressiveChartLoading(data, 10, onDataChange);
      
      jest.advanceTimersByTime(200);
      expect(onDataChange).toHaveBeenCalledTimes(1); // Only initial call
      
      jest.useRealTimers();
    });
    
    // Note: Complete timer-based testing would require more complex setup
    // with jest.runAllTimers() or similar to test the interval behavior
  });
});
