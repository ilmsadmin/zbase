"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiEdit, FiTrash2, FiClock, FiCalendar, FiUser, FiMessageSquare, FiCheck, FiX } from "react-icons/fi";

type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  comments: Comment[];
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export default function PostDetailsPage() {
  const t = useTranslations("admin.posts");
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPost = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get(`/posts/${postId}`);
      setPost(data);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleDeletePost = async () => {
    if (window.confirm(t("confirmDelete"))) {      try {
        await apiClient.delete(`/posts/${postId}`);
        router.push("/admin/posts");
      } catch (err) {
        console.error("Error deleting post:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const handleTogglePublishStatus = async () => {
    if (!post) return;
    
    try {
      const updatedPost = await apiClient.patch(`/posts/${postId}`, {
        published: !post.published
      });
      setPost(updatedPost);
    } catch (err) {
      console.error("Error updating post status:", err);
      setError(t("errors.updateFailed"));
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            </div>
          </div>
        </MainLayout>
      </RoleGuard>
    );
  }

  if (!post) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("postNotFound")}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t("postNotFoundDesc")}</p>                <Link
                  href={"/admin/posts"}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToPosts")}
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
            {/* Breadcrumb and actions */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">              <div className="flex items-center">
                <Link
                  href={"/admin/posts"}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToPosts")}
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">                <Link
                  href={`/admin/posts/${postId}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiEdit className="mr-2" /> {t("edit")}
                </Link>
                
                <button
                  onClick={handleTogglePublishStatus}
                  className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 ${
                    post.published 
                      ? "border-yellow-300 text-yellow-800 bg-yellow-100 hover:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-300 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40"
                      : "border-green-300 text-green-800 bg-green-100 hover:bg-green-200 dark:border-green-700 dark:text-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/40"
                  }`}
                >
                  {post.published ? (
                    <>
                      <FiX className="mr-2" /> {t("unpublish")}
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" /> {t("publish")}
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDeletePost}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:border-red-700 dark:text-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-900"
                >
                  <FiTrash2 className="mr-2" /> {t("delete")}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Post title and status */}
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white break-words">
                    {post.title}
                  </h3>
                  <div className="mt-2 sm:mt-0">
                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                      post.published 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                    }`}>
                      {post.published ? t("published") : t("draft")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {/* Post metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiUser className="mr-2 h-4 w-4" />
                    <span>{t("author")}: <span className="font-medium text-gray-900 dark:text-white">{post.author.name}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiCalendar className="mr-2 h-4 w-4" />
                    <span>{t("created")}: <span className="font-medium text-gray-900 dark:text-white">{new Date(post.createdAt).toLocaleDateString()}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiClock className="mr-2 h-4 w-4" />
                    <span>{t("updated")}: <span className="font-medium text-gray-900 dark:text-white">{new Date(post.updatedAt).toLocaleDateString()}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiMessageSquare className="mr-2 h-4 w-4" />
                    <span>{t("comments")}: <span className="font-medium text-gray-900 dark:text-white">{post.comments.length}</span></span>
                  </div>
                </div>
                
                {/* Post content */}
                <div className="prose dark:prose-invert max-w-none mt-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/20 whitespace-pre-wrap break-words">
                    {post.content}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments section */}
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("comments")} ({post.comments.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("commentsDescription")}
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {post.comments.length === 0 ? (
                  <div className="text-center py-6">
                    <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t("noComments")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t("noCommentsDescription")}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="py-4">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                              <span className="text-indigo-800 dark:text-indigo-200 font-medium">
                                {comment.author.name.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {comment.author.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Preview link */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-indigo-800 dark:text-indigo-300">
                  {t("viewOnSite")}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-indigo-700 dark:text-indigo-400">
                  <p>{t("viewOnSiteDescription")}</p>
                </div>
                <div className="mt-4">                  <Link
                    href={`/posts/${postId}`}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 border border-indigo-300 dark:border-indigo-700 text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                  >
                    {t("viewPost")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
