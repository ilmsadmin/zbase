import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${inter.className}`}>
      {/* Branding section - Left side */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 hidden md:flex md:w-1/2 p-8 text-white flex-col justify-between overflow-hidden relative">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 rounded-full bg-white top-0 -left-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-white bottom-10 right-10"></div>
          <div className="absolute w-40 h-40 rounded-full bg-white top-1/2 left-1/3"></div>
        </div>
        
        <div className="flex items-center mb-8 relative z-10">
          <div className="text-3xl font-bold">ZBase</div>
        </div>
        
        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-6">Hệ thống quản lý bán hàng toàn diện</h1>
            <p className="text-lg mb-8">
              Giải pháp quản lý kho hàng, bán hàng và phân tích dữ liệu hiệu quả dành cho doanh nghiệp của bạn.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-bold mb-1">500+</div>
                <div className="text-sm">Doanh nghiệp tin dùng</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-bold mb-1">24/7</div>
                <div className="text-sm">Hỗ trợ kỹ thuật</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-bold mb-1">99.9%</div>
                <div className="text-sm">Thời gian hoạt động</div>              </div>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-75 relative z-10">
          © {new Date().getFullYear()} ZBase. All rights reserved.
        </div>
      </div>

      {/* Auth form - Right side */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-orange-50 to-white">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
