"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import MainLayout from "@/components/layouts/MainLayout";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("auth.error");
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    default: t("defaultMessage"),
    AccessDenied: t("accessDenied"),
    Verification: t("verification"),
    CredentialsSignin: t("credentialsSignin"),
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <MainLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-red-600">
            {t("title")}
          </h1>
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <p className="text-center text-red-700">{errorMessage}</p>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {t("backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
