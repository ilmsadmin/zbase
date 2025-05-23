import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SubNavItemProps {
  href: string;
  title: string;
  active?: boolean;
}

const SubNavItem = ({ href, title, active }: SubNavItemProps) => {
  return (
    <Link 
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-md ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {title}
    </Link>
  );
};

interface SubNavigationProps {
  module: string;
  currentPath: string;
}

const moduleConfig: Record<string, { title: string, items: { href: string, title: string }[] }> = {
  'dashboard': {
    title: 'Tổng quan',
    items: []
  },
  'warehouse': {
    title: 'Quản lý Kho',
    items: [
      { href: '/admin/warehouses/list', title: 'Danh sách kho' },
      { href: '/admin/warehouses/inventory', title: 'Quản lý tồn kho' },
      { href: '/admin/warehouses/transfer', title: 'Xuất/Nhập kho' }
    ]
  },
  'products': {
    title: 'Sản phẩm',
    items: [
      { href: '/admin/products/list', title: 'Danh sách sản phẩm' },
      { href: '/admin/products/categories', title: 'Danh mục sản phẩm' },
      { href: '/admin/products/attributes', title: 'Thuộc tính sản phẩm' }
    ]
  },
  'customers': {
    title: 'Khách hàng',
    items: [
      { href: '/admin/customers/list', title: 'Danh sách khách hàng' },
      { href: '/admin/customers/groups', title: 'Nhóm khách hàng' }
    ]
  },
  'sales': {
    title: 'Bán hàng',
    items: [
      { href: '/admin/sales/invoices', title: 'Danh sách hóa đơn' },
      { href: '/admin/sales/create', title: 'Tạo hóa đơn mới' },
      { href: '/admin/pos', title: 'POS' }
    ]
  },
  'finance': {
    title: 'Tài chính',
    items: [
      { href: '/admin/finance/transactions', title: 'Quản lý thu chi' },
      { href: '/admin/finance/debt', title: 'Công nợ' }
    ]
  },
  'reports': {
    title: 'Báo cáo',
    items: [
      { href: '/admin/reports/revenue', title: 'Doanh thu' },
      { href: '/admin/reports/inventory', title: 'Tồn kho' },
      { href: '/admin/reports/debt', title: 'Công nợ' },
      { href: '/admin/reports/analytics', title: 'Phân tích nâng cao' }
    ]
  },
  'settings': {
    title: 'Hệ thống',
    items: [
      { href: '/admin/settings/staff', title: 'Nhân viên' },
      { href: '/admin/settings/roles', title: 'Phân quyền' },
      { href: '/admin/settings/config', title: 'Cấu hình' }    ]
  }
};

export default function SubNavigation({ module, currentPath }: SubNavigationProps) {
  const config = moduleConfig[module] || { title: 'Unknown', items: [] };
  // Check if we're on the root admin page or admin dashboard page
  const isRootOrDashboard = currentPath === '/admin' || 
                            currentPath === '/admin/dashboard';

  // Only show sub-navigation items if there are any
  const showSubNav = config.items && config.items.length > 0;
  return (
    <div className="mx-auto px-4">
      {/* Only show sub navigation items if there are any */}
      {showSubNav && (
        <div className="flex space-x-4 py-1">
          {config.items.map((item) => (
            <SubNavItem 
              key={item.href}
              href={item.href}
              title={item.title}
              active={currentPath === item.href}
            />
          ))}
        </div>
      )}
    </div>
  );
}
