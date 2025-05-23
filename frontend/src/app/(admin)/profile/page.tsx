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
    <div>
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của bạn</h1>
      <ProfileComponent />
    </div>
  );
}
