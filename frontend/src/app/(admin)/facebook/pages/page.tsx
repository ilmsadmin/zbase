'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Grid } from '@/components/ui/GridFlex';
import { PageSelector } from '@/components/facebook/pages/PageSelector';
import { PageCard } from '@/components/facebook/pages/PageCard';
import { PageSyncButton } from '@/components/facebook/pages/PageSyncButton';
import { 
  Users, 
  RefreshCw, 
  Search, 
  Plus, 
  Settings,
  Globe,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Mock data for demonstration
const mockPages = [
  {
    id: '1',
    name: 'ZBase Store',
    category: 'Business',
    followers: 1250,
    isConnected: true,
    profilePicture: null,
    about: 'Your trusted partner for retail management solutions',
    website: 'https://zbase.com',
    phone: '+84 123 456 789',
    lastSync: '2 hours ago'
  },
  {
    id: '2',
    name: 'ZBase Support',
    category: 'Customer Service',
    followers: 890,
    isConnected: false,
    profilePicture: null,
    about: 'Technical support and customer assistance',
    website: 'https://support.zbase.com',
    phone: '+84 987 654 321',
    lastSync: 'Never'
  }
];

export default function FacebookPagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>(['1']);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(mockPages);

  const handleSync = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Update last sync time
      setPages(prev => prev.map(page => ({
        ...page,
        lastSync: 'Just now'
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
        ? { ...page, isConnected: !page.isConnected }
        : page
    ));
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const connectedCount = pages.filter(page => page.isConnected).length;

  return (
    <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="space-y-6">
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
              onSync={handleSync}
              isLoading={isLoading}
            />
            <Button variant="outline" disabled>
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
                {pages.reduce((sum, page) => sum + page.followers, 0).toLocaleString()}
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
              <Button variant="outline" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Bulk Settings
              </Button>
            </div>

            {/* Page Selector */}
            <PageSelector
              pages={filteredPages}
              selectedPages={selectedPages}
              onToggle={handlePageToggle}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Pages List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Pages</h2>
          
          {filteredPages.length === 0 ? (
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
                  key={page.id}
                  page={page}
                  onToggle={() => handlePageToggle(page.id)}
                  onSettings={() => {
                    // Handle page settings
                    console.log('Open settings for page:', page.id);
                  }}
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
