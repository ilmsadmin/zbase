'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const customersMenuItems: SubMenuItem[] = [
    { label: 'Tất cả khách hàng', href: '/admin/customers' },
    { label: 'Nhóm', href: '/admin/customers/groups' },
    { label: 'Tích điểm', href: '/admin/customers/loyalty' },
    { label: 'Liên lạc', href: '/admin/customers/communication' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý khách hàng</h1>
      <ModuleSubMenu items={customersMenuItems} />
      <div>{children}</div>
    </div>
  );
}
