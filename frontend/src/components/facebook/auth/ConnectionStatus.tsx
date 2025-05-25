'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Loader2,
  Clock
} from 'lucide-react';

interface ConnectionStatusProps {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectionData?: {
    accountName?: string;
    accountId?: string;
    connectedAt?: string;
    lastSync?: string;
    permissions?: string[];
    tokenExpiresAt?: string;
  };
  error?: string;
  onRefresh?: () => void;
  onReconnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  connectionData,
  error,
  onRefresh,
  onReconnect,
  onDisconnect
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'connecting':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'disconnected':
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge variant="success">Connected</Badge>;
      case 'connecting':
        return <Badge variant="secondary">Connecting...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'disconnected':
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'connected':
        return 'Your Facebook account is connected and ready to use.';
      case 'connecting':
        return 'Establishing connection to your Facebook account...';
      case 'error':
        return error || 'There was an error connecting to your Facebook account.';
      case 'disconnected':
      default:
        return 'No Facebook account is currently connected.';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isTokenExpiringSoon = () => {
    if (!connectionData?.tokenExpiresAt) return false;
    const expiresAt = new Date(connectionData.tokenExpiresAt);
    const now = new Date();
    const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 7; // Alert if expiring within 7 days
  };

  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Connection Status</span>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getStatusMessage()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {status === 'connected' && onRefresh && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
          
          {status === 'error' && onReconnect && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onReconnect}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>

      {/* Connection Details */}
      {status === 'connected' && connectionData && (
        <div className="space-y-4">
          {/* Token Expiry Warning */}
          {isTokenExpiringSoon() && (
            <Alert variant="warning">
              <Clock className="h-4 w-4" />
              <div>
                <div className="font-medium">Token Expiring Soon</div>
                <div className="text-sm">
                  Your Facebook access token expires on {formatDate(connectionData.tokenExpiresAt)}. 
                  Please reconnect to maintain access.
                </div>
              </div>
            </Alert>
          )}

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-500">Account Name</label>
              <div className="text-sm mt-1">{connectionData.accountName || 'Unknown'}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Account ID</label>
              <div className="text-sm mt-1 font-mono">{connectionData.accountId || 'N/A'}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Connected Since</label>
              <div className="text-sm mt-1">{formatDate(connectionData.connectedAt)}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Last Sync</label>
              <div className="text-sm mt-1">{formatDate(connectionData.lastSync)}</div>
            </div>
            
            {connectionData.tokenExpiresAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">Token Expires</label>
                <div className="text-sm mt-1">{formatDate(connectionData.tokenExpiresAt)}</div>
              </div>
            )}
            
            {connectionData.permissions && connectionData.permissions.length > 0 && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Permissions</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {connectionData.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            )}
            
            {onReconnect && (
              <Button variant="outline" size="sm" onClick={onReconnect}>
                Update Permissions
              </Button>
            )}
            
            {onDisconnect && (
              <Button variant="destructive" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error Details */}
      {status === 'error' && error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <div>
            <div className="font-medium">Connection Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </Alert>
      )}
    </div>
  );
};
