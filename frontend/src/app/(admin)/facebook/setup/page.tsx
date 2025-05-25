'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { Facebook, CheckCircle, XCircle, Settings, AlertTriangle, RefreshCw, Code, Bug } from 'lucide-react';
import { FacebookSetupWizard } from '@/components/facebook/auth/FacebookSetupWizard';
import { FacebookConnectButton } from '@/components/facebook/auth/FacebookConnectButton';
import { ConnectionStatus } from '@/components/facebook/auth/ConnectionStatus';
import { FacebookAppTest } from '@/components/facebook/auth/FacebookAppTest';
import { facebookAuthService } from '@/services/facebook';
import { useToast } from '@/hooks/useToast';

export default function FacebookSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [facebookData, setFacebookData] = useState<any>(null);
  const [facebookUser, setFacebookUser] = useState<any>(null);
  const [connectedPages, setConnectedPages] = useState<any[]>([]);
  const [showDataLog, setShowDataLog] = useState(false);
  const [apiRawResponse, setApiRawResponse] = useState<any>(null);
  const toast = useToast();

  // Check connection status on mount
  React.useEffect(() => {
    checkConnectionStatus();
  }, []);  const checkConnectionStatus = async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    try {
      const result = await facebookAuthService.getConnectionStatus();
      // Lưu dữ liệu thô từ API để kiểm tra
      setApiRawResponse(result);
      console.log('API Response:', result);
      
      if (!result.success) {
        console.error('Failed to get connection status:', result.message);
        setIsConnected(false);
        setConnectionStatus('error');
        toast.error(result.message || "Failed to check Facebook connection");
        setFacebookData(null);
        setFacebookUser(null);
        setConnectedPages([]);
        return;
      }
      
      // Lưu trữ response gốc
      const response = result.data;
      setFacebookData(response);
      
      if (response && response.isConnected) {
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Sử dụng type assertion để TypeScript không kiểm tra kiểu chặt chẽ
        const rawResponse = response as any;
        
        // Kiểm tra xem response có cấu trúc mới với user không
        if (rawResponse.user) {
          console.log('Đang sử dụng cấu trúc API mới (user)');
          // Ánh xạ dữ liệu người dùng từ API mới sang cấu trúc cho component
          const mappedUser = {
            id: rawResponse.user.facebookUserId,
            name: rawResponse.user.name,
            email: rawResponse.user.email,
            profilePicture: rawResponse.user.profilePicture,
            connectedAt: new Date().toISOString(),
            lastSyncAt: rawResponse.lastSync,
            tokenExpiresAt: rawResponse.tokenExpiresAt,
            scopes: [], // Mặc định là mảng rỗng nếu không có trong API
            isActive: true
          };
          
          setFacebookUser(mappedUser);
          console.log('Mapped Facebook User Data:', mappedUser);
          
          // Set connected pages từ cấu trúc API mới
          if (rawResponse.pages && Array.isArray(rawResponse.pages)) {
            setConnectedPages(rawResponse.pages);
            console.log('Connected Pages (new API):', rawResponse.pages);
          }
        }
        // Sử dụng cấu trúc cũ nếu có facebookUser
        else if (rawResponse.facebookUser) {
          console.log('Đang sử dụng cấu trúc API cũ (facebookUser)');
          setFacebookUser(rawResponse.facebookUser);
          console.log('Facebook User Data (old API):', rawResponse.facebookUser);
          
          // Set connected pages từ cấu trúc API cũ
          if (rawResponse.connectedPages && Array.isArray(rawResponse.connectedPages)) {
            setConnectedPages(rawResponse.connectedPages);
            console.log('Connected Pages (old API):', rawResponse.connectedPages);
          }
        }
      } else {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setFacebookUser(null);
        setConnectedPages([]);
      }
    } catch (error: any) {
      console.error('Failed to check connection status:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      toast.error(error?.message || "Failed to check Facebook connection");
      setFacebookData(null);
      setFacebookUser(null);
      setConnectedPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (success: boolean) => {
    if (success) {
      setIsConnected(true);
      setConnectionStatus('connected');
      // Recheck status to get updated data
      await checkConnectionStatus();
    } else {
      setConnectionStatus('error');
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
              <Facebook className="h-8 w-8 text-blue-600" />
              Facebook Setup & Connection
            </h1>
            <p className="text-gray-600 mt-2">
              Configure your Facebook integration and manage connection settings
            </p>
          </div>
        </div>        {/* Connection Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Connection Status
              {isLoading ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Checking...
                </Badge>
              ) : (
                <Badge variant={isConnected ? 'success' : 'destructive'}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Current status of your Facebook integration
            </CardDescription>
          </CardHeader>          <CardContent>            <ConnectionStatus 
              status={connectionStatus}
              connectionData={isConnected && facebookUser ? {
                accountName: facebookUser.name,
                accountId: facebookUser.id,
                connectedAt: facebookUser.connectedAt,
                lastSync: facebookUser.lastSyncAt,
                permissions: facebookUser.scopes,
                tokenExpiresAt: facebookUser.tokenExpiresAt,
                isActive: facebookUser.isActive,
                isConnected: true
              } : undefined}
              onRefresh={checkConnectionStatus}
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
                      onConnect={handleConnect}
                      disabled={isLoading}
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
            </CardHeader>            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Name</label>
                    <div className="text-sm mt-1">{facebookUser?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account ID</label>
                    <div className="text-sm mt-1">{facebookUser?.id || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Connected Since</label>
                    <div className="text-sm mt-1">
                      {facebookUser?.connectedAt 
                        ? new Date(facebookUser.connectedAt).toLocaleDateString() 
                        : 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permissions</label>
                    <div className="text-sm mt-1">
                      {facebookUser?.scopes?.map((permission: string) => (
                        <Badge key={permission} variant="secondary" className="mr-1">{permission}</Badge>
                      )) || 'No permissions found'}
                    </div>
                  </div>
                  {facebookUser?.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="text-sm mt-1">{facebookUser.email}</div>
                    </div>
                  )}
                  {facebookUser?.tokenExpiresAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Token Expires</label>
                      <div className="text-sm mt-1">
                        {new Date(facebookUser.tokenExpiresAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const result = await facebookAuthService.refreshToken();
                        if (result.success) {
                          toast.success(result.message || "Facebook token refreshed successfully");
                          await checkConnectionStatus();
                        } else {
                          toast.error(result.message || "Failed to refresh token");
                        }
                      } catch (error: any) {
                        console.error('Failed to refresh token:', error);
                        toast.error(error?.message || "Failed to refresh Facebook token");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Token
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      try {
                        const authConfig = await facebookAuthService.getAuthorizationUrl();
                        if (authConfig.success && authConfig.data?.authUrl) {
                          window.open(authConfig.data.authUrl, "_blank");
                        }
                      } catch (error) {
                        console.error('Failed to get authorization URL:', error);
                      }
                    }}
                  >
                    Update Permissions
                  </Button>                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={async () => {
                      if (confirm('Are you sure you want to disconnect your Facebook account?')) {
                        try {
                          setIsLoading(true);
                          const result = await facebookAuthService.disconnect();
                          if (result.success) {
                            setIsConnected(false);
                            setConnectionStatus('disconnected');
                            setFacebookData(null);
                            setFacebookUser(null);
                            setConnectedPages([]);
                            toast.success("Your Facebook account has been disconnected successfully");
                          } else {
                            toast.error(result.message || "Could not disconnect Facebook account");
                          }
                        } catch (error: any) {
                          console.error('Failed to disconnect:', error);
                          toast.error(error?.message || "Failed to disconnect from Facebook");
                        } finally {
                          setIsLoading(false);
                          // Verify the disconnection was successful by checking the status again
                          await checkConnectionStatus();
                        }
                      }
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected Pages */}
        {isConnected && connectedPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-500" />
                Connected Pages
              </CardTitle>
              <CardDescription>
                Facebook Pages connected to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedPages.map((page: any) => (
                  <div key={page.id} className="flex items-center gap-3 p-3 border rounded-md">
                    {page.profilePicture ? (
                      <img 
                        src={page.profilePicture} 
                        alt={page.name} 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Facebook className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{page.name}</div>
                      <div className="text-sm text-gray-500">
                        {page.category || 'No category'} • ID: {page.facebookPageId || page.id}
                      </div>
                    </div>
                    <Badge variant={page.isActive ? 'success' : 'secondary'}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
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
          </CardHeader>          <CardContent>
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
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium">Facebook Account</div>
                  <div className="text-sm text-gray-600">
                    {isConnected && facebookUser
                      ? `Connected as ${facebookUser.name}` 
                      : 'Connect your Facebook account to proceed'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {(isConnected && connectedPages.length > 0) ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium">Page Access</div>
                  <div className="text-sm text-gray-600">
                    {(isConnected && connectedPages.length > 0)
                      ? `${connectedPages.length} page(s) connected`
                      : 'Grant access to Facebook pages you want to manage'}
                  </div>
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
                <div className="mt-2 text-sm text-gray-600 pl-4">                  <p>Basic permissions (available without review):</p>
                  <p>• public_profile - Basic user profile</p>
                  <p>• email - User email address</p>
                  <p>• pages_show_list - View pages list</p>
                  <p className="mt-2 text-amber-600">Advanced permissions (require Facebook App Review):</p>
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

        {/* App Configuration Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              App Configuration Test
            </CardTitle>
            <CardDescription>
              Test your Facebook App configuration and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FacebookAppTest />
          </CardContent>
        </Card>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Bug className="h-4 w-4" />
                Xem dữ liệu API
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Dữ liệu thô từ API</DialogTitle>
                <DialogDescription>
                  Dữ liệu gốc nhận được từ API để kiểm tra tính chính xác
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4">
                <div className="border rounded-md p-4 bg-slate-50">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" /> Response từ getConnectionStatus API
                  </h3>
                  <pre className="text-xs overflow-auto p-2 bg-slate-100 rounded border max-h-[300px]">
                    {JSON.stringify(apiRawResponse, null, 2)}
                  </pre>
                </div>
                
                {facebookUser && (
                  <div className="border rounded-md p-4 bg-slate-50">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Dữ liệu FacebookUser
                    </h3>
                    <pre className="text-xs overflow-auto p-2 bg-slate-100 rounded border max-h-[300px]">
                      {JSON.stringify(facebookUser, null, 2)}
                    </pre>
                  </div>
                )}
                
                {connectedPages && connectedPages.length > 0 && (
                  <div className="border rounded-md p-4 bg-slate-50">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Dữ liệu Facebook Pages
                    </h3>
                    <pre className="text-xs overflow-auto p-2 bg-slate-100 rounded border max-h-[300px]">
                      {JSON.stringify(connectedPages, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => checkConnectionStatus()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cập nhật dữ liệu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PermissionGuard>
  );
}
