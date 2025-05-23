'use client';

import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';

export default function ProfileComponent() {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Thông tin tài khoản</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-500">Chi tiết cá nhân</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Họ và tên:</span>
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vai trò:</span>
              <span className="capitalize">{user.role.toLowerCase()}</span>
            </div>
          </div>
        </div>
        
        <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
          <div>
            <h3 className="font-medium text-gray-500">Thông tin bảo mật</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mật khẩu:</span>
                <button className="text-blue-600 hover:text-blue-800">Đổi mật khẩu</button>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Xác thực 2 yếu tố:</span>
                <span className="text-red-500">Chưa kích hoạt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lần đăng nhập gần nhất:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </PermissionGuard>
      </div>

      <PermissionGuard requiredRoles={[UserRole.ADMIN]}>
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium text-gray-500">Cài đặt nâng cao</h3>
          <div className="mt-4 flex flex-col space-y-2">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md text-sm">
              Quản lý quyền hạn
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm">
              Xóa tài khoản
            </button>
          </div>
        </div>
      </PermissionGuard>
    </div>
  );
}
