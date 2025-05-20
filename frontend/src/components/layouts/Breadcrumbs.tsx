"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations('common');
  
  // Don't show breadcrumbs on homepage
  if (pathname === "/" || pathname === "/vi" || pathname === "/en") {
    return null;
  }
  
  // Split the path and remove empty segments and locale segment (/en or /vi) if present
  const segments = pathname.split('/').filter(Boolean);
  const isLocalized = ["en", "vi"].includes(segments[0]);
  const pathSegments = isLocalized ? segments.slice(1) : segments;
  
  // Create breadcrumb segments
  const breadcrumbs = [];
  let currentPath = isLocalized ? `/${segments[0]}` : "";
    // Add home
  breadcrumbs.push({
    name: t("navigation.home"),
    href: "/",
    current: pathSegments.length === 0,
  });
  // Add all path segments
  pathSegments.forEach((segment, index) => {
    // For href, use path segments without the locale prefix
    // This way, the Link component can add the correct locale
    let segmentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
    currentPath += `/${segment}`;
    
    // Try to get a readable name for the segment
    let name = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Skip ID segments (those that start with [ and end with ])
    if (segment.startsWith('[') && segment.endsWith(']')) {
      // Add special handling for certain dynamic segments
      if (segment === '[id]' && pathSegments[index-1] === 'users') {
        name = t("navigation.admin.userDetails");
        
        breadcrumbs.push({
          name,
          href: segmentPath,
          current: index === pathSegments.length - 1 && pathname.split('/').slice(-1)[0] !== 'edit',
        });
      } else if (segment === '[id]' && pathSegments[index-1] === 'roles') {
        name = t("navigation.admin.roleDetails");
        
        breadcrumbs.push({
          name,
          href: segmentPath,
          current: index === pathSegments.length - 1 && pathname.split('/').slice(-1)[0] !== 'edit',
        });
      }
      
      return;
    }
    
    // Handle special cases for better breadcrumb labels
    if (segment === "admin") {
      try {
        name = t("navigation.admin.section");
      } catch (e) {
        // fallback to default
      }
    } else if (pathSegments[0] === "admin") {
      // For admin subpages
      switch(segment) {
        case "posts":
          try {
            name = t("navigation.admin.content");
          } catch (e) {
            // fallback to default
          }
          break;
        case "users":
          try {
            name = t("navigation.admin.users");
          } catch (e) {
            // fallback to default
          }
          break;
        case "roles":
          try {
            name = t("navigation.admin.roles");
          } catch (e) {
            // fallback to default
          }
          break;
        case "permissions":
          try {
            name = t("navigation.admin.permissions");
          } catch (e) {
            // fallback to default
          }
          break;
        default:
          // Try to get generic translation
          try {
            name = t(`navigation.admin.${segment}`);
          } catch (e) {
            // Use capitalized segment as fallback
          }
      }
    } else {
      // For regular pages
      try {
        name = t(`navigation.${segment}`);
      } catch (e) {
        // Use capitalized segment as fallback
      }
    }
      breadcrumbs.push({
      name,
      href: `/${pathSegments.slice(0, index + 1).join('/')}`,
      current: index === pathSegments.length - 1,
    });
  });
  
  return (
    <nav className="py-3 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/30">
      <ol className="flex flex-wrap items-center space-x-1 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index === 0 ? (
              <HomeIcon className="flex-shrink-0 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            ) : (
              <ChevronRightIcon 
                className="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500" 
                aria-hidden="true" 
              />
            )}
            <div className={index === 0 ? "ml-1" : "ml-2"}>
              {breadcrumb.current ? (
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {index === 0 ? "" : breadcrumb.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
