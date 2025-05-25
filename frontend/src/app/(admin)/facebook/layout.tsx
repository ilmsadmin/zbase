'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Facebook } from 'lucide-react';
import { facebookAuthService } from '@/services/facebook';

export default function FacebookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupPage, setIsSetupPage] = useState(false);

  useEffect(() => {
    // Check if current page is setup page
    const isSetupUrl = window.location.pathname.endsWith('/facebook/setup');
    setIsSetupPage(isSetupUrl);

    // Only check connection if not on setup page to avoid duplicate checks
    if (!isSetupUrl) {
      checkConnectionStatus();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await facebookAuthService.getConnectionStatus();
      setIsConnected(status && status.isConnected);
    } catch (error) {
      console.error('Failed to check Facebook connection status:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show warning on setup page
  const showConnectionWarning = !isLoading && !isConnected && !isSetupPage;

  return (
    <div className="space-y-6">
      {showConnectionWarning && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Facebook Not Connected</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Your Facebook account is not connected. Some features may be limited.</span>
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
      {children}
    </div>
  );
}
