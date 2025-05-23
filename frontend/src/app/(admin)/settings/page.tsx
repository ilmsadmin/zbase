'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const settingGroups = [
    {
      title: 'User Management',
      description: 'Manage system users, assign roles, and control access',
      link: '/admin/settings/users',
      icon: '👥',
    },
    {
      title: 'Role Management',
      description: 'Define roles and manage permissions across the system',
      link: '/admin/settings/roles',
      icon: '🔑',
    },
    {
      title: 'Company Settings',
      description: 'Manage company information, logo, tax and currency settings',
      link: '/admin/settings/company',
      icon: '🏢',
    },
    {
      title: 'System Configuration',
      description: 'Configure email, notifications, backups and API keys',
      link: '/admin/settings/system',
      icon: '⚙️',
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Settings Dashboard</h2>
      
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
              <span>View Settings</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
