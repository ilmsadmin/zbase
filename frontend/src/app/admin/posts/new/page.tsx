"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/errors";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schema
const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be at most 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published: z.boolean().default(false),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const t = useTranslations("admin.posts");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      published: false,
    },
  });

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/posts", data);
      router.push("/admin/posts");
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <MainLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("createPost")}
              </h1>
              <Link
                href="/admin/posts"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
              >
                <FiArrowLeft className="mr-2" /> {t("backToList")}
              </Link>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t("errors.errorOccurred")}</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("fields.title")}
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register("title")}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("fields.content")}
                    </label>
                    <textarea
                      id="content"
                      rows={10}
                      {...register("content")}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                    {errors.content && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="published"
                      type="checkbox"
                      {...register("published")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {t("fields.publish")}
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end">
                  <Link
                    href="/admin/posts"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 mr-3"
                  >
                    {t("cancel")}
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 disabled:opacity-70"
                  >
                    <FiSave className="mr-2" /> {isSubmitting ? t("saving") : t("save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
