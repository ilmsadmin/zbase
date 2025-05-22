"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const t = useTranslations("profile");

  // Create the schema using translated validation messages
  const profileSchema = z.object({
    name: z.string().min(2, t("personalInfo.nameRequired")),
    email: z.string().email(t("personalInfo.emailInvalid")).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, t("password.newPasswordRequired")).optional(),
    confirmPassword: z.string().optional(),
  }).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  }, {
    message: t("password.currentPasswordRequired"),
    path: ["currentPassword"],
  }).refine((data) => {
    if (data.newPassword !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: t("password.confirmPasswordMismatch"),
    path: ["confirmPassword"],
  });

  type ProfileFormData = {
    name: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Ở đây, khi có backend, bạn sẽ gửi request cập nhật thông tin
      // Hiện tại, chúng ta chỉ giả lập cập nhật tên người dùng
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      });

      setMessage({
        type: "success",
        text: t("messages.success"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: t("messages.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <MainLayout>
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
            {message && (
              <div
                className={`rounded-md p-4 ${
                  message.type === "success" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    message.type === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("personalInfo.name")}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("personalInfo.email")}
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        disabled
                        className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {t("password.title")}
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("password.currentPassword")}
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="currentPassword"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("currentPassword")}
                      />
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("password.newPassword")}
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="newPassword"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("newPassword")}
                      />
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("password.confirmPassword")}
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="confirmPassword"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? t("buttons.saving") : t("buttons.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
