'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const invoicesMenuItems: SubMenuItem[] = [
    { label: 'Tất cả hóa đơn', href: '/admin/invoices' },
    { label: 'Bản nháp', href: '/admin/invoices/drafts' },
    { label: 'Mẫu hóa đơn', href: '/admin/invoices/templates' },
    { label: 'Cài đặt', href: '/admin/invoices/settings' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý hóa đơn</h1>
      <ModuleSubMenu items={invoicesMenuItems} />
      <div>{children}</div>
    </div>
  );
}
