'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const settingGroups = [
    {
      title: 'Quản lý người dùng',
      description: 'Quản lý người dùng hệ thống, phân quyền và kiểm soát truy cập',
      link: '/settings/users',
      icon: '👥',
    },
    {
      title: 'Quản lý vai trò',
      description: 'Định nghĩa vai trò và quản lý quyền hạn trong toàn hệ thống',
      link: '/settings/roles',
      icon: '🔑',
    },
    {
      title: 'Cài đặt công ty',
      description: 'Quản lý thông tin công ty, logo, thuế và cài đặt tiền tệ',
      link: '/settings/company',
      icon: '🏢',
    },
    {
      title: 'Cấu hình hệ thống',
      description: 'Cấu hình email, thông báo, sao lưu và khóa API',
      link: '/settings/system',
      icon: '⚙️',
    },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Bảng điều khiển cài đặt</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingGroups.map((group) => (
          <div 
            key={group.title}
            className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start mb-4">
              <span className="text-3xl mr-4">{group.icon}</span>
              <div>
                <h3 className="text-lg font-medium">{group.title}</h3>
                <p className="text-muted-foreground">{group.description}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-2 w-full flex justify-between items-center"
              onClick={() => router.push(group.link)}
            >
              <span>Xem cài đặt</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
