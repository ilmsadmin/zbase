"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Breadcrumb = () => {
  const pathname = usePathname();
  
  // Skip rendering breadcrumb on the main admin page
  if (pathname === '/admin') {
    return null;
  }
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    // Skip the first empty string
    const paths = pathname.split('/').filter(Boolean);
    
    // Always include home in breadcrumbs
    const breadcrumbs = [
      { name: 'Admin', path: '/admin' }
    ];
    
    // Build path as we go
    let currentPath = '';
    
    paths.forEach((path, i) => {
      // Skip "admin" as it's already included
      if (i === 0 && path === 'admin') return;
      
      currentPath += `/${path}`;
      
      // Format the path name (capitalize first letter, replace hyphens with spaces)
      const formattedName = path
        .split('-')
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name: formattedName,
        path: currentPath,
        // Only the last item shouldn't be a link
        isLast: i === paths.length - 1 && path !== 'admin'
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav className="text-sm">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            {index > 0 && (
              <li className="text-gray-400 px-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
            )}
            <li>
              {breadcrumb.isLast ? (
                <span className="font-medium text-gray-600">{breadcrumb.name}</span>
              ) : (
                <Link 
                  href={breadcrumb.path}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
