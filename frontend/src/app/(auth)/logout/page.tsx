'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { deleteCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function performLogout() {
      try {
        // Call the logout function from auth hook
        await logout();
        
        // Make sure cookies are cleared
        deleteCookie('auth_token');

        // Redirect to login page
        router.push('/login');
      } catch (error) {
        
        // Even if there's an error with the API call, still clear local storage and cookies
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
        deleteCookie('auth_token');
        
        alert('Đã xảy ra lỗi khi đăng xuất, nhưng bạn đã được đăng xuất khỏi hệ thống.');
        
        // Redirect to login page
        router.push('/login');
      }
    }
    
    performLogout();
  }, [logout, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-orange-500 rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-bold mb-2">Đang đăng xuất...</h1>
        <p className="text-gray-600 mb-4">Vui lòng đợi trong khi hệ thống đăng xuất tài khoản của bạn.</p>
      </div>
    </div>
  );
}
