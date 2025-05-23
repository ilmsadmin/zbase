'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function DebugAuth() {
  const { isAuthenticated, user, token, isLoading } = useAuth();
  
  useEffect(() => {
    console.log('Auth Debug State:', {
      isAuthenticated,
      user,
      token,
      isLoading,
      localStorage: {
        auth_token: localStorage.getItem('auth_token'),
        user: localStorage.getItem('user'),
        refresh_token: localStorage.getItem('refresh_token')
      },
      sessionStorage: {
        auth_token: sessionStorage.getItem('auth_token'),
        user: sessionStorage.getItem('user'),
        refresh_token: sessionStorage.getItem('refresh_token')
      }
    });
  }, [isAuthenticated, user, token, isLoading]);
  
  return (
    <div className="p-4 bg-black/5 mt-4 rounded-lg text-sm">
      <h2 className="font-bold mb-2">Auth Debug</h2>
      <div className="overflow-auto max-h-32 text-xs">
        <pre>{JSON.stringify({
          isAuthenticated,
          user,
          token: token ? '✅ Present' : '❌ Missing',
          isLoading,
        }, null, 2)}</pre>
      </div>
    </div>
  );
}
