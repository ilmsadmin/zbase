'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inventoryMenuItems: SubMenuItem[] = [
    { label: 'Overview', href: '/admin/inventory' },
    { label: 'Stock Levels', href: '/admin/inventory/stock' },
    { label: 'Transfers', href: '/admin/inventory/transfers' },
    { label: 'Adjustments', href: '/admin/inventory/adjustments' },
    { label: 'History', href: '/admin/inventory/history' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      <ModuleSubMenu items={inventoryMenuItems} />
      <div>{children}</div>
    </div>
  );
}
