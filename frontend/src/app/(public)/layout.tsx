import React from 'react';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">ZBase</h1>          <nav>
            <ul className="flex space-x-8">
              <li><Link href="/" className="text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link href="/features" className="text-gray-600 hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-primary">Pricing</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-primary">About</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
            </ul>
          </nav>          <div>
            <Link href="/login" className="px-4 py-2 bg-white text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors mr-2">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ZBase</h3>
            <p className="text-gray-600">Modern inventory and POS management system for businesses of all sizes.</p>
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Product</h4>            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-600 hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-primary">Pricing</Link></li>
              <li><Link href="/demo" className="text-gray-600 hover:text-primary">Request Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Company</h4>            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-primary">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Legal</h4>            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
          © {new Date().getFullYear()} ZBase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
