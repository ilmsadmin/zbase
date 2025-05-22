import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, UsersIcon, BuildingStorefrontIcon, CubeIcon, 
  ArchiveBoxIcon, UserGroupIcon, UserIcon, DocumentTextIcon,
  BanknotesIcon, ShieldCheckIcon, ChartBarIcon, Cog6ToothIcon,
  ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, ComputerDesktopIcon,
  ArrowsRightLeftIcon, CreditCardIcon, CalendarIcon, ReceiptPercentIcon,
  MagnifyingGlassIcon, BellIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface NavItemProps {
  href: string;
  title: string;
  children?: React.ReactNode;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, title, children, active }) => {
  return (
    <div className="relative group">
      <Link 
        href={href}
        className={`px-4 py-2 flex items-center text-sm font-medium ${
          active 
            ? 'text-blue-600' 
            : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        <span>{title}</span>
        {children && <ChevronDownIcon className="ml-1 h-4 w-4" />}
      </Link>
      
      {children && (
        <div className="absolute left-0 z-10 mt-1 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  href: string;
  title: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href, title }) => {
  return (
    <Link 
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    >
      {title}
    </Link>
  );
};

export default function AdminNavigationMenu() {
  const pathname = usePathname();
  
  // Helper function to check if the current path matches or starts with the given path
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto px-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center text-xl font-bold text-blue-600"
            >
              <span>ZBase</span>
            </Link>
          </div>

          {/* Primary Navigation Items */}
          <div className="hidden md:flex space-x-2">
            <NavItem
              href="/admin/dashboard"
              title="Dashboard"
              active={isActive('/admin/dashboard')}
            />
            
            <NavItem
              href="/admin/warehouse"
              title="Quản lý Kho"
              active={isActive('/admin/warehouse')}
            >
              <DropdownItem href="/admin/warehouse/list" title="Danh sách kho" />
              <DropdownItem href="/admin/warehouse/inventory" title="Quản lý tồn kho" />
              <DropdownItem href="/admin/warehouse/transfer" title="Xuất/Nhập kho" />
            </NavItem>

            <NavItem
              href="/admin/products"
              title="Sản phẩm"
              active={isActive('/admin/products')}
            >
              <DropdownItem href="/admin/products/list" title="Danh sách sản phẩm" />
              <DropdownItem href="/admin/products/categories" title="Danh mục sản phẩm" />
              <DropdownItem href="/admin/products/attributes" title="Thuộc tính sản phẩm" />
            </NavItem>

            <NavItem
              href="/admin/customers"
              title="Khách hàng"
              active={isActive('/admin/customers')}
            >
              <DropdownItem href="/admin/customers/list" title="Danh sách khách hàng" />
              <DropdownItem href="/admin/customers/groups" title="Nhóm khách hàng" />
            </NavItem>

            <NavItem
              href="/admin/sales"
              title="Bán hàng"
              active={isActive('/admin/sales')}
            >
              <DropdownItem href="/admin/sales/invoices" title="Danh sách hóa đơn" />
              <DropdownItem href="/admin/sales/create" title="Tạo hóa đơn mới" />
              <DropdownItem href="/admin/pos" title="POS" />
            </NavItem>

            <NavItem
              href="/admin/finance"
              title="Tài chính"
              active={isActive('/admin/finance')}
            >
              <DropdownItem href="/admin/finance/transactions" title="Quản lý thu chi" />
              <DropdownItem href="/admin/finance/debt" title="Công nợ" />
            </NavItem>

            <NavItem
              href="/admin/reports"
              title="Báo cáo"
              active={isActive('/admin/reports')}
            >
              <DropdownItem href="/admin/reports/revenue" title="Doanh thu" />
              <DropdownItem href="/admin/reports/inventory" title="Tồn kho" />
              <DropdownItem href="/admin/reports/debt" title="Công nợ" />
              <DropdownItem href="/admin/reports/analytics" title="Phân tích nâng cao" />
            </NavItem>

            <NavItem
              href="/admin/settings"
              title="Hệ thống"
              active={isActive('/admin/settings')}
            >
              <DropdownItem href="/admin/settings/staff" title="Nhân viên" />
              <DropdownItem href="/admin/settings/roles" title="Phân quyền" />
              <DropdownItem href="/admin/settings/config" title="Cấu hình" />
            </NavItem>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none">
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400" />
              </div>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-sm rounded-full focus:outline-none">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <span>U</span>
                </div>
              </button>
              
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                <div className="py-1">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Thông tin tài khoản
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Thay đổi mật khẩu
                  </Link>
                  <Link href="/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Đăng xuất
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Overview</span>
          </div>
          <div>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
