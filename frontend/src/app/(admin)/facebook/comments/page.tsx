'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, Construction } from 'lucide-react';

export default function FacebookCommentsPage() {
  return (
    <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="h-8 w-8 text-orange-600" />
              Facebook Comments
            </h1>
            <p className="text-gray-600 mt-2">
              Manage comments on your Facebook posts and pages
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Facebook Comments management is currently under development.
              <br />
              This feature will be available in Phase 5 of the implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
