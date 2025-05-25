'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Facebook, 
  Settings, 
  ShoppingCart, 
  FileText, 
  Users, 
  TrendingUp,
  BarChart3,
  ArrowRight,
  Activity,
  Star,
  Clock,
  Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  const mainModules = [
    {
      title: 'Facebook Marketing',
      description: 'Quản lý campaigns, posts và tương tác với khách hàng trên Facebook',
      link: '/facebook',
      icon: Facebook,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      stats: 'Kết nối với 5 trang',
      trend: '+12%',
      description2: 'Tối ưu hóa quảng cáo và tương tác khách hàng'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Quản lý người dùng, vai trò, cấu hình và thiết lập hệ thống',
      link: '/settings',
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      stats: '12 người dùng hoạt động',
      trend: '+3%',
      description2: 'Cấu hình và tùy chỉnh hệ thống'
    },
    {
      title: 'Hệ thống POS',
      description: 'Quản lý bán hàng, thanh toán và báo cáo tại điểm bán',
      link: '/pos',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      stats: '3 điểm bán hoạt động',
      trend: '+8%',
      description2: 'Xử lý giao dịch và thanh toán'
    },
    {
      title: 'Quản lý nội dung',
      description: 'Tạo và quản lý bài viết, tin tức và nội dung marketing',
      link: '/admin',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      stats: '25 bài viết đã xuất bản',
      trend: '+15%',
      description2: 'Quản lý sản phẩm và nội dung'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              Bảng điều khiển
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Trung tâm quản lý toàn bộ hệ thống ZBase</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Hệ thống hoạt động</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Cập nhật: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-orange-600" />
              Các module chính
            </h2>
            <p className="text-gray-600 mt-2">Truy cập nhanh vào các chức năng chính của hệ thống</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Được sử dụng nhiều nhất</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mainModules.map((module, index) => (
            <Card 
              key={index} 
              className={`group bg-white/90 backdrop-blur-sm ${module.borderColor} hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden relative`}
              onClick={() => router.push(module.link)}
            >
              {/* Gradient top border */}
              <div className={`h-3 bg-gradient-to-r ${module.color}`}></div>
              
              {/* Background pattern */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${module.bgColor} rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${module.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-md border border-white/50`}>
                    <module.icon className={`w-10 h-10 text-transparent bg-gradient-to-br ${module.color} bg-clip-text`} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${module.color.includes('blue') ? 'text-blue-600' : module.color.includes('orange') ? 'text-orange-600' : module.color.includes('green') ? 'text-green-600' : 'text-purple-600'} bg-white/80 px-2 py-1 rounded-full text-xs`}>
                      {module.trend}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors mb-3">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed text-base mb-2">
                  {module.description}
                </CardDescription>
                <p className="text-sm text-gray-500 italic">{module.description2}</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                    <p className="font-semibold text-gray-700">{module.stats}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 group-hover:bg-orange-100 transition-all font-semibold"
                  >
                    Truy cập ngay
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>      {/* Quick Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
          Thống kê nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hiệu suất hệ thống</h3>
              <p className="text-3xl font-bold text-orange-600 mb-2">98.5%</p>
              <p className="text-sm text-gray-600">Uptime trong 30 ngày qua</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Người dùng hoạt động</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">24</p>
              <p className="text-sm text-gray-600">Trong 24 giờ qua</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tổng giao dịch</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">1,245</p>
              <p className="text-sm text-gray-600">Trong tháng này</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-orange-600" />
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => router.push('/reports')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Báo cáo</h3>
                  <p className="text-sm text-gray-600">Xem báo cáo chi tiết</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => router.push('/customers')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Khách hàng</h3>
                  <p className="text-sm text-gray-600">Quản lý khách hàng</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => router.push('/inventory')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Kho hàng</h3>
                  <p className="text-sm text-gray-600">Quản lý tồn kho</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
