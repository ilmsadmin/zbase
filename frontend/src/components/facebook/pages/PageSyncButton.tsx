'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  Download,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error';
  lastSync?: string;
  progress?: number;
  message?: string;
  syncType?: 'manual' | 'auto';
  details?: {
    posts?: number;
    comments?: number;
    messages?: number;
    errors?: number;
  };
}

interface PageSyncButtonProps {
  pageId: string;
  pageName?: string;
  syncStatus?: SyncStatus;
  onSync: (pageId: string, options?: SyncOptions) => Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  showStatus?: boolean;
  autoSync?: boolean;
}

interface SyncOptions {
  syncPosts?: boolean;
  syncComments?: boolean;
  syncMessages?: boolean;
  syncInsights?: boolean;
  fullSync?: boolean;
}

export const PageSyncButton: React.FC<PageSyncButtonProps> = ({
  pageId,
  pageName,
  syncStatus = { status: 'idle' },
  onSync,
  disabled = false,
  size = 'md',
  variant = 'outline',
  showStatus = true,
  autoSync = false
}) => {
  const [isLocalSyncing, setIsLocalSyncing] = useState(false);
  const [syncOptions, setSyncOptions] = useState<SyncOptions>({
    syncPosts: true,
    syncComments: true,
    syncMessages: true,
    syncInsights: true,
    fullSync: false
  });
  const [showOptions, setShowOptions] = useState(false);

  const handleSync = async (options?: SyncOptions) => {
    setIsLocalSyncing(true);
    try {
      await onSync(pageId, options || syncOptions);
    } finally {
      setIsLocalSyncing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  const getSyncStatusBadge = () => {
    switch (syncStatus.status) {
      case 'syncing':
        return (
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Syncing...
          </Badge>
        );
      case 'success':
        return (
          <Badge variant="success" className="text-xs flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Synced
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="text-xs flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const isSyncing = syncStatus.status === 'syncing' || isLocalSyncing;
  const isDisabled = disabled || isSyncing;

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const getProgressWidth = () => {
    if (syncStatus.progress !== undefined) {
      return `${Math.min(100, Math.max(0, syncStatus.progress))}%`;
    }
    return '0%';
  };

  return (
    <div className="space-y-2">
      {/* Main Sync Button */}
      <div className="flex items-center gap-2">
        <Button
          variant={variant}
          size={size}
          onClick={() => handleSync()}
          disabled={isDisabled}
          className={`flex items-center gap-2 ${buttonSizeClasses[size]}`}
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? 'Syncing...' : 'Sync'}
        </Button>

        {/* Quick Sync Options */}
        {!isSyncing && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSync({ fullSync: true })}
              className="px-2 py-1 text-xs"
              title="Full sync (all data)"
            >
              <Download className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="px-2 py-1 text-xs"
              title="Sync options"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isSyncing && syncStatus.progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth() }}
          />
        </div>
      )}

      {/* Status Information */}
      {showStatus && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getSyncStatusBadge()}
            {syncStatus.lastSync && (
              <span className="text-gray-500">
                Last: {formatDate(syncStatus.lastSync)}
              </span>
            )}
          </div>
          
          {autoSync && (
            <Badge variant="secondary" className="text-xs">
              Auto-sync enabled
            </Badge>
          )}
        </div>
      )}

      {/* Sync Details */}
      {syncStatus.details && syncStatus.status === 'success' && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <div className="grid grid-cols-2 gap-2">
            {syncStatus.details.posts !== undefined && (
              <div>Posts: {syncStatus.details.posts}</div>
            )}
            {syncStatus.details.comments !== undefined && (
              <div>Comments: {syncStatus.details.comments}</div>
            )}
            {syncStatus.details.messages !== undefined && (
              <div>Messages: {syncStatus.details.messages}</div>
            )}
            {syncStatus.details.errors !== undefined && syncStatus.details.errors > 0 && (
              <div className="text-red-600">Errors: {syncStatus.details.errors}</div>
            )}
          </div>
        </div>
      )}

      {/* Sync Options Panel */}
      {showOptions && (
        <div className="border rounded-lg p-3 bg-white shadow-sm">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Sync Options</h4>
            
            <div className="space-y-1">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={syncOptions.syncPosts}
                  onChange={(e) => setSyncOptions(prev => ({ ...prev, syncPosts: e.target.checked }))}
                  className="mr-2"
                />
                Sync Posts
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={syncOptions.syncComments}
                  onChange={(e) => setSyncOptions(prev => ({ ...prev, syncComments: e.target.checked }))}
                  className="mr-2"
                />
                Sync Comments
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={syncOptions.syncMessages}
                  onChange={(e) => setSyncOptions(prev => ({ ...prev, syncMessages: e.target.checked }))}
                  className="mr-2"
                />
                Sync Messages
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={syncOptions.syncInsights}
                  onChange={(e) => setSyncOptions(prev => ({ ...prev, syncInsights: e.target.checked }))}
                  className="mr-2"
                />
                Sync Insights
              </label>
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={syncOptions.fullSync}
                  onChange={(e) => setSyncOptions(prev => ({ ...prev, fullSync: e.target.checked }))}
                  className="mr-2"
                />
                Full Sync (slower, more complete)
              </label>
            </div>
            
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                onClick={() => handleSync(syncOptions)}
                disabled={isDisabled}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Start Sync
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOptions(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {syncStatus.status === 'error' && syncStatus.message && (
        <Alert variant="destructive" className="text-sm">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <div className="font-medium">Sync Failed</div>
            <div className="text-sm">{syncStatus.message}</div>
          </div>
        </Alert>
      )}

      {/* Success Message */}
      {syncStatus.status === 'success' && syncStatus.message && (
        <Alert variant="success" className="text-sm">
          <CheckCircle className="h-4 w-4" />
          <div>
            <div className="font-medium">Sync Completed</div>
            <div className="text-sm">{syncStatus.message}</div>
          </div>
        </Alert>
      )}
    </div>
  );
};
