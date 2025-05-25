"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserAvatar } from '@/components/ui/ImageWithFallback';

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = async () => {
    await logout();
    closeMenu();
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <UserAvatar
          src={user?.profileImage}
          alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
          className="w-8 h-8"
          size="small"
          initials={user?.firstName?.charAt(0) || 'U'}
        />        <span className="text-sm font-medium text-gray-700">{user?.firstName || 'Người dùng'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
            <Link 
            href="/admin/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            onClick={closeMenu}
          >
            Hồ sơ
          </Link>
          
          <Link 
            href="/admin/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            onClick={closeMenu}
          >
            Cài đặt
          </Link>
          
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};
