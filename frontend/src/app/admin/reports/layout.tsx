'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reportsMenuItems: SubMenuItem[] = [
    { label: 'Dashboard', href: '/admin/reports' },
    { label: 'Sales', href: '/admin/reports/sales' },
    { label: 'Inventory', href: '/admin/reports/inventory' },
    { label: 'Customers', href: '/admin/reports/customers' },
    { label: 'Financial', href: '/admin/reports/financial' },
    { label: 'Custom', href: '/admin/reports/custom' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <ModuleSubMenu items={reportsMenuItems} />
      <div>{children}</div>
    </div>
  );
}
