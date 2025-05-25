'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';

interface AppConfigTest {
  name: string;
  status: 'loading' | 'success' | 'error' | 'pending';
  message?: string;
  details?: string;
}

export function FacebookAppTest() {
  // Configuration variables
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  const [tests, setTests] = useState<AppConfigTest[]>([
    { name: 'Facebook App ID', status: 'pending' },
    { name: 'API Connection', status: 'pending' },
    { name: 'Facebook Connection', status: 'pending' },
    { name: 'Callback URL Test', status: 'pending' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [showAppSecret, setShowAppSecret] = useState(false);
  // Kiểm tra đăng nhập khi component được tải
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token') || 
                 localStorage.getItem('token') ||
                 sessionStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);
  const runTests = async () => {
    setIsRunning(true);
    
    // Check if user is logged in
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập trước khi chạy kiểm tra!');
      setIsRunning(false);
      return;
    }
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'loading' })));

    try {
      // Test 1: Facebook App ID
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!appId) {
        setTests(prev => prev.map(test => 
          test.name === 'Facebook App ID' 
            ? { ...test, status: 'error', message: 'App ID not configured', details: 'Add NEXT_PUBLIC_FACEBOOK_APP_ID to .env.local' }
            : test
        ));
      } else {
        setTests(prev => prev.map(test => 
          test.name === 'Facebook App ID' 
            ? { ...test, status: 'success', message: `App ID: ${appId}` }
            : test
        ));
      }

      // Test 2: API Connection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const response = await fetch(`${apiBaseUrl}/health`);
        if (response.ok) {
          setTests(prev => prev.map(test => 
            test.name === 'API Connection' 
              ? { ...test, status: 'success', message: 'Backend API is reachable' }
              : test
          ));
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        setTests(prev => prev.map(test => 
          test.name === 'API Connection' 
            ? { ...test, status: 'error', message: 'Cannot reach backend API', details: 'Make sure backend server is running on port 3001' }
            : test
        ));
      }      // Test 3: Facebook Connection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('auth_token') || 
                      localStorage.getItem('token') ||
                      sessionStorage.getItem('auth_token');
                      
        console.log('Using token for Facebook status check:', token ? token.substring(0, 10) + '...' : 'No token found');
        
        const response = await fetch(`${apiBaseUrl}/facebook/auth/status`, {
          headers: {
            'Authorization': `Bearer ${token || ''}`,
            'Content-Type': 'application/json',
          },
        });        if (response.ok) {
          const data = await response.json();
          console.log('Facebook auth status response:', data);
          if (data.success && data.data) {
            setTests(prev => prev.map(test => 
              test.name === 'Facebook Connection' 
                ? { 
                    ...test, 
                    status: 'success', 
                    message: data.data.isConnected ? 'Facebook account connected' : 'No Facebook connection',
                    details: data.data.isConnected ? `Connected as: ${data.data.user?.name || 'Unknown'}` : 'Connect your Facebook account first'
                  }
                : test
            ));
          } else {
            throw new Error('Invalid response format');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }      } catch (error: any) {
        setTests(prev => prev.map(test => 
          test.name === 'Facebook Connection' 
            ? { ...test, status: 'error', message: 'Facebook connection check failed', details: `Error: ${error?.message || 'Unknown error'}` }
            : test
        ));
      }

      // Test 4: Callback URL Test
      await new Promise(resolve => setTimeout(resolve, 500));
        const callbackUrl = `${apiBaseUrl}/facebook/oauth/callback`;
      setTests(prev => prev.map(test => 
        test.name === 'Callback URL Test' 
          ? { ...test, status: 'success', message: `Callback URL: ${callbackUrl}`, details: 'Add this to Facebook App OAuth settings' }
          : test
      ));

    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: AppConfigTest['status']) => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AppConfigTest['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'destructive';
      case 'loading':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">App Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">App ID:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {appId || 'Not configured'}
                </code>
                {appId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(appId)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API URL:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {apiBaseUrl}
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('https://developers.facebook.com/apps/', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Facebook Developers
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => copyToClipboard(`${apiBaseUrl}/facebook/oauth/callback`)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Callback URL
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Configuration Tests</h3>
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {tests.map((test, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                  <Badge variant={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              </div>
              
              {test.message && (
                <div className="mt-2 text-sm text-gray-600">
                  {test.message}
                </div>
              )}
              
              {test.details && (
                <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {test.details}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <div>
          <h4 className="font-semibold">Setup Requirements</h4>
          <div className="mt-2 text-sm space-y-1">
            <p>1. Create Facebook App at <a href="https://developers.facebook.com/" target="_blank" className="text-blue-600 underline">developers.facebook.com</a></p>
            <p>2. Add OAuth Redirect URI: <code className="bg-gray-100 px-1 rounded">{apiBaseUrl}/facebook/oauth/callback</code></p>
            <p>3. Configure environment variables in backend and frontend</p>
            <p>4. Run the configuration tests above to verify setup</p>
          </div>
        </div>
      </Alert>

      {/* Documentation Link */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Check out our detailed setup guide for step-by-step instructions.
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Setup Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
