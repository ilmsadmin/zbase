"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { NotificationDropdown } from './NotificationDropdown';

export const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              ZBase
            </span>
            <span className="ml-2 text-sm text-gray-600 font-medium">Admin</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="h-10 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <NotificationDropdown />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
