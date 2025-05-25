'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Grid } from '@/components/ui/GridFlex';
import Link from 'next/link';
import { Facebook, Settings, MessageSquare, MessageCircle, BarChart3, Users } from 'lucide-react';

export default function FacebookPage() {
  return (
    <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Facebook className="h-8 w-8 text-blue-600" />
              Facebook Tools
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your Facebook integration, pages, messages, and analytics
            </p>
          </div>
          <Link href="/admin/facebook/setup">
            <Button variant="primary" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup Connection
            </Button>
          </Link>
        </div>

        {/* Quick Stats Overview */}
        <Grid cols={1} mdCols={2} lgCols={4} gap={6}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Connected Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">No pages connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">All caught up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                New Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">No new comments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-gray-500 mt-1">No data available</p>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Navigation Cards */}
        <Grid cols={1} mdCols={2} lgCols={3} gap={6}>
          <Link href="/admin/facebook/setup">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  Setup & Connection
                </CardTitle>
                <CardDescription>
                  Connect your Facebook account and configure settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  • Connect Facebook account
                  <br />
                  • Configure permissions
                  <br />
                  • Manage connection status
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/facebook/pages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  Pages Management
                </CardTitle>
                <CardDescription>
                  Manage your Facebook pages and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  • View connected pages
                  <br />
                  • Sync page information
                  <br />
                  • Configure page settings
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/facebook/messages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 hover:border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  Messages
                </CardTitle>
                <CardDescription>
                  Handle Facebook messages and customer inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  • View all messages
                  <br />
                  • Reply to customers
                  <br />
                  • Auto-reply settings
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/facebook/comments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200 hover:border-orange-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  Comments
                </CardTitle>
                <CardDescription>
                  Manage comments on your Facebook posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  • Monitor comments
                  <br />
                  • Reply to comments
                  <br />
                  • Moderate content
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/facebook/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 hover:border-indigo-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                  </div>
                  Analytics
                </CardTitle>
                <CardDescription>
                  View insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  • Message statistics
                  <br />
                  • Engagement metrics
                  <br />
                  • Performance reports
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-400" />
                </div>
                Advanced Features
              </CardTitle>
              <CardDescription className="text-gray-400">
                Coming soon - webhooks, automation, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">
                • Real-time webhooks
                <br />
                • Message templates
                <br />
                • Bulk operations
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for Facebook management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Grid cols={1} mdCols={2} lgCols={4} gap={4}>
              <Button variant="outline" className="justify-start" disabled>
                Sync All Pages
              </Button>
              <Button variant="outline" className="justify-start" disabled>
                Check New Messages
              </Button>
              <Button variant="outline" className="justify-start" disabled>
                Export Analytics
              </Button>
              <Button variant="outline" className="justify-start" disabled>
                Test Connection
              </Button>
            </Grid>
            <p className="text-sm text-gray-500 mt-4">
              * Actions will be enabled after Facebook connection is established
            </p>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
