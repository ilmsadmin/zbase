'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Edit, 
  Key, 
  Calendar,
  MapPin,
  Phone,
  Camera,
  Save,
  X
} from 'lucide-react';

export default function ProfileComponent() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    location: ''
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-500">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inventory': return 'bg-green-100 text-green-800 border-green-200';
      case 'cashier': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'manager': return '🏢';
      case 'inventory': return '📦';
      case 'cashier': return '💰';
      default: return '👤';
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: '',
      location: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-orange-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role || '')}`}>
                    <span className="mr-1">{getRoleIcon(user.role || '')}</span>
                    {user.role ? user.role.toUpperCase() : 'CHƯA XÁC ĐỊNH'}
                  </div>
                  <div className="flex items-center text-orange-100">
                    <Mail size={16} className="mr-1" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 transition-colors flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 text-orange-500" size={20} />
              Thông tin cá nhân
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.firstName}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.lastName}</div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {editData.phone || 'Chưa cập nhật'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {editData.location || 'Chưa cập nhật'}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <X size={16} />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security & Settings Sidebar */}
        <div className="space-y-6">
          {/* Security Settings */}
          <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]} fallback={null}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <Shield className="mr-2 text-green-500" size={20} />
                Bảo mật
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mật khẩu</p>
                    <p className="text-sm text-gray-600">Đổi mật khẩu định kỳ</p>
                  </div>
                  <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center">
                    <Key size={14} className="mr-1" />
                    Đổi
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Xác thực 2 yếu tố</p>
                    <p className="text-sm text-red-600">Chưa kích hoạt</p>
                  </div>
                  <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                    Kích hoạt
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Đăng nhập gần nhất</p>
                      <p className="text-sm text-gray-600">{new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGuard>

          {/* Admin Settings */}
          <PermissionGuard requiredRoles={[UserRole.ADMIN]} fallback={null}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <Settings className="mr-2 text-purple-500" size={20} />
                Cài đặt nâng cao
              </h3>
              
              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-center">
                    <Shield size={16} className="mr-2" />
                    Quản lý quyền hạn
                  </div>
                </button>
                
                <button className="w-full p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-center">
                    <X size={16} className="mr-2" />
                    Xóa tài khoản
                  </div>
                </button>
              </div>
            </div>
          </PermissionGuard>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê nhanh</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tài khoản được tạo</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cập nhật gần nhất</span>
                <span className="font-medium">{new Date(user.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
