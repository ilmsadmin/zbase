"use client";

import { Fragment } from "react";
import { useSession, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations('common');
  const isAuthenticated = status === "authenticated";
  const isAdmin = isAuthenticated && session?.user?.role?.toUpperCase() === "ADMIN";  // Define all navigation items with logical organization and hierarchical structure
  const publicNavigation = [
    { name: t("navigation.home"), href: "/", current: pathname === "/" || pathname === "/vi" || pathname === "/en" },
  ];

  // Define user related navigation with logical grouping
  const userNavigation = isAuthenticated ? [
    { 
      name: t("navigation.dashboard"), 
      href: "/dashboard", 
      current: pathname.includes("/dashboard") && !pathname.includes("/admin"),
    },
    { 
      name: t("navigation.posts"), 
      href: "/posts", 
      current: pathname.includes("/posts") && !pathname.includes("/admin"),
      children: [
        { name: t("navigation.posts") + " 1", href: "/posts/1", current: pathname.includes("/posts/1") },
        { name: t("navigation.posts") + " 2", href: "/posts/2", current: pathname.includes("/posts/2") },
      ]
    },
  ] : [];

  // Define admin navigation with hierarchical structure
  const adminNavigation = isAdmin ? [
    { 
      name: t("navigation.admin.section"),
      href: "/admin",
      current: pathname.includes("/admin"),
      children: [
        { 
          name: t("navigation.admin.dashboard"), 
          href: "/admin", 
          current: pathname === "/admin" || pathname.endsWith("/admin"),
        },
        { 
          name: t("navigation.admin.content"), 
          href: "/admin/posts", 
          current: pathname.includes("/admin/posts"),
        },
        { 
          name: t("navigation.admin.users"), 
          href: "/admin/users", 
          current: pathname.includes("/admin/users"),
        },
        { 
          name: t("navigation.admin.access"), 
          href: "/admin/roles", 
          current: pathname.includes("/admin/roles") || pathname.includes("/admin/permissions"),
          children: [
            { 
              name: t("navigation.admin.roles"), 
              href: "/admin/roles", 
              current: pathname.includes("/admin/roles"),
            },
            { 
              name: t("navigation.admin.permissions"), 
              href: "/admin/permissions", 
              current: pathname.includes("/admin/permissions"),
            },
          ]
        },
      ]
    },
  ] : [];

  // Combine all top-level navigation items
  const navigation = [
    ...publicNavigation,
    ...userNavigation,
    ...adminNavigation.filter(item => !item.children),
  ];return (
    <Disclosure as="nav" className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 shadow-lg relative z-50 backdrop-blur-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-full p-2 text-indigo-100 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Mở menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div><div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <span className="text-white font-bold text-xl px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md">ZBase</span>
                </div>                <div className="hidden sm:ml-8 sm:block">
                  <div className="flex space-x-1">
                    {/* Public navigation links */}
                    {publicNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-white/10 text-white backdrop-blur-sm shadow-md border-b-2 border-white"
                            : "text-indigo-100 hover:bg-white/5 hover:text-white border-b-2 border-transparent hover:border-indigo-300",
                          "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* User navigation items - with or without dropdowns */}
                    {userNavigation.map((item) => (
                      'children' in item && item.children ? (
                        <Menu as="div" className="relative" key={item.name}>
                          <Menu.Button
                            className={classNames(
                              item.current
                                ? "bg-white/10 text-white backdrop-blur-sm shadow-md border-b-2 border-white"
                                : "text-indigo-100 hover:bg-white/5 hover:text-white border-b-2 border-transparent hover:border-indigo-300",
                              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out inline-flex items-center"
                            )}
                          >
                            {item.name}
                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Menu.Button>
                          <Transition
                            as="div"
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {item.children.map((child) => (
                                <Menu.Item key={child.name}>
                                  {({ active }) => (
                                    <Link
                                      href={child.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        child.current ? "text-indigo-600 font-semibold" : "text-gray-700",
                                        "block px-4 py-2 text-sm hover:text-indigo-600"
                                      )}
                                    >
                                      {child.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-white/10 text-white backdrop-blur-sm shadow-md border-b-2 border-white"
                              : "text-indigo-100 hover:bg-white/5 hover:text-white border-b-2 border-transparent hover:border-indigo-300",
                            "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                    
                    {/* Admin dropdown menu */}
                    {adminNavigation.length > 0 && adminNavigation[0].children && (
                      <Menu as="div" className="relative">
                        <Menu.Button
                          className={classNames(
                            pathname.includes("/admin")
                              ? "bg-white/10 text-white backdrop-blur-sm shadow-md border-b-2 border-white"
                              : "text-indigo-100 hover:bg-white/5 hover:text-white border-b-2 border-transparent hover:border-indigo-300",
                            "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out inline-flex items-center"
                          )}
                        >
                          {t("navigation.admin.section")}
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Menu.Button>
                        <Transition
                          as="div"
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {adminNavigation[0].children.map((item) => (
                              'children' in item && item.children ? (
                                <div key={item.name}>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        href={item.href}
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          item.current ? "text-indigo-600 font-semibold" : "text-gray-700",
                                          "block px-4 py-2 text-sm hover:text-indigo-600 flex justify-between items-center"
                                        )}
                                      >
                                        {item.name}
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  
                                  {/* Submenu items */}
                                  <div className="pl-4 border-l-2 border-indigo-100 ml-6 my-1">
                                    {item.children.map((child) => (
                                      <Menu.Item key={child.name}>
                                        {({ active }) => (
                                          <Link
                                            href={child.href}
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              child.current ? "text-indigo-600 font-semibold" : "text-gray-600",
                                              "block px-4 py-2 text-sm hover:text-indigo-600"
                                            )}
                                          >
                                            {child.name}
                                          </Link>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        item.current ? "text-indigo-600 font-semibold" : "text-gray-700",
                                        "block px-4 py-2 text-sm hover:text-indigo-600"
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              )
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </div>
                </div>
              </div><div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Language Switcher */}
                <div className="mr-2">
                  <LanguageSwitcher />
                </div>
                
                {/* Profile dropdown */}
                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-indigo-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 shadow-md transition-transform hover:scale-105">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Mở menu người dùng</span>
                        <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                          {session.user.name?.charAt(0) || session.user.email.charAt(0)}
                        </div>
                      </Menu.Button>
                    </div>                    <Transition
                      as="div"
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                              )}
                            >
                              {t("navigation.profile")}
                            </Link>
                          )}
                        </Menu.Item>
                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-200 my-1"></div>
                            <div className="px-4 py-1 text-xs text-gray-500">{t("navigation.admin.section")}</div>
                            
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                                  )}
                                >
                                  {t("navigation.admin.dashboard")}
                                </Link>
                              )}
                            </Menu.Item>
                            
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin/posts"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                                  )}
                                >
                                  {t("navigation.admin.content")}
                                </Link>
                              )}
                            </Menu.Item>
                            
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin/users"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                                  )}
                                >
                                  {t("navigation.admin.users")}
                                </Link>
                              )}
                            </Menu.Item>
                            
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/admin/roles"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                                  )}
                                >
                                  {t("navigation.admin.access")}
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                              )}
                            >
                              {t("navigation.logout")}
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-all duration-200"
                  >
                    {t("navigation.login")}
                  </Link>
                )}
              </div>
            </div>
          </div>          <Disclosure.Panel className="sm:hidden bg-indigo-800 pb-4 rounded-b-lg shadow-lg">
            <div className="space-y-1 px-3 pb-3 pt-2">
              {/* Public navigation items */}
              {publicNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                    "block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              
              {/* User navigation items */}
              {userNavigation.length > 0 && (
                <>
                  <div className="pt-2 pb-1">
                    <div className="border-t border-indigo-600"></div>
                  </div>
                  
                  {userNavigation.map((item) => (
                    'children' in item && item.children ? (
                      <div key={item.name}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(`mobile-submenu-${item.name.replace(/\s+/g, '-')}`);
                            if (el) {
                              el.classList.toggle('hidden');
                            }
                          }}
                          className={classNames(
                            item.current
                              ? "bg-indigo-600 text-white shadow-md"
                              : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                            "block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left flex justify-between items-center"
                          )}
                        >
                          {item.name}
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <div id={`mobile-submenu-${item.name.replace(/\s+/g, '-')}`} className="hidden pl-4 mt-1 border-l-2 border-indigo-500">
                          {item.children.map((subItem) => (
                            <Disclosure.Button
                              key={subItem.name}
                              as={Link}
                              href={subItem.href}
                              className={classNames(
                                subItem.current
                                  ? "bg-indigo-500 text-white shadow-md"
                                  : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 my-1"
                              )}
                            >
                              {subItem.name}
                            </Disclosure.Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                          "block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    )
                  ))}
                </>
              )}
              
              {/* Admin navigation section */}
              {adminNavigation.length > 0 && adminNavigation[0].children && (
                <>
                  <div className="pt-2 pb-1">
                    <div className="border-t border-indigo-600"></div>
                    <p className="text-xs text-indigo-300 px-3 pt-2">{t("navigation.admin.section")}</p>
                  </div>
                  
                  {adminNavigation[0].children.map((item) => (
                    'children' in item && item.children ? (
                      <div key={item.name}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(`mobile-admin-submenu-${item.name.replace(/\s+/g, '-')}`);
                            if (el) {
                              el.classList.toggle('hidden');
                            }
                          }}
                          className={classNames(
                            item.current
                              ? "bg-indigo-600 text-white shadow-md"
                              : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                            "block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left flex justify-between items-center"
                          )}
                        >
                          {item.name}
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <div id={`mobile-admin-submenu-${item.name.replace(/\s+/g, '-')}`} className="hidden pl-4 mt-1 border-l-2 border-indigo-500">
                          {item.children.map((subItem) => (
                            <Disclosure.Button
                              key={subItem.name}
                              as={Link}
                              href={subItem.href}
                              className={classNames(
                                subItem.current
                                  ? "bg-indigo-500 text-white shadow-md"
                                  : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 my-1"
                              )}
                            >
                              {subItem.name}
                            </Disclosure.Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-indigo-100 hover:bg-indigo-500 hover:text-white",
                          "block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    )
                  ))}
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
