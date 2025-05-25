'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/user/ProfileComponent';
import { UserRole } from '@/types';

export default function AdminProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  // Safety check, although ProtectedRoute also handles this
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Validate if user has permission to access this page
    if (user && ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, router, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
        </div>
        <ProfileComponent />
      </div>
    </div>
  );
}
