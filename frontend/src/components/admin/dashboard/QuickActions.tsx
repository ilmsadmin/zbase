import Link from 'next/link';
import { 
  PlusCircleIcon, 
  DocumentPlusIcon,
  UserPlusIcon, 
  TruckIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ComputerDesktopIcon,
  CalendarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: 'Tạo đơn hàng',
      description: 'Tạo hóa đơn bán hàng mới',
      icon: <DocumentPlusIcon className="h-7 w-7" />,
      href: '/admin/invoices/create',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    },
    {
      title: 'Thêm sản phẩm',
      description: 'Thêm sản phẩm mới vào hệ thống',
      icon: <PlusCircleIcon className="h-7 w-7" />,
      href: '/admin/products/new',
      color: 'bg-green-50 text-green-700 hover:bg-green-100'
    },
    {
      title: 'Nhập kho',
      description: 'Tạo phiếu nhập kho sản phẩm',
      icon: <TruckIcon className="h-7 w-7" />,
      href: '/admin/inventory/transactions/create?type=import',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
    },
    {
      title: 'Thêm khách hàng',
      description: 'Thêm khách hàng mới vào hệ thống',
      icon: <UserPlusIcon className="h-7 w-7" />,
      href: '/admin/customers/new',
      color: 'bg-amber-50 text-amber-700 hover:bg-amber-100'
    },
    {
      title: 'Tạo yêu cầu bảo hành',
      description: 'Tạo yêu cầu bảo hành mới',
      icon: <ShieldCheckIcon className="h-7 w-7" />,
      href: '/admin/warranties/new',
      color: 'bg-red-50 text-red-700 hover:bg-red-100'
    },
    {
      title: 'Mở ca làm việc POS',
      description: 'Mở ca làm việc mới cho POS',
      icon: <CalendarIcon className="h-7 w-7" />,
      href: '/admin/pos/shifts/new',
      color: 'bg-teal-50 text-teal-700 hover:bg-teal-100'
    },
    {
      title: 'Tạo thu chi',
      description: 'Tạo phiếu thu chi mới',
      icon: <BanknotesIcon className="h-7 w-7" />,
      href: '/admin/transactions/new',
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
    },
    {
      title: 'Màn hình POS',
      description: 'Chuyển tới giao diện bán hàng POS',
      icon: <ComputerDesktopIcon className="h-7 w-7" />,
      href: '/admin/pos/sales',
      color: 'bg-rose-50 text-rose-700 hover:bg-rose-100'
    },
    {
      title: 'Xem báo cáo',
      description: 'Báo cáo doanh thu hôm nay',
      icon: <ChartBarIcon className="h-7 w-7" />,
      href: '/admin/reports/sales/today',
      color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Thao tác nhanh</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className={`h-full rounded-lg p-4 transition-all ${action.color} flex flex-col`}>
              <div className="mb-2">
                {action.icon}
              </div>
              <h4 className="text-sm font-medium mb-1">{action.title}</h4>
              <p className="text-xs opacity-75">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
