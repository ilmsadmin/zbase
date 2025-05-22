"use client";

import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '../layouts/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

// Placeholder SVG for demo purposes when no images are available
const PlaceholderSVG = () => (
  <svg className="w-full h-full text-gray-200" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
  </svg>
);

interface LandingPageProps {
  // No longer need locale prop with cookie-based approach
}

export default function LandingPage() {
  // Using next-intl with cookie-based locale
  let t: any;
  
  // Initialize default locale for links (we don't need to include it in URLs anymore)
  const defaultLocale = 'vi';
  
  // Kiểm tra trạng thái đăng nhập
  const { data: session, status } = useSession();
  
  try {
    t = useTranslations('common');
  } catch (e) {
    // Fallback cho trường hợp không có context translation
    t = (key: string) => {
      const translations: Record<string, string> = {
        'landing.hero.title': 'Quản lý doanh nghiệp thông minh với ZBase',
        'landing.hero.description': 'Giải pháp quản lý kho hàng và bán lẻ toàn diện, giúp doanh nghiệp vận hành hiệu quả và phát triển bền vững.',
        'landing.features.title': 'Tính năng',
        'landing.features.subtitle': 'Giải pháp toàn diện cho doanh nghiệp',
        'landing.features.description': 'ZBase cung cấp đầy đủ các tính năng giúp doanh nghiệp của bạn vận hành hiệu quả.',
        'landing.stats.title': 'Được tin dùng bởi hàng nghìn doanh nghiệp',
        'landing.testimonials.title': 'Khách hàng nói gì',
        'landing.testimonials.subtitle': 'Sự hài lòng của khách hàng là thành công của chúng tôi',
        'landing.contact.title': 'Đăng ký dùng thử',
        'landing.contact.description': 'Để lại thông tin, chúng tôi sẽ liên hệ với bạn trong vòng 24h',
        'landing.contact.submit': 'Đăng ký ngay',
        'landing.menu.home': 'Trang chủ',
        'landing.menu.about': 'Giới thiệu',
        'landing.menu.features': 'Tính năng',
        'landing.menu.pricing': 'Bảng giá',
        'landing.menu.contact': 'Liên hệ',
        'buttons.login': 'Đăng nhập',
        'buttons.register': 'Đăng ký',
        'buttons.tryFree': 'Dùng thử miễn phí',
        'buttons.contactUs': 'Liên hệ tư vấn'
      };
      return translations[key] || key;
    };
  }
  // Sample features
  const features = [
    {
      title: 'Quản lý kho hàng',
      description: 'Quản lý tồn kho hiệu quả, theo dõi xuất nhập hàng thời gian thực',
      icon: 'M20 3H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H4V7h16v12zM9 16H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V6h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z'
    },
    {
      title: 'Hệ thống POS',
      description: 'Bán hàng dễ dàng, nhanh chóng với giao diện thân thiện',
      icon: 'M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16z M15 18H9v-1h6v1z M15 15H9v-5h6v5z M15 8H9V7h6v1z'
    },
    {
      title: 'Quản lý khách hàng',
      description: 'Theo dõi thông tin khách hàng, lịch sử mua hàng và công nợ',
      icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'
    },
    {
      title: 'Báo cáo phân tích',
      description: 'Phân tích dữ liệu để đưa ra quyết định kinh doanh tốt hơn',
      icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'
    },
  ];

  // Sample testimonials
  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Giám đốc Công ty ABC',
      content: 'ZBase đã giúp chúng tôi tối ưu quy trình quản lý kho hàng và bán hàng, tiết kiệm nhiều thời gian và chi phí.',
      avatar: '/avatar-placeholder.png'
    },
    {
      name: 'Trần Thị B',
      role: 'Chủ cửa hàng XYZ',
      content: 'Giao diện thân thiện, dễ sử dụng, đặc biệt là hệ thống POS rất nhanh và tiện lợi.',
      avatar: '/avatar-placeholder.png'
    },
    {
      name: 'Lê Văn C',
      role: 'Quản lý vận hành',
      content: 'Báo cáo phân tích chi tiết giúp chúng tôi đưa ra quyết định kinh doanh kịp thời và chính xác.',
      avatar: '/avatar-placeholder.png'
    },
  ];
  // Sample stats
  const stats = [
    { value: '500+', label: t('landing.stats.businesses') },
    { value: '1M+', label: t('landing.stats.transactions') },
    { value: '99.9%', label: t('landing.stats.uptime') },
    { value: '24/7', label: t('landing.stats.support') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">ZBase</span>
            </div>            <nav className="hidden md:flex space-x-10">              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                {t('landing.menu.home')}
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
                {t('landing.menu.about')}
              </Link>
              <Link href="/features" className="text-gray-700 hover:text-gray-900 font-medium">
                {t('landing.menu.features')}
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">
                {t('landing.menu.pricing')}
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
                {t('landing.menu.contact')}
              </Link>
            </nav>            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
                    Dashboard
                  </Link>
                  <span className="bg-green-600 text-white px-4 py-2 rounded-md">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('buttons.login')}
                  </Link>
                  <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    {t('buttons.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">{t('landing.hero.title').split(' với ZBase')[0]}</span>
                  <span className="block text-blue-600">thông minh với ZBase</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t('landing.hero.description')}
                </p>                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {status === 'authenticated' ? (
                    <>
                      <div className="rounded-md shadow">
                        <Link href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                          Đi đến Dashboard
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link href="/contact" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                          {t('buttons.contactUs')}
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link href="/auth/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                          {t('buttons.tryFree')}
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link href="/contact" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                          {t('buttons.contactUs')}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gray-100 flex items-center justify-center">
            <PlaceholderSVG />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">{t('landing.features.title')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.features.subtitle')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              {t('landing.features.description')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {t('landing.stats.title')}
            </h2>
          </div>
          <div className="mt-10 max-w-lg mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6 lg:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">{t('landing.testimonials.title')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="bg-white shadow overflow-hidden rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      <PlaceholderSVG />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-600">"{testimonial.content}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>      {/* Contact Form - Chỉ hiển thị nếu chưa đăng nhập */}
      {status !== 'authenticated' && (
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">            
              <div className="text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {t('landing.contact.title')}
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  {t('landing.contact.description')}
                </p>
              </div>
              <div className="mt-8">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                  <form className="space-y-6" action="#" method="POST">
                  <div>                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('landing.contact.name')}
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('landing.contact.email')}
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t('landing.contact.phone')}
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      {t('landing.contact.company')}
                    </label>
                    <div className="mt-1">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {t('landing.contact.submit')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Về ZBase</h3>              <ul role="list" className="mt-4 space-y-4">
                <li>                  <Link href="/about" className="text-base text-gray-400 hover:text-white">
                    {t('landing.menu.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-base text-gray-400 hover:text-white">
                    {t('landing.menu.features')}
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-base text-gray-400 hover:text-white">
                    Đội ngũ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Giải pháp</h3>              <ul role="list" className="mt-4 space-y-4">
                <li>                  <Link href="/solutions/retail" className="text-base text-gray-400 hover:text-white">
                    Bán lẻ
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/warehouse" className="text-base text-gray-400 hover:text-white">
                    Kho vận
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/distribution" className="text-base text-gray-400 hover:text-white">
                    Phân phối
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Hỗ trợ</h3>              <ul role="list" className="mt-4 space-y-4">
                <li>                  <Link href="/support/documentation" className="text-base text-gray-400 hover:text-white">
                    Tài liệu
                  </Link>
                </li>
                <li>
                  <Link href="/support/faq" className="text-base text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support/contact" className="text-base text-gray-400 hover:text-white">
                    {t('landing.menu.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Liên hệ</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li className="text-base text-gray-400">
                  Email: support@zbase.vn
                </li>
                <li className="text-base text-gray-400">
                  Hotline: 1900 1234
                </li>
                <li className="text-base text-gray-400">
                  Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {/* Social Media Icons */}
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
