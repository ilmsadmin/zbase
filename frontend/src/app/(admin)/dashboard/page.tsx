import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Tổng Doanh Thu</h3>
          <p className="text-3xl font-bold text-primary">120,500,000₫</p>
          <p className="text-sm text-muted-foreground mt-2">Tăng 8% so với tháng trước</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Đơn Hàng Mới</h3>
          <p className="text-3xl font-bold text-primary">56</p>
          <p className="text-sm text-muted-foreground mt-2">24 đơn hàng trong hôm nay</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Khách Hàng</h3>
          <p className="text-3xl font-bold text-primary">890</p>
          <p className="text-sm text-muted-foreground mt-2">12 khách hàng mới trong tuần</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Tồn Kho</h3>
          <p className="text-3xl font-bold text-destructive">5</p>
          <p className="text-sm text-muted-foreground mt-2">Sản phẩm sắp hết hàng</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Doanh Thu Theo Tháng</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Sản Phẩm Bán Chạy</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Sản phẩm {item}</p>
                  <p className="text-sm text-muted-foreground">Đã bán: {Math.floor(Math.random() * 100)} sản phẩm</p>
                </div>
                <p className="font-medium">{Math.floor(Math.random() * 10000000)}₫</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
