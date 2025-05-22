import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, UsersIcon, BuildingStorefrontIcon, CubeIcon, 
  ArchiveBoxIcon, UserGroupIcon, UserIcon, DocumentTextIcon,
  BanknotesIcon, ShieldCheckIcon, ChartBarIcon, Cog6ToothIcon,
  ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, ComputerDesktopIcon,
  ArrowsRightLeftIcon, CreditCardIcon, CalendarIcon, ReceiptPercentIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  collapsed: boolean;
  active: boolean;
}

interface NavGroupProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
  defaultOpen?: boolean;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NavItem = ({ href, icon, title, collapsed, active }: NavItemProps) => (
  <Link 
    href={href}
    className={`flex items-center px-3 py-2 rounded-md mb-1 transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <span className="w-6 h-6">{icon}</span>
    {!collapsed && <span className="ml-3 text-sm font-medium">{title}</span>}
  </Link>
);

const NavGroup = ({ icon, title, children, collapsed, defaultOpen = false }: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  if (collapsed) {
    return (
      <div className="relative group mb-1">
        <button 
          className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-6 h-6">{icon}</span>
        </button>
        <div className="absolute left-full top-0 z-10 w-48 ml-1 bg-white shadow-lg rounded-md py-2 px-1 hidden group-hover:block">
          <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">{title}</div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <button 
        className="flex items-center justify-between w-full px-3 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="w-6 h-6">{icon}</span>
          <span className="ml-3 text-sm font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDownIcon className="w-4 h-4" />
        ) : (
          <ChevronRightIcon className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="mt-1 ml-6">{children}</div>}
    </div>
  );
};

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  
  return (
    <aside 
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-20 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        {collapsed ? (
          <span className="text-2xl font-bold text-blue-600">Z</span>
        ) : (
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">ZBase</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="overflow-y-auto h-[calc(100vh-4rem)] p-4">
        <nav>
          {/* Dashboard */}
          <NavItem 
            href="/admin/dashboard" 
            icon={<HomeIcon />} 
            title="Tổng quan"
            collapsed={collapsed} 
            active={pathname === '/admin/dashboard'} 
          />

          {/* Warehouse Management */}
          <NavGroup 
            icon={<BuildingStorefrontIcon />} 
            title="Quản lý kho hàng" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/warehouses')}
          >
            <NavItem 
              href="/admin/warehouses" 
              icon={<BuildingStorefrontIcon className="w-5 h-5" />} 
              title="Danh sách kho" 
              collapsed={collapsed}
              active={pathname === '/admin/warehouses'} 
            />
            <NavItem 
              href="/admin/warehouse-locations" 
              icon={<ArchiveBoxIcon className="w-5 h-5" />} 
              title="Vị trí lưu trữ" 
              collapsed={collapsed}
              active={pathname === '/admin/warehouse-locations'} 
            />
          </NavGroup>

          {/* Product Management */}
          <NavGroup 
            icon={<CubeIcon />} 
            title="Quản lý sản phẩm" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/products')}
          >
            <NavItem 
              href="/admin/products" 
              icon={<CubeIcon className="w-5 h-5" />} 
              title="Danh sách sản phẩm" 
              collapsed={collapsed}
              active={pathname === '/admin/products'} 
            />
            <NavItem 
              href="/admin/product-categories" 
              icon={<ArchiveBoxIcon className="w-5 h-5" />} 
              title="Danh mục sản phẩm" 
              collapsed={collapsed}
              active={pathname === '/admin/product-categories'} 
            />
            <NavItem 
              href="/admin/product-attributes" 
              icon={<Cog6ToothIcon className="w-5 h-5" />} 
              title="Thuộc tính sản phẩm" 
              collapsed={collapsed}
              active={pathname === '/admin/product-attributes'} 
            />
          </NavGroup>

          {/* Inventory Management */}
          <NavGroup 
            icon={<ArchiveBoxIcon />} 
            title="Quản lý tồn kho" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/inventory')}
          >
            <NavItem 
              href="/admin/inventory" 
              icon={<ArchiveBoxIcon className="w-5 h-5" />} 
              title="Xem tồn kho" 
              collapsed={collapsed}
              active={pathname === '/admin/inventory'} 
            />
            <NavItem 
              href="/admin/inventory/transactions" 
              icon={<DocumentTextIcon className="w-5 h-5" />} 
              title="Xuất/nhập kho" 
              collapsed={collapsed}
              active={pathname === '/admin/inventory/transactions'} 
            />
            <NavItem 
              href="/admin/inventory/history" 
              icon={<ChartBarIcon className="w-5 h-5" />} 
              title="Lịch sử tồn kho" 
              collapsed={collapsed}
              active={pathname === '/admin/inventory/history'} 
            />
          </NavGroup>

          {/* Customer Management */}
          <NavGroup 
            icon={<UserGroupIcon />} 
            title="Quản lý khách hàng" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/customers')}
          >
            <NavItem 
              href="/admin/customers" 
              icon={<UserGroupIcon className="w-5 h-5" />} 
              title="Danh sách khách hàng" 
              collapsed={collapsed}
              active={pathname === '/admin/customers'} 
            />
            <NavItem 
              href="/admin/customer-groups" 
              icon={<UsersIcon className="w-5 h-5" />} 
              title="Nhóm khách hàng" 
              collapsed={collapsed}
              active={pathname === '/admin/customer-groups'} 
            />
          </NavGroup>

          {/* Partners Management */}
          <NavItem 
            href="/admin/partners" 
            icon={<UserIcon />} 
            title="Quản lý đối tác"
            collapsed={collapsed} 
            active={pathname === '/admin/partners'} 
          />

          {/* Invoice Management */}
          <NavGroup 
            icon={<DocumentTextIcon />} 
            title="Quản lý hóa đơn" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/invoices')}
          >
            <NavItem 
              href="/admin/invoices" 
              icon={<DocumentTextIcon className="w-5 h-5" />} 
              title="Danh sách hóa đơn" 
              collapsed={collapsed}
              active={pathname === '/admin/invoices'} 
            />
            <NavItem 
              href="/admin/invoices/create" 
              icon={<DocumentTextIcon className="w-5 h-5" />} 
              title="Tạo hóa đơn mới" 
              collapsed={collapsed}
              active={pathname === '/admin/invoices/create'} 
            />
          </NavGroup>          {/* Price & Promotion Management */}
          <NavGroup 
            icon={<ReceiptPercentIcon />} 
            title="Giá và khuyến mãi" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/prices')}
          >
            <NavItem 
              href="/admin/prices/lists" 
              icon={<DocumentTextIcon className="w-5 h-5" />} 
              title="Bảng giá" 
              collapsed={collapsed}
              active={pathname === '/admin/prices/lists' || pathname.includes('/admin/prices/lists/')} 
            />
            <NavItem 
              href="/admin/prices/promotions" 
              icon={<ReceiptPercentIcon className="w-5 h-5" />} 
              title="Khuyến mãi" 
              collapsed={collapsed}
              active={pathname === '/admin/prices/promotions' || pathname.includes('/admin/prices/promotions/')} 
            />
          </NavGroup>

          {/* Transaction Management */}
          <NavGroup 
            icon={<BanknotesIcon />} 
            title="Quản lý thu chi" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/transactions')}
          >
            <NavItem 
              href="/admin/transactions" 
              icon={<BanknotesIcon className="w-5 h-5" />} 
              title="Danh sách phiếu thu chi" 
              collapsed={collapsed}
              active={pathname === '/admin/transactions'} 
            />
            <NavItem 
              href="/admin/transactions/new" 
              icon={<ArrowsRightLeftIcon className="w-5 h-5" />} 
              title="Tạo phiếu mới" 
              collapsed={collapsed}
              active={pathname === '/admin/transactions/new'} 
            />
          </NavGroup>

          {/* Warranty Management */}
          <NavGroup 
            icon={<ShieldCheckIcon />} 
            title="Quản lý bảo hành" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/warranties')}
          >
            <NavItem 
              href="/admin/warranties" 
              icon={<ShieldCheckIcon className="w-5 h-5" />} 
              title="Danh sách yêu cầu" 
              collapsed={collapsed}
              active={pathname === '/admin/warranties'} 
            />
            <NavItem 
              href="/admin/warranties/new" 
              icon={<ClipboardDocumentCheckIcon className="w-5 h-5" />} 
              title="Tạo yêu cầu bảo hành" 
              collapsed={collapsed}
              active={pathname === '/admin/warranties/new'} 
            />
          </NavGroup>

          {/* Reports */}
          <NavGroup 
            icon={<ChartBarIcon />} 
            title="Báo cáo" 
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/reports')}
          >
            <NavItem 
              href="/admin/reports/sales" 
              icon={<ChartBarIcon className="w-5 h-5" />} 
              title="Báo cáo doanh thu" 
              collapsed={collapsed}
              active={pathname === '/admin/reports/sales'} 
            />
            <NavItem 
              href="/admin/reports/inventory" 
              icon={<ChartBarIcon className="w-5 h-5" />} 
              title="Báo cáo tồn kho" 
              collapsed={collapsed}
              active={pathname === '/admin/reports/inventory'} 
            />
            <NavItem 
              href="/admin/reports/debt" 
              icon={<ChartBarIcon className="w-5 h-5" />} 
              title="Báo cáo công nợ" 
              collapsed={collapsed}
              active={pathname === '/admin/reports/debt'} 
            />
            <NavItem 
              href="/admin/report-templates" 
              icon={<DocumentTextIcon className="w-5 h-5" />} 
              title="Mẫu báo cáo" 
              collapsed={collapsed}
              active={pathname === '/admin/report-templates'} 
            />
          </NavGroup>          {/* User Management */}
          <NavGroup
            icon={<UsersIcon />}
            title="Quản lý nhân viên"
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/employees')}
          >
            <NavItem 
              href="/admin/employees" 
              icon={<UsersIcon className="w-5 h-5" />} 
              title="Danh sách nhân viên"
              collapsed={collapsed} 
              active={pathname === '/admin/employees' || pathname.includes('/admin/employees/')} 
            />
            <NavItem 
              href="/admin/users" 
              icon={<UserIcon className="w-5 h-5" />} 
              title="Tài khoản người dùng"
              collapsed={collapsed} 
              active={pathname === '/admin/users' || pathname.includes('/admin/users/')} 
            />
          </NavGroup>

          {/* POS Interface Management */}
          <NavGroup
            icon={<ComputerDesktopIcon />}
            title="Giao diện POS"
            collapsed={collapsed}
            defaultOpen={pathname.includes('/admin/pos')}
          >
            <NavItem 
              href="/admin/pos/shifts" 
              icon={<CalendarIcon className="w-5 h-5" />} 
              title="Quản lý ca làm việc"
              collapsed={collapsed} 
              active={pathname === '/admin/pos/shifts' || pathname.includes('/admin/pos/shifts/')} 
            />
            <NavItem 
              href="/admin/pos/sales" 
              icon={<BanknotesIcon className="w-5 h-5" />} 
              title="Màn hình bán hàng"
              collapsed={collapsed} 
              active={pathname === '/admin/pos/sales' || pathname.includes('/admin/pos/sales/')} 
            />
            <NavItem 
              href="/admin/pos/warranty" 
              icon={<ShieldCheckIcon className="w-5 h-5" />} 
              title="Màn hình bảo hành"
              collapsed={collapsed} 
              active={pathname === '/admin/pos/warranty'} 
            />
            <NavItem 
              href="/admin/pos/components" 
              icon={<ClipboardDocumentListIcon className="w-5 h-5" />} 
              title="Components cho POS"
              collapsed={collapsed} 
              active={pathname === '/admin/pos/components'} 
            />
          </NavGroup>

          {/* Settings */}
          <NavItem 
            href="/admin/settings" 
            icon={<Cog6ToothIcon />} 
            title="Cài đặt"
            collapsed={collapsed} 
            active={pathname === '/admin/settings'} 
          />
        </nav>
      </div>

      {/* Collapse Button */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button 
          onClick={onToggle}
          className="flex items-center justify-center w-full p-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
