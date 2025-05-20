"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations('common');
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          {t("footer.copyright", { year: currentYear })}
        </p>
      </div>
    </footer>
  );
}
