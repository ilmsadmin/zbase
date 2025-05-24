"use client";

import { useQuery } from '@tanstack/react-query';
import { getSavedReports, SavedReport } from '@/services/api/reports';
import Link from 'next/link';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function SavedReportsList() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['savedReports'],
    queryFn: getSavedReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Mock data if API doesn't return results yet
  const mockReports: SavedReport[] = [
    {
      id: '1',
      name: 'Monthly Revenue Summary',
      description: 'Revenue breakdown by product category',
      category: 'revenue',
      lastRun: '2025-05-15T10:30:00Z',
      createdAt: '2025-04-01T08:15:00Z',
      parameters: { period: 'monthly' },
    },
    {
      id: '2',
      name: 'Low Stock Alert Report',
      description: 'Products below minimum stock levels',
      category: 'inventory',
      lastRun: '2025-05-20T14:45:00Z',
      createdAt: '2025-03-15T11:20:00Z',
      parameters: { threshold: 10 },
    },
    {
      id: '3',
      name: 'Top Customer Analysis',
      description: 'Analysis of top 10 customers by revenue',
      category: 'customers',
      lastRun: '2025-05-18T09:15:00Z',
      createdAt: '2025-02-28T16:10:00Z',
      parameters: { count: 10 },
    },
  ];

  const displayReports = reports || mockReports;

  if (displayReports.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No saved reports yet.</p>
        <p className="mt-2 text-sm">
          Create your first report with the{' '}
          <Link href="/admin/reports/builder" className="text-primary hover:underline">
            report builder
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayReports.map((report) => (
        <Link
          key={report.id}
          href={`/admin/reports/${report.category}?reportId=${report.id}`}
          className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-medium text-gray-800">{report.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
          <div className="flex items-center text-xs text-gray-400 mt-2 space-x-4">
            <div className="flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              <span>
                Last run: {formatDistanceToNow(new Date(report.lastRun), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>
                Created: {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
