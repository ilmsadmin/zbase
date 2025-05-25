'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { BarChart3, Construction, Facebook, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { facebookAuthService } from '@/services/facebook';

export default function FacebookAnalyticsPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await facebookAuthService.getConnectionStatus();
      setIsConnected(status && status.isConnected ? true : false);
    } catch (error) {
      console.error('Failed to check Facebook connection status:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PermissionGuard 
      permissions={['facebook.users.read']} 
      renderWhen='any'
      debugMode={true}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              Facebook Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              View insights and performance metrics for your Facebook presence
            </p>
          </div>
        </div>

        {!isLoading && !isConnected && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Facebook Not Connected</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Your Facebook account is not connected. You need to connect it to view analytics.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => router.push('/facebook/setup')}
              >
                <Facebook className="h-4 w-4 mr-2" /> 
                Connect Facebook
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="text-center py-12">
            <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Facebook Analytics dashboard is currently under development.
              <br />
              This feature will be available in Phase 6 of the implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
