'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageSquare, Construction } from 'lucide-react';

export default function FacebookMessagesPage() {
  return (
    <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              Facebook Messages
            </h1>
            <p className="text-gray-600 mt-2">
              Manage Facebook messages and customer conversations
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Facebook Messages management is currently under development.
              <br />
              This feature will be available in Phase 4 of the implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
