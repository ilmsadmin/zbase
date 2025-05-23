import React from 'react';
import { PageContainer } from '@/components/ui/PageContainer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">About ZBase</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of inventory and point-of-sale management for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-12 bg-gray-50 rounded-lg my-8 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Company</h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-lg mb-4">
              Founded in 2023, ZBase has quickly grown from a small startup to a trusted provider of 
              inventory and POS solutions. We combine powerful technology with intuitive design to 
              create tools that make business operations smoother and more efficient.
            </p>
            <p className="text-lg">
              Based in Ho Chi Minh City with a team distributed across Vietnam, we serve customers 
              throughout Southeast Asia and beyond, helping businesses optimize their operations and grow.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">[Company Image Placeholder]</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 my-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-200 h-48 flex items-center justify-center">
              <p className="text-gray-500">[Team Member Photo]</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-1">Minh Nguyen</h3>
              <p className="text-gray-500 mb-3">Founder & CEO</p>
              <p className="text-gray-600">
                With over 15 years of experience in retail technology, Minh leads our company vision and strategy.
              </p>
            </div>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-200 h-48 flex items-center justify-center">
              <p className="text-gray-500">[Team Member Photo]</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-1">Linh Tran</h3>
              <p className="text-gray-500 mb-3">CTO</p>
              <p className="text-gray-600">
                Linh oversees our technical strategy and leads our development teams in building innovative solutions.
              </p>
            </div>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-200 h-48 flex items-center justify-center">
              <p className="text-gray-500">[Team Member Photo]</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-1">Hai Le</h3>
              <p className="text-gray-500 mb-3">Head of Product</p>
              <p className="text-gray-600">
                Hai works closely with customers to understand their needs and translate them into product features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 bg-primary text-white rounded-lg my-8 p-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
              To empower businesses with technology that simplifies operations, reduces manual work, 
              and provides real-time insights for better decision-making. We believe that with the 
              right tools, any business can optimize its processes and focus on what truly matters.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg">
              To become the leading provider of integrated business management solutions in Southeast Asia, 
              known for our intuitive software, excellent customer service, and continuous innovation 
              that helps businesses thrive in an increasingly competitive marketplace.
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
