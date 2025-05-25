'use client';

import React from 'react';
import { ModuleSubMenu, SubMenuItem } from '@/components/ui/ModuleSubMenu';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {  const productMenuItems: SubMenuItem[] = [
    { label: 'Sản phẩm', href: '/admin/products' },
    { label: 'Danh mục', href: '/admin/products/categories' },
    { label: 'Thuộc tính', href: '/admin/products/attributes' },
    { label: 'Bảng giá', href: '/admin/products/price-lists' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>
      <ModuleSubMenu items={productMenuItems} />
      <div>{children}</div>
    </div>
  );
}
