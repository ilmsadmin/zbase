"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link } from "@/i18n/navigation";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiRefreshCw, FiShield, FiUsers } from "react-icons/fi";

type Role = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  _count?: {
    users: number;
    permissions: number;
  };
};

export default function RolesPage() {
  const t = useTranslations("admin.roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get("/roles");
      setRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await apiClient.delete(`/roles/${roleId}`);
        fetchRoles();
      } catch (err) {
        console.error("Error deleting role:", err);
        setError(t("errors.deleteFailed"));
      }
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
                href="/admin/roles/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
              >
                <FiPlus className="mr-2" /> {t("addRole")}
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
                  <button
                    onClick={fetchRoles}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                  >
                    <FiRefreshCw className="mr-2" /> {t("refresh")}
                  </button>
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

            {/* Roles grid */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredRoles.length === 0 ? (
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
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {searchTerm ? t("noResultsFound") : t("noRoles")}
                  </h3>
                  {!searchTerm && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t("getStarted")}
                    </p>
                  )}
                  {searchTerm ? (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        onClick={() => setSearchTerm("")}
                      >
                        {t("clearSearch")}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <Link
                        href="/admin/roles/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                      >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {t("addRole")}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {filteredRoles.map((role) => (
                    <div
                      key={role.id}
                      className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                              {role.name}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                              {role.description || t("noDescription")}
                            </p>
                          </div>
                          <div className="flex space-x-2 text-lg">
                            <Link
                              href={`/admin/roles/${role.id}`}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                            >
                              <FiEye title={t("view")} />
                            </Link>
                            <Link
                              href={`/admin/roles/${role.id}/edit`}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                            >
                              <FiEdit title={t("edit")} />
                            </Link>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <FiTrash2 title={t("delete")} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-6 flex space-x-4">
                          <Link
                            href={`/admin/roles/${role.id}/permissions`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                          >
                            <FiShield className="mr-2" />
                            {role._count?.permissions || 0} {t("permissions")}
                          </Link>
                          <Link
                            href={`/admin/roles/${role.id}/users`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                          >
                            <FiUsers className="mr-2" />
                            {role._count?.users || 0} {t("users")}
                          </Link>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {t("createdAt")}: {new Date(role.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
