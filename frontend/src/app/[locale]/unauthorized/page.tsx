"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import MainLayout from "@/components/layouts/MainLayout";

export default function UnauthorizedPage() {
  const t = useTranslations("auth.unauthorized");
  
  return (
    <MainLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-red-600">
            {t("title")}
          </h1>
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <p className="text-center text-red-700">
              {t("message")}
            </p>
          </div>
          <div className="mt-6 text-center space-y-4">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-500 font-medium block"
            >
              {t("backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
