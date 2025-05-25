"use client";

import React, { useState, useEffect } from 'react';
import { dashboardService, RevenueData } from '@/lib/services/dashboardService';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const RevenueChart = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRevenueData = async () => {      try {
        setLoading(true);
        const data = await dashboardService.getRevenueData({ period });
        setRevenueData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Không thể tải dữ liệu doanh thu');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [period]);
  
  // Process the API data for the chart
  const processChartData = () => {
    const labels = revenueData.map(item => {
      const date = new Date(item.date);
      
      // Format date based on period
      if (period === 'week') {
        return date.getDate().toString(); // Day of month
      } else if (period === 'month') {
        return date.getDate().toString(); // Day of month
      } else if (period === 'quarter') {
        // Get month name
        return date.toLocaleDateString('vi-VN', { month: 'short' });
      } else {
        // Year view - month name
        return date.toLocaleDateString('vi-VN', { month: 'short' });
      }
    });
    
    const revenue = revenueData.map(item => item.revenue);
    
    return { labels, revenue };
  };
  
  const chartData = processChartData();
  
  // Calculate the max value for the revenue to set the y-axis scaling
  const maxRevenue = Math.max(...chartData.revenue, 1000); // Set minimum to avoid division by zero
  
  // Calculate positions for the line chart
  const getPathData = () => {
    if (chartData.labels.length === 0) return '';
    
    return chartData.labels.map((_, index) => {
      const x = (index / (chartData.labels.length - 1 || 1)) * 100;
      const y = 100 - (chartData.revenue[index] / maxRevenue) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">          <h2 className="text-lg font-semibold text-gray-800">Tổng quan doanh thu</h2>
          <div className="flex animate-pulse">
            <div className="h-8 w-16 bg-gray-200 rounded-md mr-2"></div>
            <div className="h-8 w-16 bg-gray-200 rounded-md mr-2"></div>
            <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <div className="h-60 animate-pulse bg-gray-100 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">        <h2 className="text-lg font-semibold text-gray-800">Tổng quan doanh thu</h2>
        <div className="flex">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 text-sm rounded-md mr-2 ${
              period === 'week' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Tuần
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 text-sm rounded-md mr-2 ${
              period === 'month' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}          >
            Tháng
          </button>
          <button 
            onClick={() => setPeriod('quarter')}
            className={`px-3 py-1 text-sm rounded-md mr-2 ${
              period === 'quarter' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Quý
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-3 py-1 text-sm rounded-md ${
              period === 'year' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}          >
            Năm
          </button>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">          <p>{error}</p>
          <button 
            onClick={() => setPeriod(period)} // Re-fetch by "changing" to the same period
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="relative h-60">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
            <div>₫{formatNumber(maxRevenue)}</div>
            <div>₫{formatNumber(maxRevenue * 0.75)}</div>
            <div>₫{formatNumber(maxRevenue * 0.5)}</div>
            <div>₫{formatNumber(maxRevenue * 0.25)}</div>
            <div>₫0</div>
          </div>
          
          {/* Y-axis grid lines */}
          <div className="absolute left-16 right-0 top-0 bottom-0">
            <div className="absolute left-0 right-0 top-0 border-t border-gray-100"></div>
            <div className="absolute left-0 right-0 top-1/4 border-t border-gray-100"></div>
            <div className="absolute left-0 right-0 top-1/2 border-t border-gray-100"></div>
            <div className="absolute left-0 right-0 top-3/4 border-t border-gray-100"></div>
            <div className="absolute left-0 right-0 bottom-0 border-t border-gray-100"></div>
          </div>
          
          {/* Chart */}
          <div className="absolute left-16 right-0 top-0 bottom-0">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Revenue line */}
              <path
                d={getPathData()}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Revenue gradient area */}
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
              <path
                d={`${getPathData()} L 100 100 L 0 100 Z`}
                fill="url(#revenueGradient)"
              />
              
              {/* Data points */}
              {chartData.labels.map((_, index) => {
                const x = (index / (chartData.labels.length - 1 || 1)) * 100;
                const y = 100 - (chartData.revenue[index] / maxRevenue) * 100;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#f97316"
                    className="data-point"
                  />
                );
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 transform translate-y-6 flex justify-between px-2 text-xs text-gray-500">
              {chartData.labels.map((label, index) => (
                <div 
                  key={index} 
                  className="text-center"
                  style={{ 
                    width: `${100 / (chartData.labels.length || 1)}%`,
                    left: `${(index / (chartData.labels.length - 1 || 1)) * 100}%`,
                    transform: 'translateX(-50%)',
                    position: 'absolute',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Total revenue display */}      <div className="mt-12 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Tổng doanh thu ({period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : period === 'quarter' ? 'quý' : 'năm'})</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {formatCurrency(revenueData.reduce((total, item) => total + item.revenue, 0))}
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-sm text-gray-500">Doanh thu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
