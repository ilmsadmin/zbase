"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link } from "@/i18n/navigation";
import { 
  FiEdit, 
  FiTrash2,
  FiEye, 
  FiSearch, 
  FiRefreshCw, 
  FiMessageSquare,
  FiClock,
  FiUser,
  FiCheck,
  FiX,
  FiFilter,
  FiCalendar,
  FiArrowDown,
  FiArrowUp
} from "react-icons/fi";

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
  _count?: {
    comments: number;
  };
};

export default function PostsPage() {
  const t = useTranslations("admin.posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "title" | "author">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get("/posts");
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await apiClient.delete(`/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        console.error("Error deleting post:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const handleTogglePublishStatus = async (postId: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/posts/${postId}`, {
        published: !currentStatus
      });
      fetchPosts();
    } catch (err) {
      console.error("Error updating post status:", err);
      setError(t("errors.updateFailed"));
    }
  };

  // Filter posts based on search term and status filter
  const filteredPosts = posts.filter(
    (post) => {
      // Search filter
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === "published") {
        matchesStatus = post.published === true;
      } else if (statusFilter === "draft") {
        matchesStatus = post.published === false;
      }
      
      return matchesSearch && matchesStatus;
    }
  );
  
  // Sort filtered posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "createdAt") {
      return sortOrder === "asc" 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === "author") {
      return sortOrder === "asc"
        ? a.author.name.localeCompare(b.author.name)
        : b.author.name.localeCompare(a.author.name);
    }
    return 0;
  });

  // Toggle sort order
  const toggleSort = (column: "createdAt" | "title" | "author") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <MainLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h1>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
              >
                <FiEdit className="mr-2" /> {t("createPost")}
              </Link>
            </div>

            {/* Search and filter */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={t("searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div>
                      <label htmlFor="status-filter" className="sr-only">{t("filterByStatus")}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiFilter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="status-filter"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as any)}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="all">{t("allPosts")}</option>
                          <option value="published">{t("publishedOnly")}</option>
                          <option value="draft">{t("draftsOnly")}</option>
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={fetchPosts}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                    >
                      <FiRefreshCw className="mr-2" /> {t("refresh")}
                    </button>
                  </div>
                </div>
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

            {/* Posts table */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : sortedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {searchTerm || statusFilter !== "all" ? t("noResultsFound") : t("noPosts")}
                  </h3>
                  {!searchTerm && statusFilter === "all" && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t("getStarted")}
                    </p>
                  )}
                  <div className="mt-6">
                    {(searchTerm || statusFilter !== "all") ? (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                        }}
                      >
                        {t("clearFilters")}
                      </button>
                    ) : (
                      <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                      >
                        <FiEdit className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {t("createPost")}
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("title")}
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                          onClick={() => toggleSort("author")}
                        >
                          <div className="flex items-center">
                            <span>{t("table.author")}</span>
                            {sortBy === "author" && (
                              <span className="ml-1">
                                {sortOrder === "asc" ? <FiArrowUp className="inline h-4 w-4" /> : <FiArrowDown className="inline h-4 w-4" />}
                              </span>
                            )}                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("table.status")}
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                          onClick={() => toggleSort("createdAt")}
                        >
                          <div className="flex items-center">
                            <span>{t("table.date")}</span>
                            {sortBy === "createdAt" && (
                              <span className="ml-1">
                                {sortOrder === "asc" ? <FiArrowUp className="inline h-4 w-4" /> : <FiArrowDown className="inline h-4 w-4" />}
                              </span>                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedPosts.map((post) => (
                        <tr key={post.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {post.title}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                              <FiMessageSquare className="mr-1" /> {post._count?.comments || 0} {t("table.comments")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                  <span className="text-indigo-800 dark:text-indigo-200 font-medium text-xs">
                                    {post.author.name.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {post.author.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {post.author.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.published 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            }`}>
                              {post.published ? t("status.published") : t("status.draft")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <FiCalendar className="mr-1" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-xs mt-1">
                              <FiClock className="mr-1" />
                              {new Date(post.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <div className="flex items-center justify-center space-x-3">
                              <Link
                                href={`/admin/posts/${post.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                title={t("actions.view")}
                              >
                                <FiEye className="h-5 w-5" />
                              </Link>
                              <Link
                                href={`/admin/posts/${post.id}/edit`}
                                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                                title={t("actions.edit")}
                              >
                                <FiEdit className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleTogglePublishStatus(post.id, post.published)}
                                className={`${post.published ? "text-gray-600 dark:text-gray-400" : "text-green-600 dark:text-green-400"} hover:text-gray-900 dark:hover:text-gray-300`}
                                title={post.published ? t("actions.unpublish") : t("actions.publish")}
                              >
                                {post.published ? <FiX className="h-5 w-5" /> : <FiCheck className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                title={t("delete")}
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
