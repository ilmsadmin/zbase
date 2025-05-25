'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const inventoryMenuItems: SubMenuItem[] = [
    { label: 'Tổng quan', href: '/admin/inventory' },
    { label: 'Mức tồn kho', href: '/admin/inventory/stock' },
    { label: 'Chuyển kho', href: '/admin/inventory/transfers' },
    { label: 'Điều chỉnh kho', href: '/admin/inventory/adjustments' },
    { label: 'Lịch sử kho', href: '/admin/inventory/history' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý kho hàng</h1>
      <ModuleSubMenu items={inventoryMenuItems} />
      <div>{children}</div>
    </div>
  );
}
