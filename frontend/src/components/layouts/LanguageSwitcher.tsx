"use client";

import { usePathname } from "@/i18n/navigation";
import { Link, locales } from "@/i18n/navigation";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { defaultLocale } from "@/i18n";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const t = useTranslations("common");
  const [currentLocale, setCurrentLocale] = useState<string>(defaultLocale);
  
  // Get current locale from cookie on client side
  useEffect(() => {
    const cookieLocale = Cookies.get('NEXT_LOCALE');
    if (cookieLocale && locales.includes(cookieLocale as any)) {
      setCurrentLocale(cookieLocale);
    }
  }, []);
  
  // Function to change language using cookies
  const changeLanguage = (locale: string) => {
    // Set cookie with 1 year expiration
    Cookies.set('NEXT_LOCALE', locale, { 
      path: '/', 
      expires: 365 
    });
    
    // Reload the page to apply the new locale
    window.location.reload();
  };
  
  // Language names mapping
  const languageNames: Record<string, string> = {
    vi: "Tiếng Việt",
    en: "English",
  };

  return (    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full rounded-lg px-2 py-2 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none transition-colors duration-200">
          <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>      <Transition
        as="div"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">          <div className="py-1">
            {locales.map((locale) => (
              <Menu.Item key={locale}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(locale)}
                    className={classNames(
                      active ? "bg-gray-100 text-indigo-600" : "text-gray-700",
                      locale === currentLocale ? "font-medium" : "",
                      "block w-full text-left px-4 py-2 text-sm hover:text-indigo-600 transition-colors duration-200"
                    )}
                  >
                    {languageNames[locale]}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
