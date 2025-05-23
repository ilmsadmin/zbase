'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, FormInput, FormSelect, FormTextarea, FormCheckboxRadio } from '@/components/ui';
import { Tabs, TabPanel } from '@headlessui/react';
import { Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react';

// Schema for email settings form
const emailSettingsSchema = z.object({
  emailProvider: z.enum(['smtp', 'mailgun', 'sendgrid']),
  fromEmail: z.string().email('Invalid email format'),
  fromName: z.string().min(1, 'Sender name is required'),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpEncryption: z.enum(['none', 'tls', 'ssl']).optional(),
  apiKey: z.string().optional(),
});

// Schema for notification settings form
const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  lowStockAlerts: z.boolean().default(true),
  orderNotifications: z.boolean().default(true),
  systemUpdates: z.boolean().default(true),
  dailyReports: z.boolean().default(false),
  weeklyReports: z.boolean().default(true),
  monthlyReports: z.boolean().default(true),
});

// Schema for backup settings form
const backupSettingsSchema = z.object({
  autoBackup: z.boolean().default(true),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']),
  backupTime: z.string(),
  backupRetention: z.string().transform(val => parseInt(val) || 30),
  backupLocation: z.enum(['local', 'cloud']),
  cloudProvider: z.enum(['s3', 'gcs', 'azure']).optional(),
  bucketName: z.string().optional(),
  accessKey: z.string().optional(),
  secretKey: z.string().optional(),
});

// Interface for API key
interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

// Mock API keys
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'POS Integration',
    key: 'zb_pk_123456789abcdef',
    createdAt: '2025-01-10T00:00:00Z',
    lastUsed: '2025-05-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Website Integration',
    key: 'zb_pk_abcdefghijklmno',
    createdAt: '2025-02-15T00:00:00Z',
    lastUsed: '2025-05-22T09:15:00Z',
  },
];

export default function SystemConfigPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ name: string; key: string } | null>(null);
  const [showKeyValues, setShowKeyValues] = useState<Record<string, boolean>>({});
  
  // Email settings form
  const { 
    register: registerEmail, 
    handleSubmit: handleSubmitEmail,
    watch: watchEmail,
    formState: { errors: errorsEmail },
    control: controlEmail,
  } = useForm({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      emailProvider: 'smtp' as const,
      fromEmail: 'no-reply@zbase.example.com',
      fromName: 'ZBase System',
      smtpHost: 'smtp.example.com',
      smtpPort: '587',
      smtpUsername: 'smtp-user',
      smtpPassword: 'smtp-password',
      smtpEncryption: 'tls' as const,
    },
  });

  // Notification settings form
  const { 
    register: registerNotify, 
    handleSubmit: handleSubmitNotify,
    formState: { errors: errorsNotify },
    control: controlNotify,
  } = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      lowStockAlerts: true,
      orderNotifications: true,
      systemUpdates: true,
      dailyReports: false,
      weeklyReports: true,
      monthlyReports: true,
    },
  });

  // Backup settings form
  const { 
    register: registerBackup, 
    handleSubmit: handleSubmitBackup,
    watch: watchBackup,
    formState: { errors: errorsBackup },
    control: controlBackup,
  } = useForm({
    resolver: zodResolver(backupSettingsSchema),
    defaultValues: {
      autoBackup: true,
      backupFrequency: 'daily' as const,
      backupTime: '01:00',
      backupRetention: '30',
      backupLocation: 'local' as const,
      cloudProvider: 's3' as const,
      bucketName: 'zbase-backups',
    },
  });

  const emailProvider = watchEmail('emailProvider');
  const backupLocation = watchBackup('backupLocation');

  // Handle save for each settings section
  const onSaveEmailSettings = async (data: any) => {
    await handleSaveSettings(data, 'email');
  };

  const onSaveNotificationSettings = async (data: any) => {
    await handleSaveSettings(data, 'notifications');
  };

  const onSaveBackupSettings = async (data: any) => {
    await handleSaveSettings(data, 'backup');
  };

  const handleSaveSettings = async (data: any, settingType: string) => {
    setIsSubmitting(true);
    try {
      console.log(`Saving ${settingType} settings:`, data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error saving ${settingType} settings:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // API Keys management functions
  const toggleShowKey = (keyId: string) => {
    setShowKeyValues(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    
    // In a real app, this would call the API to create a new key
    const newKey = {
      id: `temp-${Date.now()}`,
      name: newKeyName,
      key: `zb_pk_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    
    setNewlyCreatedKey({ name: newKey.name, key: newKey.key });
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setShowNewKeyForm(false);
  };

  const handleDeleteKey = (keyId: string) => {
    // In a real app, this would call the API to delete the key
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">System Configuration</h2>
      </div>

      <div className="bg-card border border-border rounded-md">
        <div className="border-b border-border">
          <nav className="flex -mb-px">
            {['Email Settings', 'Notification Preferences', 'Backup Settings', 'API Keys'].map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === index
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Email Settings Tab */}
          {activeTab === 0 && (
            <form onSubmit={handleSubmitEmail(onSaveEmailSettings)}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormSelect
                      label="Email Provider"
                      name="emailProvider"
                      control={controlEmail}
                      options={[
                        { label: 'SMTP Server', value: 'smtp' },
                        { label: 'Mailgun', value: 'mailgun' },
                        { label: 'SendGrid', value: 'sendgrid' },
                      ]}
                      error={errorsEmail.emailProvider?.message}
                    />
                  </div>
                  
                  <FormInput
                    label="From Email"
                    {...registerEmail('fromEmail')}
                    error={errorsEmail.fromEmail?.message}
                  />
                  
                  <FormInput
                    label="From Name"
                    {...registerEmail('fromName')}
                    error={errorsEmail.fromName?.message}
                  />
                </div>

                {emailProvider === 'smtp' && (
                  <div className="border border-border rounded-md p-4 bg-muted/10 mt-4">
                    <h4 className="font-medium mb-4">SMTP Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="SMTP Host"
                        {...registerEmail('smtpHost')}
                        error={errorsEmail.smtpHost?.message}
                      />
                      
                      <FormInput
                        label="SMTP Port"
                        {...registerEmail('smtpPort')}
                        error={errorsEmail.smtpPort?.message}
                      />
                      
                      <FormInput
                        label="SMTP Username"
                        {...registerEmail('smtpUsername')}
                        error={errorsEmail.smtpUsername?.message}
                      />
                      
                      <FormInput
                        label="SMTP Password"
                        type="password"
                        {...registerEmail('smtpPassword')}
                        error={errorsEmail.smtpPassword?.message}
                      />
                      
                      <div className="md:col-span-2">
                        <FormSelect
                          label="Encryption"
                          name="smtpEncryption"
                          control={controlEmail}
                          options={[
                            { label: 'None', value: 'none' },
                            { label: 'TLS', value: 'tls' },
                            { label: 'SSL', value: 'ssl' },
                          ]}
                          error={errorsEmail.smtpEncryption?.message}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(emailProvider === 'mailgun' || emailProvider === 'sendgrid') && (
                  <div className="border border-border rounded-md p-4 bg-muted/10">
                    <h4 className="font-medium mb-4">{emailProvider === 'mailgun' ? 'Mailgun' : 'SendGrid'} API Settings</h4>
                    <FormInput
                      label="API Key"
                      type="password"
                      {...registerEmail('apiKey')}
                      error={errorsEmail.apiKey?.message}
                    />
                  </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Email Settings'}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Notification Preferences Tab */}
          {activeTab === 1 && (
            <form onSubmit={handleSubmitNotify(onSaveNotificationSettings)}>
              <div className="space-y-6">
                <div className="border border-border rounded-md p-4">
                  <h4 className="font-medium mb-4">System Notifications</h4>
                  <div className="space-y-3">
                    <FormCheckboxRadio
                      type="checkbox"
                      label="Enable email notifications"
                      {...registerNotify('emailNotifications')}
                    />
                    
                    <FormCheckboxRadio
                      type="checkbox"
                      label="Low stock alerts"
                      {...registerNotify('lowStockAlerts')}
                    />
                    
                    <FormCheckboxRadio
                      type="checkbox"
                      label="New order notifications"
                      {...registerNotify('orderNotifications')}
                    />
                    
                    <FormCheckboxRadio
                      type="checkbox"
                      label="System updates and maintenance"
                      {...registerNotify('systemUpdates')}
                    />
                  </div>
                </div>
                
                <div className="border border-border rounded-md p-4">
                  <h4 className="font-medium mb-4">Report Notifications</h4>
                  <div className="space-y-3">
                    <FormCheckboxRadio
                      type="checkbox"
                      label="Daily sales reports"
                      {...registerNotify('dailyReports')}
                    />
                    
                    <FormCheckboxRadio
                      type="checkbox"
                      label="Weekly summary reports"
                      {...registerNotify('weeklyReports')}
                    />
                    
                    <FormCheckboxRadio
                      type="checkbox"
                      label="Monthly financial reports"
                      {...registerNotify('monthlyReports')}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Backup Settings Tab */}
          {activeTab === 2 && (
            <form onSubmit={handleSubmitBackup(onSaveBackupSettings)}>
              <div className="space-y-6">
                <div className="border border-border rounded-md p-4">
                  <div className="flex items-center mb-4">
                    <FormCheckboxRadio
                      type="checkbox"
                      label="Enable automatic backups"
                      {...registerBackup('autoBackup')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Backup Frequency"
                      name="backupFrequency"
                      control={controlBackup}
                      options={[
                        { label: 'Daily', value: 'daily' },
                        { label: 'Weekly', value: 'weekly' },
                        { label: 'Monthly', value: 'monthly' },
                      ]}
                      error={errorsBackup.backupFrequency?.message}
                    />
                    
                    <FormInput
                      label="Backup Time (24h)"
                      type="time"
                      {...registerBackup('backupTime')}
                      error={errorsBackup.backupTime?.message}
                    />
                    
                    <FormInput
                      label="Retention Period (days)"
                      type="number"
                      min="1"
                      {...registerBackup('backupRetention')}
                      error={errorsBackup.backupRetention?.message}
                    />
                  </div>
                </div>
                
                <div className="border border-border rounded-md p-4">
                  <h4 className="font-medium mb-4">Storage Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormSelect
                        label="Backup Location"
                        name="backupLocation"
                        control={controlBackup}
                        options={[
                          { label: 'Local Storage', value: 'local' },
                          { label: 'Cloud Storage', value: 'cloud' },
                        ]}
                        error={errorsBackup.backupLocation?.message}
                      />
                    </div>
                    
                    {backupLocation === 'cloud' && (
                      <>
                        <div className="md:col-span-2">
                          <FormSelect
                            label="Cloud Provider"
                            name="cloudProvider"
                            control={controlBackup}
                            options={[
                              { label: 'Amazon S3', value: 's3' },
                              { label: 'Google Cloud Storage', value: 'gcs' },
                              { label: 'Microsoft Azure', value: 'azure' },
                            ]}
                            error={errorsBackup.cloudProvider?.message}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <FormInput
                            label="Bucket Name"
                            {...registerBackup('bucketName')}
                            error={errorsBackup.bucketName?.message}
                          />
                        </div>
                        
                        <FormInput
                          label="Access Key"
                          {...registerBackup('accessKey')}
                          error={errorsBackup.accessKey?.message}
                        />
                        
                        <FormInput
                          label="Secret Key"
                          type="password"
                          {...registerBackup('secretKey')}
                          error={errorsBackup.secretKey?.message}
                        />
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Backup Settings'}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* API Keys Tab */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {newlyCreatedKey && (
                <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">New API Key Created</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Your new API key for "{newlyCreatedKey.name}" has been created. Please copy this key now as it won't be shown again.
                  </p>
                  <div className="flex items-center p-2 bg-white border border-green-200 rounded">
                    <code className="text-sm font-mono text-green-900 flex-1 break-all">
                      {newlyCreatedKey.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(newlyCreatedKey.key);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Make sure to store this key securely. For security, we won't show it again.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">API Keys</h4>
                <Button 
                  size="sm"
                  onClick={() => setShowNewKeyForm(true)}
                  disabled={showNewKeyForm}
                >
                  <Plus size={16} className="mr-2" />
                  Create New API Key
                </Button>
              </div>
              
              {showNewKeyForm && (
                <div className="p-4 mb-4 border border-border rounded-md bg-muted/10">
                  <h4 className="font-medium mb-3">Create New API Key</h4>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., POS Integration"
                        className="w-full px-3 py-2 border border-input rounded-md"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewKeyForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateApiKey}
                        disabled={!newKeyName.trim()}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">API Key</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Last Used</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="border-b border-border hover:bg-muted/5">
                        <td className="px-4 py-3 font-medium">
                          {key.name}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <div className="flex items-center">
                            {showKeyValues[key.id] ? (
                              <span className="mr-2">{key.key}</span>
                            ) : (
                              <span className="mr-2">••••••••••••••••</span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleShowKey(key.id)}
                              title={showKeyValues[key.id] ? 'Hide Key' : 'Show Key'}
                            >
                              {showKeyValues[key.id] ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(key.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(key.lastUsed)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteKey(key.id)}
                            title="Delete Key"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {apiKeys.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                          No API keys found. Create one to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  API keys allow external applications to access ZBase through the API. 
                  Treat them like passwords and never share them in public repositories or client-side code.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
