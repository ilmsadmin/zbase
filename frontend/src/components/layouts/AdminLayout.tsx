import React from 'react';
import { usePathname } from 'next/navigation';
import AdminFooter from './admin/AdminFooter';
import AdminNavigationMenu from './admin/AdminNavigationMenu';
import SubNavigation from './admin/SubNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname() || '';
    // Determine current module from path
  const getModule = (path: string) => {
    // For root admin path or admin/dashboard, return dashboard
    if (path === '/admin' || path === '/admin/dashboard') return 'dashboard';
    
    if (path.includes('/admin/warehouses')) return 'warehouse';
    if (path.includes('/admin/products')) return 'products';
    if (path.includes('/admin/customers')) return 'customers';
    if (path.includes('/admin/sales')) return 'sales';
    if (path.includes('/admin/finance')) return 'finance';
    if (path.includes('/admin/reports')) return 'reports';
    if (path.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };
  
  const currentModule = getModule(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Menu */}
      <AdminNavigationMenu />
      
      {/* Sub Navigation */}
      <SubNavigation module={currentModule} currentPath={pathname} />      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gray-50 mt-0">
          
          {/* Page Content */}
          <div className="mt-2">
            {children}
          </div>        </main>

        {/* Footer */}
        <AdminFooter />
    </div>
  );
}
