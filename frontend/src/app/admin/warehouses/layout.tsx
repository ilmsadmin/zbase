'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function WarehousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const warehousesMenuItems: SubMenuItem[] = [
    { label: 'All Warehouses', href: '/admin/warehouses' },
    { label: 'Locations', href: '/admin/warehouses/locations' },
    { label: 'Transfers', href: '/admin/warehouses/transfers' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Warehouse Management</h1>
      <ModuleSubMenu items={warehousesMenuItems} />
      <div>{children}</div>
    </div>
  );
}
