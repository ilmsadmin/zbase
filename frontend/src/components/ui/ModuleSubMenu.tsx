'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SubMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface ModuleSubMenuProps {
  items: SubMenuItem[];
  title?: string;
}

export function ModuleSubMenu({ items, title }: ModuleSubMenuProps) {
  const pathname = usePathname();
  
  return (
    <div className="mb-6 border-b pb-4">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      <div className="flex overflow-x-auto gap-1 pb-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 rounded-md whitespace-nowrap text-sm",
                isActive 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
