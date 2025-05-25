'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react';

// Schema for email settings form
const emailSettingsSchema = z.object({
  emailProvider: z.enum(['smtp', 'mailgun', 'sendgrid']),
  fromEmail: z.string().email('Định dạng email không hợp lệ'),
  fromName: z.string().min(1, 'Tên người gửi là bắt buộc'),
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
  const emailMethods = useForm({
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
  const notificationMethods = useForm({
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
  const backupMethods = useForm({
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

  const emailProvider = emailMethods.watch('emailProvider');
  const backupLocation = backupMethods.watch('backupLocation');
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
    if (!dateString) return 'Chưa bao giờ';
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
        <h2 className="text-xl font-semibold">Cấu hình hệ thống</h2>
      </div>

      <div className="bg-card border border-border rounded-md">
        <div className="border-b border-border">
          <nav className="flex -mb-px">
            {['Cài đặt Email', 'Tùy chọn thông báo', 'Cài đặt sao lưu', 'Khóa API'].map((tab, index) => (
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
        </div>        <div className="p-6">
          {/* Email Settings Tab */}
          {activeTab === 0 && (
            <FormProvider {...emailMethods}>
              <form onSubmit={emailMethods.handleSubmit(onSaveEmailSettings)}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormSelect
                        label="Nhà cung cấp Email"
                        name="emailProvider"
                        options={[
                          { label: 'Máy chủ SMTP', value: 'smtp' },
                          { label: 'Mailgun', value: 'mailgun' },
                          { label: 'SendGrid', value: 'sendgrid' },
                        ]}
                      />
                    </div>
                    
                    <FormInput
                      label="Email người gửi"
                      name="fromEmail"
                    />
                    
                    <FormInput
                      label="Tên người gửi"
                      name="fromName"
                    />
                  </div>

                  {emailProvider === 'smtp' && (
                    <div className="border border-border rounded-md p-4 bg-muted/10 mt-4">
                      <h4 className="font-medium mb-4">Cài đặt SMTP</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Máy chủ SMTP"
                          name="smtpHost"
                        />
                        
                        <FormInput
                          label="Cổng SMTP"
                          name="smtpPort"
                        />
                        
                        <FormInput
                          label="Tên đăng nhập SMTP"
                          name="smtpUsername"
                        />
                        
                        <FormInput
                          label="Mật khẩu SMTP"
                          type="password"
                          name="smtpPassword"
                        />
                        
                        <div className="md:col-span-2">
                          <FormSelect
                            label="Mã hóa"
                            name="smtpEncryption"
                            options={[
                              { label: 'Không có', value: 'none' },
                              { label: 'TLS', value: 'tls' },
                              { label: 'SSL', value: 'ssl' },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(emailProvider === 'mailgun' || emailProvider === 'sendgrid') && (
                    <div className="border border-border rounded-md p-4 bg-muted/10">
                      <h4 className="font-medium mb-4">Cài đặt API {emailProvider === 'mailgun' ? 'Mailgun' : 'SendGrid'}</h4>
                      <FormInput
                        label="Khóa API"
                        type="password"
                        name="apiKey"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt Email'}
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          )}          {/* Notification Preferences Tab */}
          {activeTab === 1 && (
            <FormProvider {...notificationMethods}>
              <form onSubmit={notificationMethods.handleSubmit(onSaveNotificationSettings)}>
                <div className="space-y-6">
                  <div className="border border-border rounded-md p-4">
                    <h4 className="font-medium mb-4">Thông báo hệ thống</h4>
                    <div className="space-y-3">
                      <FormCheckbox
                        name="emailNotifications"
                        label="Bật thông báo email"
                      />
                      
                      <FormCheckbox
                        name="lowStockAlerts"
                        label="Cảnh báo hàng tồn kho thấp"
                      />
                      
                      <FormCheckbox
                        name="orderNotifications"
                        label="Thông báo đơn hàng mới"
                      />
                      
                      <FormCheckbox
                        name="systemUpdates"
                        label="Cập nhật hệ thống và bảo trì"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-md p-4">
                    <h4 className="font-medium mb-4">Thông báo báo cáo</h4>
                    <div className="space-y-3">
                      <FormCheckbox
                        name="dailyReports"
                        label="Báo cáo bán hàng hàng ngày"
                      />
                      
                      <FormCheckbox
                        name="weeklyReports"
                        label="Báo cáo tổng kết hàng tuần"
                      />
                      
                      <FormCheckbox
                        name="monthlyReports"
                        label="Báo cáo tài chính hàng tháng"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt thông báo'}
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          )}          {/* Backup Settings Tab */}
          {activeTab === 2 && (
            <FormProvider {...backupMethods}>
              <form onSubmit={backupMethods.handleSubmit(onSaveBackupSettings)}>
                <div className="space-y-6">
                  <div className="border border-border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <FormCheckbox
                        name="autoBackup"
                        label="Bật sao lưu tự động"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormSelect
                        label="Tần suất sao lưu"
                        name="backupFrequency"
                        options={[
                          { label: 'Hàng ngày', value: 'daily' },
                          { label: 'Hàng tuần', value: 'weekly' },
                          { label: 'Hàng tháng', value: 'monthly' },
                        ]}
                      />
                      
                      <FormInput
                        label="Thời gian sao lưu (24h)"
                        type="time"
                        name="backupTime"
                      />
                      
                      <FormInput
                        label="Thời gian lưu trữ (ngày)"
                        type="number"
                        min="1"
                        name="backupRetention"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-md p-4">
                    <h4 className="font-medium mb-4">Vị trí lưu trữ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <FormSelect
                          label="Vị trí sao lưu"
                          name="backupLocation"
                          options={[
                            { label: 'Lưu trữ cục bộ', value: 'local' },
                            { label: 'Lưu trữ đám mây', value: 'cloud' },
                          ]}
                        />
                      </div>
                      
                      {backupLocation === 'cloud' && (
                        <>
                          <div className="md:col-span-2">
                            <FormSelect
                              label="Nhà cung cấp đám mây"
                              name="cloudProvider"
                              options={[
                                { label: 'Amazon S3', value: 's3' },
                                { label: 'Google Cloud Storage', value: 'gcs' },
                                { label: 'Microsoft Azure', value: 'azure' },
                              ]}
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <FormInput
                              label="Tên bucket"
                              name="bucketName"
                            />
                          </div>
                          
                          <FormInput
                            label="Khóa truy cập"
                            name="accessKey"
                          />
                          
                          <FormInput
                            label="Khóa bí mật"
                            type="password"
                            name="secretKey"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt sao lưu'}
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          )}          {/* API Keys Tab */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {newlyCreatedKey && (
                <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">Khóa API mới đã được tạo</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Khóa API mới cho "{newlyCreatedKey.name}" đã được tạo. Vui lòng sao chép khóa này ngay vì nó sẽ không được hiển thị lại.
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
                      Sao chép
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Hãy đảm bảo lưu trữ khóa này an toàn. Vì lý do bảo mật, chúng tôi sẽ không hiển thị lại.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Khóa API</h4>
                <Button 
                  size="sm"
                  onClick={() => setShowNewKeyForm(true)}
                  disabled={showNewKeyForm}
                >
                  <Plus size={16} className="mr-2" />
                  Tạo khóa API mới
                </Button>
              </div>
              
              {showNewKeyForm && (
                <div className="p-4 mb-4 border border-border rounded-md bg-muted/10">
                  <h4 className="font-medium mb-3">Tạo khóa API mới</h4>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Tên khóa
                      </label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="VD: Tích hợp POS"
                        className="w-full px-3 py-2 border border-input rounded-md"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewKeyForm(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleCreateApiKey}
                        disabled={!newKeyName.trim()}
                      >
                        Tạo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Tên</th>
                      <th className="px-4 py-3">Khóa API</th>
                      <th className="px-4 py-3">Ngày tạo</th>
                      <th className="px-4 py-3">Lần sử dụng cuối</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
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
                              title={showKeyValues[key.id] ? 'Ẩn khóa' : 'Hiện khóa'}
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
                            title="Xóa khóa"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {apiKeys.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                          Không tìm thấy khóa API nào. Tạo một khóa để bắt đầu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Khóa API cho phép các ứng dụng bên ngoài truy cập ZBase thông qua API. 
                  Hãy coi chúng như mật khẩu và không bao giờ chia sẻ chúng trong kho lưu trữ công khai hoặc mã phía máy khách.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
