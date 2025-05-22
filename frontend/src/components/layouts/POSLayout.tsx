import { ReactNode, useState } from 'react';
import { 
  ShoppingCartIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  HomeIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ClockIcon,
  DocumentTextIcon,
  BanknotesIcon,
  InformationCircleIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface POSLayoutProps {
  children: ReactNode;
}

export default function POSLayout({ children }: POSLayoutProps) {
  const pathname = usePathname();
  const [showShiftInfo, setShowShiftInfo] = useState(false);

  const navItems = [
    {
      name: 'Bán Hàng',
      href: '/pos/sales',
      icon: <ShoppingCartIcon className="h-6 w-6" />,
      primary: true
    },
    {
      name: 'Đơn Hàng',
      href: '/pos/orders',
      icon: <DocumentTextIcon className="h-6 w-6" />
    },
    {
      name: 'Bảo Hành',
      href: '/pos/warranty',
      icon: <ShieldCheckIcon className="h-6 w-6" />
    },
    {
      name: 'Thông Tin Ca',
      href: '#',
      icon: <ClockIcon className="h-6 w-6" />,
      onClick: () => setShowShiftInfo(true)
    }
  ];
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navigation Header */}
      <header className="bg-blue-600 text-white shadow-md z-10">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/pos" className="font-bold text-xl flex items-center">
                <span className="bg-white text-blue-600 h-8 w-8 rounded-full flex items-center justify-center mr-2 font-bold">Z</span>
                <span>Base POS</span>
              </Link>
            </div>
            
            {/* Primary Navigation Items */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      item.primary 
                        ? 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href || pathname?.startsWith(`${item.href}/`)
                        ? 'bg-blue-700 text-white' 
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    } ${item.primary ? 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700' : ''}`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </nav>
            
            {/* Right side - User info and notifications */}
            <div className="flex items-center space-x-4">
              <div className="text-blue-100">
                <span className="text-sm font-medium">Nhân viên: Nguyễn Văn A</span>
                <span className="text-xs block">Kho: Kho chính</span>
              </div>
              
              <button className="relative p-1 text-blue-100 hover:text-white">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <Link 
                href="/auth/logout"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm"
              >
                Đóng Ca
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md text-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification bar */}
      <div className="bg-blue-50 text-blue-700 py-2 px-4 text-sm border-b border-blue-100">
        <div className="container mx-auto flex items-center">
          <InformationCircleIcon className="h-5 w-5 mr-2" />
          <span>Ca làm việc đã bắt đầu lúc 8:00. Nhớ đóng ca trước khi kết thúc!</span>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {children}
      </main>

      {/* Shift Info Modal */}
      {showShiftInfo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Thông Tin Ca Làm Việc</h2>
              <button onClick={() => setShowShiftInfo(false)} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nhân viên:</p>
                    <p className="font-medium">Nguyễn Văn A</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kho:</p>
                    <p className="font-medium">Kho chính</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bắt đầu:</p>
                    <p className="font-medium">08:00 - 22/05/2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian:</p>
                    <p className="font-medium">2h 30p</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Thống kê ca hiện tại</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Số đơn hàng</p>
                    <p className="text-lg font-bold text-blue-600">12</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Doanh thu</p>
                    <p className="text-lg font-bold text-green-600">2.500.000 đ</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowShiftInfo(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
