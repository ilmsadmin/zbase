"use client";

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendValue: string;
  icon: React.ReactNode;
  trendDirection: 'up' | 'down' | 'neutral';
}

export const StatCard = ({ title, value, trend, trendValue, icon, trendDirection }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 rounded-full bg-orange-50">
          {icon}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      
      <div className="flex items-center">
        <span className={`text-sm mr-2 flex items-center font-medium ${
          trendDirection === 'up' 
            ? 'text-green-600' 
            : trendDirection === 'down' 
              ? 'text-red-600' 
              : 'text-gray-500'
        }`}>
          {trendDirection === 'up' && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          )}
          {trendDirection === 'down' && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
            </svg>
          )}
          {trendValue}
        </span>
        <span className="text-sm text-gray-500">{trend}</span>
      </div>
      
      {/* Decorative element */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${
        trendDirection === 'up' 
          ? 'bg-green-500/5' 
          : trendDirection === 'down' 
            ? 'bg-red-500/5'
            : 'bg-gray-500/5'
      }`}></div>
    </div>
  );
};
