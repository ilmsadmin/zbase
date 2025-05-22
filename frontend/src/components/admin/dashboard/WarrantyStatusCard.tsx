import Link from 'next/link';
import { ShieldCheckIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface WarrantyStatusProps {
  status: {
    pending: number;
    inProgress: number;
    completed: number;
    total: number;
  };
}

export default function WarrantyStatusCard({ status }: WarrantyStatusProps) {
  // Calculate percentages
  const pendingPercentage = Math.round((status.pending / status.total) * 100) || 0;
  const inProgressPercentage = Math.round((status.inProgress / status.total) * 100) || 0;
  const completedPercentage = Math.round((status.completed / status.total) * 100) || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Trạng thái bảo hành</h3>
        <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tổng số yêu cầu:</span>
          <span className="text-sm font-semibold">{status.total}</span>
        </div>

        {/* Pending warranties */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mr-1" />
              <span className="text-sm">Đang chờ xử lý:</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-amber-600">{status.pending}</span>
              <span className="text-xs text-gray-500 ml-1">({pendingPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full" 
              style={{ width: `${pendingPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* In progress warranties */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-sm">Đang xử lý:</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-blue-600">{status.inProgress}</span>
              <span className="text-xs text-gray-500 ml-1">({inProgressPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${inProgressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Completed warranties */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm">Đã hoàn thành:</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-green-600">{status.completed}</span>
              <span className="text-xs text-gray-500 ml-1">({completedPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/admin/warranties">
            <div className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors">
              Xem tất cả
            </div>
          </Link>
          <Link href="/admin/warranties/new">
            <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors">
              Tạo mới
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
