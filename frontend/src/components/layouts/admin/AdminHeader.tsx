import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userInfo = {
    name: 'Nguyễn Văn A',
    email: 'admin@example.com',
    role: 'Admin',
    avatar: '/avatar-placeholder.png'
  };
  
  const notifications = [
    {
      id: '1',
      title: 'Đơn hàng mới #123456',
      message: 'Có đơn hàng mới vừa được tạo',
      time: '5 phút trước',
      unread: true
    },
    {
      id: '2',
      title: 'Kho hàng cảnh báo',
      message: 'Sản phẩm A sắp hết hàng',
      time: '3 giờ trước',
      unread: true
    },
    {
      id: '3',
      title: 'Báo cáo đã sẵn sàng',
      message: 'Báo cáo tháng đã được tạo',
      time: '1 ngày trước',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full bg-white shadow-sm">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-800">Hệ Thống Quản Lý Bán Hàng</h2>
            <p className="text-xs text-gray-500">ZBase Management System</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notification Dropdown */}
          <div className="relative">
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
            >
              <BellIcon className="h-6 w-6" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">Thông báo</h3>
                    <Link href="/admin/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                      Xem tất cả
                    </Link>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                        {notification.unread && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <Link 
            href="/admin/settings" 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <Cog6ToothIcon className="h-6 w-6" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center p-2 hover:bg-gray-100 rounded-full"
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
            >
              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                {userInfo.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    alt="User Avatar"
                    width={32}
                    height={32}
                  />
                ) : (
                  <UserIcon className="h-full w-full p-1 text-gray-500" />
                )}
              </div>
            </button>
            
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">{userInfo.name}</p>
                  <p className="text-xs text-gray-500">{userInfo.email}</p>
                  <div className="mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      {userInfo.role}
                    </span>
                  </div>
                </div>
                
                <div className="py-1">
                  <Link 
                    href="/admin/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon className="h-4 w-4 mr-2" /> Thông tin cá nhân
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-2" /> Cài đặt hệ thống
                  </Link>
                </div>
                
                <div className="py-1 border-t border-gray-200">
                  <Link 
                    href="/auth/logout" 
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" /> Đăng xuất
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
