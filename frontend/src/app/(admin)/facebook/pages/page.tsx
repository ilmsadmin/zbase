'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Grid } from '@/components/ui/GridFlex';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { PageSelector } from '@/components/facebook/pages/PageSelector';
import { PageCard } from '@/components/facebook/pages/PageCard';
import { PageSyncButton } from '@/components/facebook/pages/PageSyncButton';
import { facebookAuthService } from '@/services/facebook';
import { 
  Users, 
  RefreshCw, 
  Search, 
  Plus, 
  Settings,
  Globe,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Facebook
} from 'lucide-react';

// Mock data for demonstration
const mockPages = [
  {
    id: '1',
    name: 'ZBase Store',
    category: 'Business',
    followers_count: 1250,
    is_connected: true,
    picture: null,
    about: 'Your trusted partner for retail management solutions',
    website: 'https://zbase.com',
    phone: '+84 123 456 789',
    last_sync_at: '2 hours ago'
  },
  {
    id: '2',
    name: 'ZBase Support',
    category: 'Customer Service',
    followers_count: 890,
    is_connected: false,
    picture: null,
    about: 'Technical support and customer assistance',
    website: 'https://support.zbase.com',
    phone: '+84 987 654 321',
    last_sync_at: 'Never'
  }
];

export default function FacebookPagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>(['1']);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(mockPages);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setConnectionLoading(true);
    try {
      const status = await facebookAuthService.getConnectionStatus();
      setIsConnected(status && status.isConnected ? true : false);
    } catch (error) {
      console.error('Failed to check Facebook connection status:', error);
      setIsConnected(false);
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Update last sync time
      setPages(prev => prev.map(page => ({
        ...page,
        last_sync_at: 'Just now'
      })));
    }, 2000);
  };

  const handlePageToggle = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
    
    // Update page connection status
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, is_connected: !page.is_connected }
        : page
    ));
  };

  const handlePagesSelected = (selectedPages: any[]) => {
    console.log('Selected pages:', selectedPages);
    // Handle selected pages
  };

  const handleToggleConnection = (pageId: string, connect: boolean) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, is_connected: connect }
        : page
    ));
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const connectedCount = pages.filter(page => page.is_connected).length;
  return (
    <PermissionGuard 
      permissions={['facebook.users.read']} 
      renderWhen='any'
      debugMode={true}
    >
      <div className="space-y-6">
        {!connectionLoading && !isConnected && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Facebook Not Connected</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Your Facebook account is not connected. Connect Facebook to manage your pages.</span>
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

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              Facebook Pages
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your Facebook pages and their integration settings
            </p>
          </div>
          <div className="flex gap-2">
            <PageSyncButton 
              pageId="all"
              onSync={() => handleSync()}
              disabled={!isConnected}
              showStatus={false}
            />
            <Button variant="outline" disabled={!isConnected}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <Grid cols={1} mdCols={2} lgCols={4} gap={6}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Total Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pages.length}</div>
              <p className="text-xs text-gray-500 mt-1">Available pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
              <p className="text-xs text-gray-500 mt-1">Active integrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Total Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pages.reduce((sum, page) => sum + (page.followers_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Across all pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Last Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sm">2 hours ago</div>
              <p className="text-xs text-gray-500 mt-1">Most recent update</p>
            </CardContent>
          </Card>
        </Grid>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Page Management</CardTitle>
            <CardDescription>
              Select which pages to integrate with ZBase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" disabled={!isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Bulk Settings
              </Button>
            </div>

            {/* Page Selector - Shown only for demo purposes */}
            {isConnected && (
              <div className="mb-4">
                <PageSelector
                  onPagesSelected={handlePagesSelected}
                  initialSelectedPages={selectedPages}
                  multiple={true}
                  showActions={true}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pages List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Pages</h2>
          
          {!isConnected ? (
            <Card>
              <CardContent className="text-center py-8">
                <Facebook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Facebook Not Connected</h3>
                <p className="text-gray-600 mb-4">
                  You need to connect your Facebook account to manage pages.
                </p>
                <Button 
                  variant="default" 
                  onClick={() => router.push('/facebook/setup')}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Connect Facebook
                </Button>
              </CardContent>
            </Card>
          ) : filteredPages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No pages match your search criteria.' : 'No Facebook pages available.'}
                </p>
                <Button variant="outline" onClick={handleSync}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Pages
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid cols={1} mdCols={2} lgCols={3} gap={6}>
              {filteredPages.map((page) => (
                <PageCard
                  key={page.id}                  page={{
                    ...page,
                    is_connected: page.is_connected,
                    followers_count: page.followers_count,
                    last_sync_at: page.last_sync_at,
                    picture: page.picture ? { data: { url: '' } } : undefined
                  }}
                  onSettings={() => console.log('Open settings for page:', page.id)}
                  onToggleConnection={(pageId, connect) => handleToggleConnection(pageId, connect)}
                  onViewAnalytics={(pageId) => console.log('View analytics for page:', pageId)}
                  onSync={(pageId) => console.log('Sync page:', pageId)}
                />
              ))}
            </Grid>
          )}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Page Management Tips</CardTitle>
            <CardDescription>
              Best practices for managing your Facebook pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">✅ Connected Pages</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Automatically sync messages and comments</li>
                  <li>• Send replies directly from ZBase</li>
                  <li>• Track engagement metrics</li>
                  <li>• Receive real-time notifications</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">⚠️ Disconnected Pages</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• No automatic synchronization</li>
                  <li>• Manual management required</li>
                  <li>• Limited analytics data</li>
                  <li>• No automated responses</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
