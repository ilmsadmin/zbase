'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Star,
  Globe,
  Clock,
  TrendingUp
} from 'lucide-react';

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  followers_count?: number;
  posts_count?: number;
  engagement_rate?: number;
  access_token?: string;
  permissions?: string[];
  is_verified?: boolean;
  is_connected?: boolean;
  last_sync_at?: string;
  sync_status?: 'synced' | 'syncing' | 'error' | 'never';
  picture?: {
    data: {
      url: string;
    };
  };
  insights?: {
    impressions?: number;
    reach?: number;
    engagement?: number;
  };
}

interface PageCardProps {
  page: FacebookPage;
  onSync?: (pageId: string) => void;
  onSettings?: (pageId: string) => void;
  onViewAnalytics?: (pageId: string) => void;
  onToggleConnection?: (pageId: string, connect: boolean) => void;
  isLoading?: boolean;
}

export const PageCard: React.FC<PageCardProps> = ({
  page,
  onSync,
  onSettings,
  onViewAnalytics,
  onToggleConnection,
  isLoading = false
}) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getSyncStatusBadge = () => {
    switch (page.sync_status) {
      case 'synced':
        return <Badge variant="success" className="text-xs">Synced</Badge>;
      case 'syncing':
        return <Badge variant="secondary" className="text-xs">Syncing...</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">Error</Badge>;
      case 'never':
      default:
        return <Badge variant="secondary" className="text-xs">Not Synced</Badge>;
    }
  };

  const getConnectionBadge = () => {
    if (page.is_connected) {
      return <Badge variant="success" className="text-xs">Connected</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Disconnected</Badge>;
  };

  const handleSync = async () => {
    if (onSync) {
      setIsLocalLoading(true);
      try {
        await onSync(page.id);
      } finally {
        setIsLocalLoading(false);
      }
    }
  };

  const handleToggleConnection = async () => {
    if (onToggleConnection) {
      setIsLocalLoading(true);
      try {
        await onToggleConnection(page.id, !page.is_connected);
      } finally {
        setIsLocalLoading(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {page.name}
                {page.is_verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" title="Verified Page" />
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {page.category}
                {page.followers_count && (
                  <>
                    <span>•</span>
                    <span>{formatNumber(page.followers_count)} followers</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            {getConnectionBadge()}
            {getSyncStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Page Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(page.followers_count)}
            </div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(page.posts_count)}
            </div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {page.engagement_rate ? `${page.engagement_rate.toFixed(1)}%` : '0%'}
            </div>
            <div className="text-xs text-gray-500">Engagement</div>
          </div>
        </div>

        {/* Insights (if available) */}
        {page.insights && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Insights
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-semibold">{formatNumber(page.insights.impressions)}</div>
                <div className="text-xs text-gray-500">Impressions</div>
              </div>
              <div>
                <div className="text-sm font-semibold">{formatNumber(page.insights.reach)}</div>
                <div className="text-xs text-gray-500">Reach</div>
              </div>
              <div>
                <div className="text-sm font-semibold">{formatNumber(page.insights.engagement)}</div>
                <div className="text-xs text-gray-500">Engagement</div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions */}
        {page.permissions && page.permissions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-1">
              {page.permissions.map((permission) => {
                const permissionLabels: Record<string, string> = {
                  'pages_read_engagement': 'Read',
                  'pages_manage_metadata': 'Manage',
                  'pages_messaging': 'Messages'
                };
                
                return (
                  <Badge key={permission} variant="secondary" className="text-xs">
                    {permissionLabels[permission] || permission}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Last Sync Info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last sync: {formatDate(page.last_sync_at)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {page.is_connected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isLoading || isLocalLoading || page.sync_status === 'syncing'}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${(isLoading || isLocalLoading || page.sync_status === 'syncing') ? 'animate-spin' : ''}`} />
                Sync
              </Button>
              
              {onViewAnalytics && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewAnalytics(page.id)}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleToggleConnection}
              disabled={isLoading || isLocalLoading}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Connect
            </Button>
          )}
          
          {onSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSettings(page.id)}
              className="flex items-center gap-2 ml-auto"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          )}
        </div>

        {/* Quick Actions for Connected Pages */}
        {page.is_connected && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-2"
              onClick={() => {/* Navigate to messages */}}
            >
              <MessageSquare className="h-3 w-3" />
              Messages
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              className="text-xs flex items-center gap-2"
              onClick={handleToggleConnection}
              disabled={isLoading || isLocalLoading}
            >
              <XCircle className="h-3 w-3" />
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
