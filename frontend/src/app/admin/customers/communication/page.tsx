"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { FormSelect } from '@/components/ui/FormSelect';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function CustomerCommunicationPage() {
  const [activeTab, setActiveTab] = useState('email-templates');
  
  // Mock data for email campaigns
  const campaigns = [
    {
      id: '1',
      name: 'Welcome Series',
      subject: 'Welcome to ZBase! Get Started Today',
      sentTo: 124,
      openRate: '45%',
      clickRate: '12%',
      lastSent: '2025-05-22',
      status: 'active'
    },
    {
      id: '2',
      name: 'Abandoned Cart',
      subject: 'You left something behind!',
      sentTo: 78,
      openRate: '32%',
      clickRate: '8%',
      lastSent: '2025-05-23',
      status: 'active'
    },
    {
      id: '3',
      name: 'Monthly Newsletter',
      subject: 'ZBase Updates - May 2025',
      sentTo: 450,
      openRate: '28%',
      clickRate: '5%',
      lastSent: '2025-05-20',
      status: 'active'
    },
    {
      id: '4',
      name: 'Win-back Campaign',
      subject: 'We miss you! Here\'s 10% off your next purchase',
      sentTo: 215,
      openRate: '18%',
      clickRate: '7%',
      lastSent: '2025-05-15',
      status: 'inactive'
    }
  ];
  
  // Email campaigns table columns
  const campaignColumns = [
    {
      header: 'Campaign Name',
      accessorKey: 'name',
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
    },
    {
      header: 'Sent To',
      accessorKey: 'sentTo',
    },
    {
      header: 'Open Rate',
      accessorKey: 'openRate',
    },
    {
      header: 'Click Rate',
      accessorKey: 'clickRate',
    },
    {
      header: 'Last Sent',
      accessorKey: 'lastSent',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'}>
          {row.original.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="outline" size="sm">Duplicate</Button>
        </div>
      ),
    }
  ];
  
  // Email templates mock data
  const templates = [
    { id: '1', name: 'Welcome Email', subject: 'Welcome to ZBase!', type: 'Automated', lastEdited: '2025-05-10' },
    { id: '2', name: 'Order Confirmation', subject: 'Your order has been confirmed', type: 'Transactional', lastEdited: '2025-05-12' },
    { id: '3', name: 'Shipping Confirmation', subject: 'Your order has shipped', type: 'Transactional', lastEdited: '2025-05-15' },
    { id: '4', name: 'Abandoned Cart', subject: 'You left something in your cart', type: 'Automated', lastEdited: '2025-05-18' },
    { id: '5', name: 'Newsletter Template', subject: 'Monthly Updates', type: 'Marketing', lastEdited: '2025-05-20' }
  ];
  
  // Template columns
  const templateColumns = [
    {
      header: 'Template Name',
      accessorKey: 'name',
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Last Edited',
      accessorKey: 'lastEdited',
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="outline" size="sm">Preview</Button>
        </div>
      ),
    }
  ];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="email-templates" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
          <TabsTrigger value="email-campaigns">Email Campaigns</TabsTrigger>
          <TabsTrigger value="sms-templates">SMS Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email-templates">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Email Templates</h2>
              <Button>Create Template</Button>
            </div>
            
            <DataTable
              columns={templateColumns}
              data={templates}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="email-campaigns">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Email Campaigns</h2>
              <Button>Create Campaign</Button>
            </div>
            
            <DataTable
              columns={campaignColumns}
              data={campaigns}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="sms-templates">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">SMS Templates</h2>
              <Button>Create SMS Template</Button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-gray-500">No SMS templates have been created yet.</p>
              <Button className="mt-4">Create Your First SMS Template</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Communication Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Settings</h3>
                
                <div className="space-y-4">
                  <FormInput
                    label="Sender Name"
                    defaultValue="ZBase Team"
                    helperText="Name that will appear in the From field"
                  />
                  
                  <FormInput
                    label="Reply-to Email"
                    defaultValue="support@zbase.com"
                    helperText="Email address for customer replies"
                  />
                  
                  <FormTextarea
                    label="Email Footer"
                    defaultValue="© 2025 ZBase. All rights reserved.\n123 Commerce St, Business City"
                    helperText="Text to appear at the bottom of all emails"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">SMS Settings</h3>
                
                <div className="space-y-4">
                  <FormInput
                    label="Sender ID"
                    defaultValue="ZBASE"
                    helperText="Alphanumeric ID that appears as the sender"
                  />
                  
                  <FormSelect
                    label="SMS Provider"
                    defaultValue="twilio"
                    options={[
                      { value: 'twilio', label: 'Twilio' },
                      { value: 'messagebird', label: 'MessageBird' },
                      { value: 'nexmo', label: 'Nexmo' }
                    ]}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
