'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productMenuItems: SubMenuItem[] = [
    { label: 'Products', href: '/admin/products' },
    { label: 'Categories', href: '/admin/products/categories' },
    { label: 'Attributes', href: '/admin/products/attributes' },
    { label: 'Price Lists', href: '/admin/products/price-lists' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>
      <ModuleSubMenu items={productMenuItems} />
      <div>{children}</div>
    </div>
  );
}
