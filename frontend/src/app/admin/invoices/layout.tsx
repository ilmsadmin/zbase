'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const invoicesMenuItems: SubMenuItem[] = [
    { label: 'All Invoices', href: '/admin/invoices' },
    { label: 'Drafts', href: '/admin/invoices/drafts' },
    { label: 'Templates', href: '/admin/invoices/templates' },
    { label: 'Settings', href: '/admin/invoices/settings' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
      <ModuleSubMenu items={invoicesMenuItems} />
      <div>{children}</div>
    </div>
  );
}
