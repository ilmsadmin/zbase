import Link from 'next/link';
import { ComputerDesktopIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface POSStatusProps {
  activeShift: {
    id: number;
    name: string;
    startTime: string;
    cashier: string;
    totalSales: number;
    transactionCount: number;
  } | null;
}

export default function POSStatusCard({ activeShift }: POSStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Trạng thái POS</h3>
        <ComputerDesktopIcon className="h-6 w-6 text-blue-500" />
      </div>
      
      {activeShift ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium">Ca hiện tại:</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">{activeShift.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium">Nhân viên:</span>
            </div>
            <span className="text-sm font-semibold">{activeShift.cashier}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Thời gian bắt đầu:</span>
            <span className="text-sm">{activeShift.startTime}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Doanh số:</span>
            <span className="text-sm font-semibold text-green-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activeShift.totalSales)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Số giao dịch:</span>
            <span className="text-sm">{activeShift.transactionCount}</span>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/admin/pos/sales">
              <div className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors">
                Màn hình POS
              </div>
            </Link>
            <Link href={`/admin/pos/shifts/${activeShift.id}`}>
              <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors">
                Chi tiết ca
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <p className="text-gray-500">Không có ca làm việc nào đang hoạt động</p>
          <Link href="/admin/pos/shifts/new">
            <div className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors">
              Mở ca mới
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
