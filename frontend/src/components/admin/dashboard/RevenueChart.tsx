"use client";

import React, { useState } from 'react';

export const RevenueChart = () => {
  const [period, setPeriod] = useState('month');
  
  // In a real app, this data would come from API calls based on the selected period
  const chartData = {
    month: {
      labels: ['1', '5', '10', '15', '20', '25', '30'],
      revenue: [120000, 250000, 350000, 480000, 520000, 850000, 980000],
      orders: [20, 35, 40, 48, 50, 75, 90]
    },
    quarter: {
      labels: ['Jan', 'Feb', 'Mar'],
      revenue: [2500000, 3200000, 4500000],
      orders: [210, 280, 350]
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      revenue: [2500000, 2300000, 3100000, 3600000, 3200000, 3800000, 4200000, 4500000, 5200000, 5800000, 6500000, 7200000],
      orders: [210, 190, 250, 300, 280, 320, 350, 380, 420, 470, 510, 580]
    }
  };
  
  const currentData = chartData[period as keyof typeof chartData];
  
  // Calculate the max value for the revenue to set the y-axis scaling
  const maxRevenue = Math.max(...currentData.revenue);
  const revenueScale = maxRevenue / 100;
  
  // Calculate positions for the line chart
  const getPathData = () => {
    return currentData.labels.map((_, index) => {
      const x = (index / (currentData.labels.length - 1)) * 100;
      const y = 100 - (currentData.revenue[index] / maxRevenue) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
        <div className="flex">
          <button 
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 text-sm rounded-md mr-2 ${
              period === 'month' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setPeriod('quarter')}
            className={`px-3 py-1 text-sm rounded-md mr-2 ${
              period === 'quarter' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Quarter
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-3 py-1 text-sm rounded-md ${
              period === 'year' 
                ? 'bg-orange-100 text-orange-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
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
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            {/* Line */}
            <path
              d={getPathData()}
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
            />
            
            {/* Area under the line */}
            <path
              d={`${getPathData()} L 100 100 L 0 100 Z`}
              fill="url(#orange-gradient)"
              opacity="0.2"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="orange-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Data points */}
            {currentData.revenue.map((value, index) => {
              const x = (index / (currentData.labels.length - 1)) * 100;
              const y = 100 - (value / maxRevenue) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="white"
                  stroke="#f97316"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="mt-2 pl-16 grid gap-x-2" style={{ 
        gridTemplateColumns: `repeat(${currentData.labels.length}, 1fr)` 
      }}>
        {currentData.labels.map((label, index) => (
          <div key={index} className="text-xs text-gray-500 text-center">
            {label}
          </div>
        ))}
      </div>
      
      {/* Legend and Stats */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        
        <div className="flex space-x-4">
          <div className="text-sm">
            <span className="text-gray-500">Total Revenue: </span>
            <span className="font-medium text-gray-800">
              ₫{formatNumber(currentData.revenue.reduce((a, b) => a + b, 0))}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-500">Total Orders: </span>
            <span className="font-medium text-gray-800">
              {currentData.orders.reduce((a, b) => a + b, 0)}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-500">Avg. Order Value: </span>
            <span className="font-medium text-gray-800">
              ₫{formatNumber(
                Math.round(
                  currentData.revenue.reduce((a, b) => a + b, 0) / 
                  currentData.orders.reduce((a, b) => a + b, 0)
                )
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format numbers with commas
function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
