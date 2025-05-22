import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Skip the first segment which is 'admin'
  const segments = pathSegments.length > 0 ? pathSegments.slice(1) : [];

  // Generate breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [];

  // Add Home
  breadcrumbs.push({
    href: '/admin/dashboard',
    label: 'Trang chủ'
  });

  // Add intermediate levels
  let path = '/admin';
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert segment to human-readable label
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Map specific segments to Vietnamese labels
    switch (segment) {
      case 'dashboard':
        label = 'Tổng quan';
        break;
      case 'products':
        label = 'Sản phẩm';
        break;
      case 'product-categories':
        label = 'Danh mục sản phẩm';
        break;
      case 'product-attributes':
        label = 'Thuộc tính sản phẩm';
        break;
      case 'warehouses':
        label = 'Kho hàng';
        break;
      case 'warehouse-locations':
        label = 'Vị trí lưu trữ';
        break;
      case 'inventory':
        label = 'Tồn kho';
        break;
      case 'transactions':
        if (path.includes('/inventory')) {
          label = 'Xuất nhập kho';
        } else {
          label = 'Thu chi';
        }
        break;
      case 'history':
        label = 'Lịch sử';
        break;
      case 'customers':
        label = 'Khách hàng';
        break;
      case 'customer-groups':
        label = 'Nhóm khách hàng';
        break;
      case 'partners':
        label = 'Đối tác';
        break;
      case 'invoices':
        label = 'Hóa đơn';
        break;
      case 'create':
        label = 'Tạo mới';
        break;
      case 'edit':
        label = 'Chỉnh sửa';
        break;
      case 'warranties':
        label = 'Bảo hành';
        break;
      case 'reports':
        label = 'Báo cáo';
        break;
      case 'sales':
        label = 'Doanh thu';
        break;
      case 'debt':
        label = 'Công nợ';
        break;
      case 'report-templates':
        label = 'Mẫu báo cáo';
        break;
      case 'users':
        label = 'Nhân viên';
        break;
      case 'settings':
        label = 'Cài đặt';
        break;
      default:
        // If it's a numeric id, we can try to get context from the previous segment
        if (/^\d+$/.test(segment)) {
          if (segments[index - 1] === 'products') label = 'Chi tiết sản phẩm';
          else if (segments[index - 1] === 'customers') label = 'Chi tiết khách hàng';
          else if (segments[index - 1] === 'invoices') label = 'Chi tiết hóa đơn';
          else if (segments[index - 1] === 'warehouses') label = 'Chi tiết kho hàng';
          else label = 'Chi tiết';
        }
        break;
    }
    
    breadcrumbs.push({
      href: path,
      label,
      current: isLast
    });
  });

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index === 0 ? (
              <Link
                href={breadcrumb.href}
                className="text-gray-500 hover:text-blue-600 flex items-center"
              >
                <HomeIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{breadcrumb.label}</span>
              </Link>
            ) : (
              <>
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400 mx-1" aria-hidden="true" />
                {breadcrumb.current ? (
                  <span className="text-sm font-medium text-blue-600 truncate" aria-current="page">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 truncate"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
