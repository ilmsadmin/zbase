"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import { use } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
};

export default function UserDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const t = useTranslations("admin.users");
  const router = useRouter();
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await apiClient.get(`/users/${userId}`);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(t("errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId, t]);

  const handleDeleteUser = async () => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await apiClient.delete(`/users/${userId}`);
        router.push("/admin/users");
      } catch (err) {
        console.error("Error deleting user:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            </div>
          </div>
        </MainLayout>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
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
              <div className="mt-4">
                <Link
                  href="/admin/users"
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <FiArrowLeft className="mr-1" /> {t("backToUsers")}
                </Link>
              </div>
            </div>
          </div>
        </MainLayout>
      </RoleGuard>
    );
  }

  if (!user) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white">
                  {t("userNotFound")}
                </h3>
                <div className="mt-6">
                  <Link
                    href="/admin/users"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <FiArrowLeft className="mr-1" /> {t("backToUsers")}
                  </Link>
                </div>
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href="/admin/users"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <FiArrowLeft className="mr-1" /> {t("backToUsers")}
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t("userDetails")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("userDetailsDescription")}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={`/admin/users/${userId}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                  >
                    <FiEdit className="mr-1.5 h-4 w-4" /> {t("edit")}
                  </Link>
                  <button
                    onClick={handleDeleteUser}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-900"
                  >
                    <FiTrash2 className="mr-1.5 h-4 w-4" /> {t("delete")}
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700">
                <dl>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      {t("form.id")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.id}
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      {t("form.name")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.name}
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      {t("form.email")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      {t("form.roles")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </div>
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      {t("table.createdAt")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  {user.updatedAt && (
                    <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        {t("table.updatedAt")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {new Date(user.updatedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
