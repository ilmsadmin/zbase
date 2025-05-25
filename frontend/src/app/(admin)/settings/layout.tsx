'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { PageContainer, Section } from '@/components/ui';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {  return (
    <PageContainer maxWidth="full">
      <Section><h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>
        
        <div className="flex space-x-4 border-b border-border mb-6">
          <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
            <Link
              href="/settings/users"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              Quản lý người dùng
            </Link>
          </PermissionGuard>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
            <Link
              href="/settings/roles"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              Quản lý vai trò
            </Link>
          </PermissionGuard>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
            <Link
              href="/settings/company"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              Cài đặt công ty
            </Link>
          </PermissionGuard>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
            <Link
              href="/settings/system"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              Cấu hình hệ thống
            </Link>
          </PermissionGuard>
        </div>
        
        {children}
      </Section>
    </PageContainer>
  );
}
