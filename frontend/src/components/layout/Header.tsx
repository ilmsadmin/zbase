"use client";

import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-primary">ZBase</h1>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
              About
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
              Contact
            </Link>
          </nav>
          
          {/* Call to action */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
              Log in
            </Link>
            <Link 
              href="/demo" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              Request Demo
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon */}
              <svg 
                className="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className="hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100">
            About
          </Link>
          <Link href="/features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100">
            Features
          </Link>
          <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100">
            Pricing
          </Link>
          <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100">
            Contact
          </Link>
          <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100">
            Log in
          </Link>
          <Link href="/demo" className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white">
            Request Demo
          </Link>
        </div>
      </div>
    </header>
  );
}