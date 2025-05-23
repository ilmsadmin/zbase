import React from 'react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 mt-10 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
              Quản lý bán hàng <span className="text-primary">hiện đại</span> và tiện lợi
            </h1>
            <p className="text-xl text-gray-600">
              ZBase cung cấp giải pháp toàn diện cho việc quản lý hàng tồn kho, bán hàng và khách hàng của bạn. Tất cả trong một nền tảng duy nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/demo" className="px-6 py-3 bg-primary text-white rounded-lg font-medium text-center hover:bg-primary/90">
                Dùng thử miễn phí
              </a>
              <a href="/contact" className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50">
                Liên hệ tư vấn
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg aspect-video">
              {/* Placeholder for hero image */}
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-gray-500">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Tính năng nổi bật</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              ZBase cung cấp đầy đủ các tính năng cần thiết giúp việc quản lý và bán hàng trở nên dễ dàng hơn bao giờ hết
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Quản lý kho hàng',
                description: 'Theo dõi hàng tồn kho theo thời gian thực. Nhập xuất kho dễ dàng với các báo cáo chi tiết.',
              },
              {
                title: 'Bán hàng POS',
                description: 'Giao diện bán hàng hiện đại, dễ sử dụng với khả năng làm việc offline và hỗ trợ máy quét mã vạch.',
              },
              {
                title: 'Quản lý khách hàng',
                description: 'Theo dõi thông tin và lịch sử mua hàng của khách hàng. Phân nhóm và áp dụng các chính sách giá khác nhau.',
              },
              {
                title: 'Báo cáo & Phân tích',
                description: 'Báo cáo chi tiết về doanh thu, lợi nhuận, xu hướng bán hàng và hiệu suất cửa hàng.',
              },
              {
                title: 'Quản lý bảo hành',
                description: 'Theo dõi bảo hành sản phẩm, lịch sử sửa chữa và thông báo khi hết hạn bảo hành.',
              },
              {
                title: 'Tích hợp đa nền tảng',
                description: 'Dễ dàng tích hợp với các nền tảng bán hàng trực tuyến, hệ thống kế toán và các công cụ khác.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '1000+', label: 'Khách hàng hài lòng' },
              { number: '50+', label: 'Tính năng' },
              { number: '24/7', label: 'Hỗ trợ kỹ thuật' },
              { number: '99.9%', label: 'Thời gian hoạt động' },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng để nâng cấp việc quản lý bán hàng?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Bắt đầu dùng thử ZBase ngay hôm nay và khám phá cách chúng tôi có thể giúp doanh nghiệp của bạn phát triển.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-6 py-3 bg-primary text-white rounded-lg font-medium text-center hover:bg-primary/90">
              Đăng ký ngay
            </a>
            <a href="/demo" className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50">
              Xem demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}