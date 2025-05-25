'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function WarehousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const warehousesMenuItems: SubMenuItem[] = [
    { label: 'Tất cả kho hàng', href: '/admin/warehouses' },
    { label: 'Vị trí', href: '/admin/warehouses/locations' },
    { label: 'Chuyển kho', href: '/admin/warehouses/transfers' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý kho hàng</h1>
      <ModuleSubMenu items={warehousesMenuItems} />
      <div>{children}</div>
    </div>
  );
}
