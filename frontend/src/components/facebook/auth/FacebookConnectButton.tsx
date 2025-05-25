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
        // Redirect to Facebook OAuth
        window.location.href = response.data.authUrl;
      } else {
        throw new Error(response.message || 'Failed to get authorization URL');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Facebook');
      setIsLoading(false);
      onConnect(false);
    }
  };

  // Handle OAuth callback (this would typically be handled by a separate callback page)
  React.useEffect(() => {
    // Check if we're returning from Facebook OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (code && !error) {
      // Handle successful OAuth callback
      handleOAuthCallback(code, state);
    } else if (error) {
      setError('Facebook connection was cancelled or failed');
      onConnect(false);
    }
  }, []);

  const handleOAuthCallback = async (code: string, state: string | null) => {
    try {
      const response = await facebookAuthService.handleCallback({
        code,
        state: state || undefined
      });

      if (response) {
        onConnect(true);
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        throw new Error('Failed to complete Facebook connection');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete Facebook connection');
      onConnect(false);
    } finally {
      setIsLoading(false);
    }
  };

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
