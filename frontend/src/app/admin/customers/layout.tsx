'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customersMenuItems: SubMenuItem[] = [
    { label: 'All Customers', href: '/admin/customers' },
    { label: 'Groups', href: '/admin/customers/groups' },
    { label: 'Loyalty', href: '/admin/customers/loyalty' },
    { label: 'Communication', href: '/admin/customers/communication' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      <ModuleSubMenu items={customersMenuItems} />
      <div>{children}</div>
    </div>
  );
}
