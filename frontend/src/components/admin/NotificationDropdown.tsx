"use client";

import React, { useState } from 'react';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
    // Sample notifications data - in a real app, this would come from an API
  const notifications = [
    {
      id: 1,
      title: 'Cảnh báo hàng tồn kho thấp',
      description: 'Sản phẩm "iPhone 13 Pro" sắp hết hàng.',
      time: '10 phút trước',
      unread: true,
      type: 'alert'
    },
    {
      id: 2,
      title: 'Đơn hàng mới',
      description: 'Đơn hàng #12345 đã được đặt bởi John Smith.',
      time: '1 giờ trước',
      unread: true,
      type: 'order'
    },
    {
      id: 3,
      title: 'Thanh toán thành công',
      description: 'Thanh toán cho hóa đơn #INV-001 đã được xử lý.',
      time: '3 giờ trước',
      unread: false,
      type: 'payment'
    },
    {
      id: 4,
      title: 'Cập nhật hệ thống',
      description: 'Hệ thống đã được cập nhật lên phiên bản 2.4.0',
      time: 'Hôm qua',
      unread: false,
      type: 'system'
    }
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-orange-500 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-orange-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">            <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
            <button className="text-xs text-orange-500 hover:text-orange-700">Đánh dấu tất cả đã đọc</button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (              <div className="px-4 py-6 text-center text-gray-500">
                <p>Không có thông báo</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-orange-50 ${notification.unread ? 'bg-orange-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="ml-2 flex-shrink-0">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
            <div className="px-4 py-2 border-t border-gray-100 text-center">
            <button className="text-sm text-orange-500 hover:text-orange-700">Xem tất cả thông báo</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions to get appropriate icons and colors for notification types
function getNotificationIcon(type: string) {
  switch (type) {
    case 'alert':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      );
    case 'order':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case 'payment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      );
    case 'system':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      );
  }
}

function getIconBgColor(type: string) {
  switch (type) {
    case 'alert':
      return 'bg-red-500';
    case 'order':
      return 'bg-blue-500';
    case 'payment':
      return 'bg-green-500';
    case 'system':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
}
