'use client';

import React from 'react';
import { useInView } from '@/lib/animations';
import { CounterAnimation, StaticCounter } from '@/components/ui/CounterAnimation';
import { TestimonialCarousel, type Testimonial } from '@/components/ui/TestimonialCarousel';
import { ContactForm } from '@/components/ui/ContactForm';
import { ArrowRight, Check, ChevronRight, Warehouse, ShoppingCart, Users, BarChart, Shield, Plug } from 'lucide-react';
import Link from 'next/link';

// Hero Content Component with Animation
function HeroContent() {
  const { ref, isInView } = useInView();
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`space-y-6 ${
        isInView 
          ? 'opacity-100 translate-y-0 transition-all duration-1000 delay-300' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 tracking-tight">
        Quản lý bán hàng <span className="text-orange-500">hiện đại</span> và tiện lợi
      </h1>
      <p className="text-xl text-gray-600">
        ZBase cung cấp giải pháp toàn diện cho việc quản lý hàng tồn kho, bán hàng và khách hàng của bạn. Tất cả trong một nền tảng duy nhất.
      </p>
    </div>
  );
}

// Hero Image Component with Animation
function HeroImage() {
  const { ref, isInView } = useInView();
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`rounded-lg overflow-hidden shadow-2xl ${
        isInView 
          ? 'opacity-100 translate-x-0 transition-all duration-1000 delay-500' 
          : 'opacity-0 translate-x-20'
      }`}
    >
      <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/10 rounded-lg aspect-video p-4">
        <div className="h-full w-full rounded-lg bg-white overflow-hidden shadow-lg border border-orange-100">
          <img 
            src="/dashboard-preview.png" 
            alt="ZBase Dashboard Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML += `
                  <div class="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-8">
                    <div class="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-center">
                      <div class="flex items-center justify-between mb-4 bg-orange-50 p-2 rounded">
                        <div class="w-3 h-3 rounded-full bg-orange-300"></div>
                        <div class="w-3 h-3 rounded-full bg-orange-300"></div>
                        <div class="w-3 h-3 rounded-full bg-orange-300"></div>
                      </div>
                      <div class="flex justify-between mb-6">
                        <div class="h-6 bg-orange-200 rounded w-1/3"></div>
                        <div class="h-6 bg-orange-200 rounded w-1/4"></div>
                      </div>
                      <div class="space-y-3 mb-8">
                        <div class="h-4 bg-orange-100 rounded w-full"></div>
                        <div class="h-4 bg-orange-100 rounded w-5/6"></div>
                        <div class="h-4 bg-orange-100 rounded w-4/6"></div>
                      </div>
                      <p class="text-orange-500 text-lg font-medium">ZBase Dashboard</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Section Header Component with Animation
function SectionHeader({ title, description }: { title: string; description: string }) {
  const { ref, isInView } = useInView();
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`text-center ${
        isInView 
          ? 'opacity-100 translate-y-0 transition-all duration-1000' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}

// Feature Card Component with Animation
function FeatureCard({ icon, title, description, index }: { 
  icon: string; 
  title: string; 
  description: string; 
  index: number;
}) {
  const { ref, isInView } = useInView();
  const delay = 100 * (index % 3);
  
  // Render the appropriate icon based on the icon string
  const renderIcon = () => {
    switch (icon) {
      case 'warehouse':
        return <Warehouse className="h-8 w-8 text-orange-500" />;
      case 'shopping-cart':
        return <ShoppingCart className="h-8 w-8 text-orange-500" />;
      case 'users':
        return <Users className="h-8 w-8 text-orange-500" />;
      case 'bar-chart':
        return <BarChart className="h-8 w-8 text-orange-500" />;
      case 'shield':
        return <Shield className="h-8 w-8 text-orange-500" />;
      case 'plug':
        return <Plug className="h-8 w-8 text-orange-500" />;
      default:
        return <div className="h-8 w-8 bg-orange-100 rounded-full"></div>;
    }
  };
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`bg-white border border-orange-100 rounded-lg p-8 hover:shadow-lg hover:border-orange-200 transition-all ${
        isInView 
          ? `opacity-100 translate-y-0 transition-all duration-700 delay-${delay}` 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="mb-4 text-orange-500">
        {renderIcon()}
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="pt-4 mt-auto">
        <a href="#" className="text-orange-600 font-medium inline-flex items-center hover:underline">
          Tìm hiểu thêm <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// Testimonial Data
const testimonials: Testimonial[] = [
  {
    content: "ZBase đã giúp chúng tôi tối ưu hóa quy trình bán hàng và quản lý kho. Nhân viên có thể dễ dàng theo dõi tình trạng kho và tiếp nhận đơn hàng nhanh chóng.",
    author: "Nguyễn Văn A",
    role: "Giám đốc",
    company: "Shop ABC",
  },
  {
    content: "Hệ thống báo cáo của ZBase giúp tôi nắm bắt được tình hình kinh doanh mọi lúc, mọi nơi. Đặc biệt là tính năng POS làm việc offline rất hữu ích.",
    author: "Trần Thị B",
    role: "Quản lý",
    company: "Cửa hàng XYZ",
  },
  {
    content: "Chúng tôi đã thử nhiều phần mềm quản lý bán hàng khác nhau, nhưng ZBase là giải pháp toàn diện và dễ sử dụng nhất. Hỗ trợ kỹ thuật cũng rất nhanh chóng.",
    author: "Lê Văn C",
    role: "Chủ cửa hàng",
    company: "Shop MNP",
  },
];

// Define type for stats
interface StatItem {
  label: string;
  number?: number;
  value?: string;
  suffix?: string;
}

// Define type for benefit items
type BenefitItem = string;

export default function HomePage() {
  // Features array
  const features = [
    {
      icon: 'warehouse',
      title: 'Quản lý kho hàng',
      description: 'Theo dõi hàng tồn kho theo thời gian thực. Nhập xuất kho dễ dàng với các báo cáo chi tiết.',
    },
    {
      icon: 'shopping-cart',
      title: 'Bán hàng POS',
      description: 'Giao diện bán hàng hiện đại, dễ sử dụng với khả năng làm việc offline và hỗ trợ máy quét mã vạch.',
    },
    {
      icon: 'users',
      title: 'Quản lý khách hàng',
      description: 'Theo dõi thông tin và lịch sử mua hàng của khách hàng. Phân nhóm và áp dụng các chính sách giá khác nhau.',
    },
    {
      icon: 'bar-chart',
      title: 'Báo cáo & Phân tích',
      description: 'Báo cáo chi tiết về doanh thu, lợi nhuận, xu hướng bán hàng và hiệu suất cửa hàng.',
    },
    {
      icon: 'shield',
      title: 'Quản lý bảo hành',
      description: 'Theo dõi bảo hành sản phẩm, lịch sử sửa chữa và thông báo khi hết hạn bảo hành.',
    },
    {
      icon: 'plug',
      title: 'Tích hợp đa nền tảng',
      description: 'Dễ dàng tích hợp với các nền tảng bán hàng trực tuyến, hệ thống kế toán và các công cụ khác.',
    },
  ];

  // Stats array
  const stats: StatItem[] = [
    { number: 1000, suffix: '+', label: 'Khách hàng hài lòng' },
    { number: 50, suffix: '+', label: 'Tính năng' },
    { value: '24/7', label: 'Hỗ trợ kỹ thuật' },
    { number: 99.9, suffix: '%', label: 'Thời gian hoạt động' },
  ];

  // Benefits array
  const benefits: BenefitItem[] = [
    'Dùng thử miễn phí trong 14 ngày',
    'Không cần thông tin thẻ tín dụng',
    'Hỗ trợ kỹ thuật 24/7',
    'Dễ dàng chuyển đổi dữ liệu từ hệ thống cũ',
    'Đào tạo và hướng dẫn chi tiết',
  ];

  // Mock function for form submission
  const handleFormSubmit = (values: any) => {
    console.log('Form submitted:', values);
    // Process form submission logic would go here
  };

  return (
    <div>
      {/* Hero Section with enhanced animation */}
      <section className="bg-gradient-to-br from-white via-orange-50 to-orange-100 py-24 overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23FB923C\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center relative z-10">
          <div className="md:w-1/2 space-y-6 mt-10 md:mt-0">
            <HeroContent />
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="/demo" className="px-6 py-3 bg-orange-300 text-orange-900 rounded-lg font-medium text-center hover:bg-orange-400 transition-colors duration-300 shadow-lg shadow-orange-300/20 flex items-center justify-center group">
                Dùng thử miễn phí <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/contact" className="px-6 py-3 border border-orange-200 text-orange-800 rounded-lg font-medium text-center hover:bg-orange-50 transition-colors duration-300">
                Liên hệ tư vấn
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <HeroImage />
          </div>
        </div>
      </section>
      
      {/* Features Section with animation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title="Tính năng nổi bật" 
            description="ZBase cung cấp đầy đủ các tính năng cần thiết giúp việc quản lý và bán hàng trở nên dễ dàng hơn bao giờ hết"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, idx) => (
              <FeatureCard 
                key={idx} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                index={idx} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section with counter animations */}
      <section className="bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23F97316\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="ZBase trong con số" 
            description="Sự hài lòng của khách hàng và hiệu quả của hệ thống là ưu tiên hàng đầu của chúng tôi"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-16">              {stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-orange-300/30">
                {'number' in stat ? (
                  <CounterAnimation 
                    end={stat.number as number} 
                    suffix={stat.suffix || ''} 
                    className="text-4xl font-bold mb-2 text-orange-800" 
                  />
                ) : (
                  <StaticCounter value={stat.value as string} className="text-4xl font-bold mb-2 text-orange-800" />
                )}
                <p className="opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with carousel */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title="Khách hàng nói gì về chúng tôi" 
            description="Hàng nghìn doanh nghiệp đang sử dụng ZBase để quản lý hoạt động kinh doanh hàng ngày của họ"
          />
          
          <div className="mt-16">
            <TestimonialCarousel 
              testimonials={testimonials} 
              autoplaySpeed={5000} 
              className="h-[300px]" 
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action Section with contact form */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="max-w-lg">
                <SectionHeader 
                  title="Sẵn sàng để nâng cấp việc quản lý bán hàng?" 
                  description="Bắt đầu dùng thử ZBase ngay hôm nay và khám phá cách chúng tôi có thể giúp doanh nghiệp của bạn phát triển."
                />
                
                <ul className="mt-8 space-y-4">
                  {benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="bg-orange-100 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-4 w-4 text-orange-600" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a href="/signup" className="px-6 py-3 bg-orange-300 text-orange-900 rounded-lg font-medium text-center hover:bg-orange-400 shadow-lg shadow-orange-300/20">
                    Đăng ký ngay
                  </a>
                  <a href="/demo" className="px-6 py-3 border border-orange-200 text-orange-700 rounded-lg font-medium text-center hover:bg-orange-50">
                    Xem demo
                  </a>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-orange-200">
                <h3 className="text-2xl font-semibold text-orange-800 mb-6 tracking-tight">Liên hệ tư vấn</h3>
                <ContactForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Our Pages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Explore Our Pages</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <li>
              <Link href="/about" className="block p-6 bg-white shadow rounded-lg hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800">About Us</h3>
                <p className="text-gray-600">Learn more about our company, team, and mission.</p>
              </Link>
            </li>
            <li>
              <Link href="/features" className="block p-6 bg-white shadow rounded-lg hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800">Features</h3>
                <p className="text-gray-600">Discover the features we offer to enhance your experience.</p>
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="block p-6 bg-white shadow rounded-lg hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800">Pricing</h3>
                <p className="text-gray-600">Check out our pricing plans and choose what suits you best.</p>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block p-6 bg-white shadow rounded-lg hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800">Contact</h3>
                <p className="text-gray-600">Get in touch with us for any inquiries or support.</p>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
