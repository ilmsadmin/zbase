'use client';

import { useState, useEffect } from 'react';
import POSLayout from '@/components/layouts/POSLayout';
import { 
  UserIcon,
  KeyIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  lastLogin: string;
}

export default function POSAccountPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch from an API
      // For now we'll use mock data
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@zbase.example',
          phone: '0901234567',
          role: 'POS Operator',
          department: 'Sales',
          lastLogin: '2025-05-21T08:30:00Z',
        };
        
        setProfile(mockProfile);
        setLoading(false);
      }, 800);
      
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      setError(err.message || 'Failed to load user profile');
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Basic validation
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // In a real implementation, this would call an API endpoint
    // For demo purposes, we'll just show a success message
    setTimeout(() => {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangePasswordMode(false);
    }, 1000);
  };

  if (loading) {
    return (
      <POSLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </POSLayout>
    );
  }

  if (error) {
    return (
      <POSLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadUserProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </POSLayout>
    );
  }

  return (
    <POSLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Tài khoản của tôi</h1>
        
        {passwordSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Mật khẩu đã được thay đổi thành công</h3>
              <p className="text-sm text-green-600 mt-1">Mật khẩu mới của bạn đã được cập nhật.</p>
            </div>
          </div>
        )}
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile?.name}</h2>
                <p className="text-gray-500">{profile?.role} • {profile?.department}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{profile?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p>{profile?.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Chi nhánh</p>
                  <p>{profile?.department || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <KeyIcon className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
            </div>
            
            {!changePasswordMode && (
              <button
                onClick={() => setChangePasswordMode(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Thay đổi
              </button>
            )}
          </div>
          
          {changePasswordMode ? (
            <div className="p-6">
              <form onSubmit={handlePasswordChange}>
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 8 kí tự</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPasswordError(null);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-500">Mật khẩu của bạn được sử dụng để đăng nhập vào hệ thống. Hãy thay đổi mật khẩu định kỳ để đảm bảo an toàn.</p>
            </div>
          )}
        </div>
      </div>
    </POSLayout>
  );
}
