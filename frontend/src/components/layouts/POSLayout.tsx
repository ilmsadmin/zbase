import { ReactNode } from 'react';
import { 
  ShoppingCartIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  HomeIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface POSLayoutProps {
  children: ReactNode;
}

export default function POSLayout({ children }: POSLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Trang chủ POS',
      href: '/pos',
      icon: <HomeIcon className="h-6 w-6" />
    },
    {
      name: 'Bán hàng',
      href: '/pos/sales',
      icon: <ShoppingCartIcon className="h-6 w-6" />
    },
    {
      name: 'Quản lý ca',
      href: '/pos/shifts',
      icon: <CalendarIcon className="h-6 w-6" />
    },
    {
      name: 'Bảo hành',
      href: '/pos/warranty',
      icon: <ShieldCheckIcon className="h-6 w-6" />
    },
    {
      name: 'Tài khoản',
      href: '/pos/account',
      icon: <UserIcon className="h-6 w-6" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation */}
      <div className="w-20 bg-blue-700 text-white flex flex-col justify-between">
        <div className="pt-5">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-bold text-xl">Z</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col items-center space-y-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`p-2 rounded-lg ${isActive ? 'bg-blue-800' : 'hover:bg-blue-600'} transition-colors`}
                >
                  <div className="flex flex-col items-center">
                    <div>{item.icon}</div>
                    <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Bottom actions */}
        <div className="pb-5 flex flex-col items-center">
          <Link 
            href="/admin/dashboard"
            className="p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <div className="flex flex-col items-center">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Admin</span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-lg font-semibold">Hệ thống bán hàng POS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <span>Nhân viên: Nguyễn Văn A</span>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-blue-700" />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
