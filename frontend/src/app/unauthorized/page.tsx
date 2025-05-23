'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case UserRole.ADMIN:
        case UserRole.MANAGER:
          router.push('/admin/dashboard');
          break;
        case UserRole.CASHIER:
          router.push('/pos/sales');
          break;
        case UserRole.INVENTORY:
          router.push('/admin/inventory');
          break;
        default:
          router.push('/');
          break;
      }
    } else {
      // Not authenticated
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-red-600 mb-2">403</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-8">
            Bạn không có đủ quyền hạn để truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cần hỗ trợ.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <button
              onClick={goBack}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Quay lại
            </button>
            <button
              onClick={goHome}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
