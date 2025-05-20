"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/errors";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiSave, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { use } from "react";

// Form validation schema
const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be at most 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditPostPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const t = useTranslations("admin.posts");
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get(`/posts/${id}`);
        setPost(data);
        reset({
          title: data.title,
          content: data.content || "",
          published: data.published || false,
        });
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, reset]);

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setError(null);    try {      await apiClient.patch(`/posts/${id}`, data);
      router.push("/admin/posts");
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete"))) {
      return;
    }    try {      await apiClient.delete(`/posts/${id}`);
      router.push("/admin/posts");
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    }
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </MainLayout>
      </RoleGuard>
    );
  }

  if (error && !post) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 text-center">
                <p className="text-red-600 dark:text-red-400">{error || t("errors.postNotFound")}</p>
                <Link
                  href="/admin/posts"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  {t("backToList")}
                </Link>
              </div>
            </div>
          </div>
        </MainLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <MainLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("editPost")}
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-900"
                >
                  <FiTrash2 className="mr-2" /> {t("delete")}
                </button>
                <Link
                  href="/admin/posts"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToList")}
                </Link>
              </div>
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
                  {post && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{t("fields.author")}: {post.authorName}</span>
                      <span className="mx-2">•</span>
                      <span>{t("fields.created")}: {new Date(post.createdAt).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>{t("fields.updated")}: {new Date(post.updatedAt).toLocaleString()}</span>
                    </div>
                  )}

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
