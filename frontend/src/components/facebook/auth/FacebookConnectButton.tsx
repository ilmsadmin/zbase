'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Facebook, Loader2 } from 'lucide-react';
import { facebookAuthService } from '@/services/facebook';

interface FacebookConnectButtonProps {
  onConnect: (success: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const FacebookConnectButton: React.FC<FacebookConnectButtonProps> = ({
  onConnect,
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get authorization URL from backend
      const response = await facebookAuthService.getAuthorizationUrl();
        if (response.success && response.data?.authUrl) {
        console.log('🚀 Opening Facebook popup with URL:', response.data.authUrl);
        
        // Open popup for Facebook OAuth instead of redirecting
        const popup = window.open(
          response.data.authUrl,
          'facebook-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }

        console.log('✅ Popup opened successfully');// Listen for postMessage from callback window
        const handleMessage = (event: MessageEvent) => {
          console.log('📨 Received postMessage:', {
            origin: event.origin,
            type: event.data?.type,
            data: event.data
          });

          // Verify origin for security - accept from backend server
          const backendOrigin = 'http://localhost:3001';
          if (event.origin !== backendOrigin) {
            console.log('❌ Rejected message from origin:', event.origin, 'Expected:', backendOrigin);
            return;
          }

          console.log('✅ Message origin verified, processing...');

          if (event.data?.type === 'FACEBOOK_AUTH_SUCCESS') {
            console.log('🎉 Facebook auth success!');
            setIsLoading(false);
            onConnect(true);
            window.removeEventListener('message', handleMessage);
            popup.close();
          } else if (event.data?.type === 'FACEBOOK_AUTH_ERROR') {
            console.log('❌ Facebook auth error:', event.data.error);
            setError(event.data.error || 'Facebook connection failed');
            setIsLoading(false);
            onConnect(false);
            window.removeEventListener('message', handleMessage);
            popup.close();
          }
        };

        window.addEventListener('message', handleMessage);        // Handle popup being closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            console.log('🚪 Popup was closed manually');
            clearInterval(checkClosed);
            setError('Facebook connection was cancelled');
            setIsLoading(false);
            onConnect(false);
            window.removeEventListener('message', handleMessage);
          }
        }, 1000);

      } else {
        throw new Error(response.message || 'Failed to get authorization URL');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Facebook');
      setIsLoading(false);
      onConnect(false);
    }
  };
  // No need for useEffect callback handling since we use popup + postMessage

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={disabled || isLoading}
        className={`
          bg-blue-600 hover:bg-blue-700 text-white
          ${sizeClasses[size]}
          ${className}
          flex items-center justify-center gap-2
        `}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Facebook className="h-4 w-4" />
        )}
        {isLoading ? 'Connecting...' : 'Connect with Facebook'}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};
