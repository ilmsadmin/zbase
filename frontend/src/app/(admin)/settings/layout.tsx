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
}) {
  return (
    <PageContainer>
      <Section>
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        
        <div className="flex space-x-4 border-b border-border mb-6">
          <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
            <Link
              href="/admin/settings/users"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              User Management
            </Link>
          </PermissionGuard>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
            <Link
              href="/admin/settings/roles"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              Role Management
            </Link>
          </PermissionGuard>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
            <Link
              href="/admin/settings/company"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              Company Settings
            </Link>
          </PermissionGuard>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
            <Link
              href="/admin/settings/system"
              className="px-4 py-2 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors"
            >
              System Configuration
            </Link>
          </PermissionGuard>
        </div>
        
        {children}
      </Section>
    </PageContainer>
  );
}
