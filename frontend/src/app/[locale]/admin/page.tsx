"use client";

import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { Link } from "@/i18n/navigation";
import { FiUsers, FiFileText, FiTag, FiShield, FiActivity, FiPieChart } from "react-icons/fi";
import { useSession } from "next-auth/react";

type Stats = {
  usersCount: number;
  postsCount: number;
  rolesCount: number;
  commentsCount: number;
}

export default function AdminPage() {
  const t = useTranslations("admin");
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({ 
    usersCount: 0, 
    postsCount: 0, 
    rolesCount: 0, 
    commentsCount: 0 
  });
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        // Initialize default values
        let usersCount = 0, postsCount = 0, rolesCount = 0, commentsCount = 0;
        let logs: any[] = [];
        let postsData: any[] = [];

        // Fetch users count
        try {
          const usersData = await apiClient.get('/users');
          usersCount = usersData?.length || 0;
        } catch (error) {
          console.error("Error fetching users:", error);
        }
        
        // Fetch posts data - we need this for comments as well
        try {
          postsData = await apiClient.get('/posts');
          postsCount = postsData?.length || 0;
        } catch (error) {
          console.error("Error fetching posts:", error);
          postsData = []; // Reset to empty array in case of error
        }
        
        // Fetch roles count
        try {
          const rolesData = await apiClient.get('/roles');
          rolesCount = rolesData?.length || 0;
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
        
        // Comments API requires a postId parameter (numeric)
        // For the dashboard, we'll get the total count by fetching comments for each post
        try {
          let allComments: any[] = [];
          for (const post of postsData) {
            if (post?.id) {
              try {
                const postComments = await apiClient.get(`/comments?postId=${post.id}`);
                if (Array.isArray(postComments)) {
                  allComments = [...allComments, ...postComments];
                }
              } catch (commentError) {
                console.error(`Error fetching comments for post ${post.id}:`, commentError);
              }
            }
          }
          commentsCount = allComments.length || 0;
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
        
        // The logs API endpoint does not exist in the backend
        // We'll use an empty array instead of making a failing API call
        logs = [];

        setStats({
          usersCount,
          postsCount,
          rolesCount,
          commentsCount
        });
        
        setActivityLog(logs);
      } catch (error) {
        console.error("Error in admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <MainLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("welcome", { name: session?.user?.name || "Admin" })}
              </span>
            </div>
            
            {/* Dashboard stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Users stat card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("stats.users.title")}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {loading ? "..." : stats.usersCount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <Link 
                      href="/admin/users" 
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      {t("stats.viewAll")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Posts stat card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-pink-500 rounded-md p-3">
                      <FiFileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("stats.posts.title")}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {loading ? "..." : stats.postsCount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <Link 
                      href="/admin/posts" 
                      className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                    >
                      {t("stats.viewAll")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Roles stat card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <FiTag className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("stats.roles.title")}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {loading ? "..." : stats.rolesCount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <Link 
                      href="/admin/roles" 
                      className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    >
                      {t("stats.viewAll")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Comments stat card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <FiActivity className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("stats.comments.title")}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {loading ? "..." : stats.commentsCount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <Link 
                      href="/admin/comments" 
                      className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      {t("stats.viewAll")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Activity log */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                    <FiActivity className="mr-2" />
                    {t("activityLog.title")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("activityLog.subtitle")}
                  </p>
                </div>
                <div className="px-4 py-3 sm:px-6">
                  {loading ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                  ) : activityLog.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {activityLog.map((log, index) => (
                        <li key={index} className="py-3">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <span className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <span className="text-indigo-500 dark:text-indigo-300 text-lg font-medium">
                                  {log.user?.name?.charAt(0) || 'U'}
                                </span>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {log.user?.name || 'Unknown user'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {log.action} - {new Date(log.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                      {t("activityLog.noActivity")}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                    <FiPieChart className="mr-2" />
                    {t("quickActions.title")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("quickActions.subtitle")}
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link 
                      href="/admin/users/new" 
                      className="rounded-md bg-white dark:bg-gray-700 px-6 py-4 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      <FiUsers className="mx-auto h-6 w-6 mb-2" />
                      {t("quickActions.createUser")}
                    </Link>
                    
                    <Link 
                      href="/admin/posts/new" 
                      className="rounded-md bg-white dark:bg-gray-700 px-6 py-4 text-center text-sm font-medium text-pink-600 dark:text-pink-400 shadow-sm border border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
                    >
                      <FiFileText className="mx-auto h-6 w-6 mb-2" />
                      {t("quickActions.createPost")}
                    </Link>
                    
                    <Link 
                      href="/admin/roles/new" 
                      className="rounded-md bg-white dark:bg-gray-700 px-6 py-4 text-center text-sm font-medium text-green-600 dark:text-green-400 shadow-sm border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <FiTag className="mx-auto h-6 w-6 mb-2" />
                      {t("quickActions.createRole")}
                    </Link>
                    
                    <Link 
                      href="/admin/permissions" 
                      className="rounded-md bg-white dark:bg-gray-700 px-6 py-4 text-center text-sm font-medium text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <FiShield className="mx-auto h-6 w-6 mb-2" />
                      {t("quickActions.managePermissions")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
