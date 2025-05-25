'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Facebook, CheckCircle, XCircle, Settings, AlertTriangle, RefreshCw } from 'lucide-react';
import { FacebookSetupWizard } from '@/components/facebook/auth/FacebookSetupWizard';
import { FacebookConnectButton } from '@/components/facebook/auth/FacebookConnectButton';
import { ConnectionStatus } from '@/components/facebook/auth/ConnectionStatus';

export default function FacebookSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [showWizard, setShowWizard] = useState(false);

  return (
    <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Facebook className="h-8 w-8 text-blue-600" />
              Facebook Setup & Connection
            </h1>
            <p className="text-gray-600 mt-2">
              Configure your Facebook integration and manage connection settings
            </p>
          </div>
        </div>

        {/* Connection Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Connection Status
              <Badge variant={isConnected ? 'success' : 'destructive'}>
                {isConnected ? 'Connected' : 'Not Connected'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Current status of your Facebook integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectionStatus 
              status={connectionStatus}
              onRefresh={() => {
                setConnectionStatus('connecting');
                // Simulate status check
                setTimeout(() => setConnectionStatus('disconnected'), 1000);
              }}
            />
          </CardContent>
        </Card>

        {/* Setup Wizard */}
        {!isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Follow these steps to connect your Facebook account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showWizard ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Facebook Connection Required</div>
                      <div className="text-sm text-gray-600 mt-1">
                        You need to connect your Facebook account to use Facebook Tools features.
                      </div>
                    </div>
                  </Alert>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setShowWizard(true)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Start Setup Wizard
                    </Button>
                    
                    <FacebookConnectButton 
                      onConnect={(success) => {
                        if (success) {
                          setIsConnected(true);
                          setConnectionStatus('connected');
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <FacebookSetupWizard 
                  onComplete={(success) => {
                    setShowWizard(false);
                    if (success) {
                      setIsConnected(true);
                      setConnectionStatus('connected');
                    }
                  }}
                  onCancel={() => setShowWizard(false)}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Connected Account Info */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Connected Account
              </CardTitle>
              <CardDescription>
                Information about your connected Facebook account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Name</label>
                    <div className="text-sm mt-1">Demo Facebook Account</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account ID</label>
                    <div className="text-sm mt-1">123456789</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Connected Since</label>
                    <div className="text-sm mt-1">Today</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permissions</label>
                    <div className="text-sm mt-1">
                      <Badge variant="secondary" className="mr-1">pages_read_engagement</Badge>
                      <Badge variant="secondary" className="mr-1">pages_manage_metadata</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Token
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Permissions
                  </Button>
                  <Button variant="destructive" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Setup Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Requirements</CardTitle>
            <CardDescription>
              Prerequisites for Facebook integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Facebook App Created</div>
                  <div className="text-sm text-gray-600">Facebook app is configured in system settings</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">SSL Certificate</div>
                  <div className="text-sm text-gray-600">HTTPS is required for Facebook OAuth</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium">Facebook Account</div>
                  <div className="text-sm text-gray-600">Connect your Facebook account to proceed</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium">Page Access</div>
                  <div className="text-sm text-gray-600">Grant access to Facebook pages you want to manage</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Help */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Common questions and troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium flex items-center justify-between">
                  How do I create a Facebook App?
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 text-sm text-gray-600 pl-4">
                  <p>1. Go to Facebook Developers (developers.facebook.com)</p>
                  <p>2. Create a new app with "Business" type</p>
                  <p>3. Add "Facebook Login" product</p>
                  <p>4. Configure redirect URLs and permissions</p>
                </div>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium flex items-center justify-between">
                  What permissions do I need?
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 text-sm text-gray-600 pl-4">
                  <p>Required permissions:</p>
                  <p>• pages_read_engagement - Read page posts and comments</p>
                  <p>• pages_manage_metadata - Manage page information</p>
                  <p>• pages_messaging - Send and receive messages</p>
                </div>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium flex items-center justify-between">
                  Connection failed. What should I do?
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 text-sm text-gray-600 pl-4">
                  <p>1. Check your internet connection</p>
                  <p>2. Verify Facebook App credentials</p>
                  <p>3. Ensure your domain is whitelisted in Facebook App</p>
                  <p>4. Try refreshing the page and connecting again</p>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
