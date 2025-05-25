'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Users, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Loader2,
  Globe,
  Star
} from 'lucide-react';

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  followers_count?: number;
  access_token?: string;
  permissions?: string[];
  is_verified?: boolean;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface PageSelectorProps {
  onPagesSelected: (pages: FacebookPage[]) => void;
  onCancel?: () => void;
  initialSelectedPages?: string[];
  multiple?: boolean;
  showActions?: boolean;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  onPagesSelected,
  onCancel,
  initialSelectedPages = [],
  multiple = true,
  showActions = true
}) => {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(initialSelectedPages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockPages: FacebookPage[] = [
    {
      id: '1',
      name: 'ZBase Store',
      category: 'Business',
      followers_count: 1250,
      is_verified: true,
      permissions: ['pages_read_engagement', 'pages_manage_metadata', 'pages_messaging']
    },
    {
      id: '2',
      name: 'ZBase Support',
      category: 'Customer Service',
      followers_count: 890,
      is_verified: false,
      permissions: ['pages_read_engagement', 'pages_messaging']
    },
    {
      id: '3',
      name: 'ZBase Community',
      category: 'Community',
      followers_count: 2340,
      is_verified: true,
      permissions: ['pages_read_engagement']
    }
  ];

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await facebookPagesService.getAvailablePages();
      // setPages(response);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPages(mockPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load Facebook pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageToggle = (pageId: string) => {
    setSelectedPageIds(prev => {
      if (multiple) {
        return prev.includes(pageId)
          ? prev.filter(id => id !== pageId)
          : [...prev, pageId];
      } else {
        return prev.includes(pageId) ? [] : [pageId];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedPageIds(pages.map(page => page.id));
  };

  const handleSelectNone = () => {
    setSelectedPageIds([]);
  };

  const handleConfirm = () => {
    const selectedPages = pages.filter(page => selectedPageIds.includes(page.id));
    onPagesSelected(selectedPages);
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFollowersCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getPermissionBadges = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return null;

    const permissionLabels: Record<string, string> = {
      'pages_read_engagement': 'Read',
      'pages_manage_metadata': 'Manage',
      'pages_messaging': 'Messages'
    };

    return permissions.map(permission => (
      <Badge 
        key={permission} 
        variant="secondary" 
        className="text-xs"
      >
        {permissionLabels[permission] || permission}
      </Badge>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading Facebook pages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <div>
          <div className="font-medium">Failed to Load Pages</div>
          <div className="text-sm">{error}</div>
          <Button variant="outline" size="sm" onClick={loadPages} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Facebook Pages</h3>
          <p className="text-sm text-gray-600">
            Choose which pages you want to manage through ZBase
          </p>
        </div>
        
        <Button variant="outline" size="sm" onClick={loadPages}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {multiple && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectNone}>
              Select None
            </Button>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedPageIds.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{selectedPageIds.length}</strong> page{selectedPageIds.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No pages match your search' : 'No Facebook pages found'}
          </div>
        ) : (
          filteredPages.map((page) => (
            <div key={page.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{page.name}</h4>
                      {page.is_verified && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{page.category}</span>
                      {page.followers_count && (
                        <>
                          <span>•</span>
                          <span>{formatFollowersCount(page.followers_count)} followers</span>
                        </>
                      )}
                    </div>
                    
                    {page.permissions && page.permissions.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {getPermissionBadges(page.permissions)}
                      </div>
                    )}
                  </div>
                </div>
                
                <label className="flex items-center">
                  <input
                    type={multiple ? 'checkbox' : 'radio'}
                    name="selectedPages"
                    checked={selectedPageIds.includes(page.id)}
                    onChange={() => handlePageToggle(page.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">
                    {multiple ? 'Select' : 'Choose'}
                  </span>
                </label>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-between pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          
          <Button 
            onClick={handleConfirm}
            disabled={selectedPageIds.length === 0}
            className="ml-auto"
          >
            Confirm Selection ({selectedPageIds.length})
          </Button>
        </div>
      )}
    </div>
  );
};
