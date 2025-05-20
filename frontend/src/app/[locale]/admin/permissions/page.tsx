"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link } from "@/i18n/navigation";
import { FiArrowLeft, FiRefreshCw, FiSearch, FiShield, FiPlus, FiEye } from "react-icons/fi";

type Permission = {
  id: string;
  action: string;
  description: string;
  _count?: {
    roles: number;
  };
};

export default function PermissionsPage() {
  const t = useTranslations("admin.permissions");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [discoveringNewPermissions, setDiscoveringNewPermissions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchPermissions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get("/permissions");
      setPermissions(data);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };
  
  const discoverNewPermissions = async () => {
    setDiscoveringNewPermissions(true);
    try {
      await apiClient.get("/permissions/discover");
      fetchPermissions();
    } catch (err) {
      console.error("Error discovering new permissions:", err);
      setError(t("errors.discoverFailed"));
    } finally {
      setDiscoveringNewPermissions(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreatePermission = async (permissionData: { action: string; description: string }) => {
    try {
      await apiClient.post("/permissions", permissionData);
      fetchPermissions();
    } catch (err) {
      console.error("Error creating permission:", err);
      setError(t("errors.createFailed"));
    }
  };  // Group permissions by resource/module
  const groupPermissionsByModule = () => {
    const groups: Record<string, Permission[]> = {};
    
    filteredPermissions.forEach(permission => {
      const actionParts = permission.action.split(':');
      if (actionParts.length > 1) {
        // Format is "action:resource" - group by resource
        const resource = actionParts[1].toUpperCase(); // resource is the second part
        if (!groups[resource]) {
          groups[resource] = [];
        }
        groups[resource].push(permission);
      } else {
        // For permissions without a proper format
        if (!groups["OTHER"]) {
          groups["OTHER"] = [];
        }
        groups["OTHER"].push(permission);
      }
    });
    
    return groups;
  };
  
  const permissionGroups = groupPermissionsByModule();

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <MainLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={discoverNewPermissions}
                  disabled={discoveringNewPermissions}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 disabled:opacity-50"
                >
                  <FiShield className={`mr-2 ${discoveringNewPermissions ? "animate-pulse" : ""}`} />
                  {discoveringNewPermissions ? t("discovering") : t("discoverPermissions")}
                </button>
                <button                  onClick={async () => {
                    try {
                      setLoading(true);
                      await apiClient.post("/permissions/normalize", {});
                      fetchPermissions();
                    } catch (err) {
                      console.error("Error normalizing permissions:", err);
                      setError(t("errors.normalizeFailed") || "Failed to normalize permissions");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:ring-offset-gray-900 disabled:opacity-50"
                >
                  <FiShield className="mr-2" />
                  {t("normalizePermissions") || "Normalize Permissions"}
                </button>
                <button
                  onClick={fetchPermissions}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiRefreshCw className="mr-2" /> {t("refresh")}
                </button>
              </div>
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

            {/* Permissions display */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              </div>
            ) : filteredPermissions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {searchTerm ? t("noResultsFound") : t("noPermissions")}
                  </h3>
                  <div className="mt-6">
                    {searchTerm ? (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        onClick={() => setSearchTerm("")}
                      >
                        {t("clearSearch")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        onClick={discoverNewPermissions}
                        disabled={discoveringNewPermissions}
                      >
                        <FiShield className={`-ml-1 mr-2 h-5 w-5 ${discoveringNewPermissions ? "animate-pulse" : ""}`} aria-hidden="true" />
                        {t("discoverPermissions")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(permissionGroups).map(([module, modulePermissions]) => (
                  <div key={module} className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {module}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        {t("permissionCount", { count: modulePermissions.length })}
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("permission")}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("description")}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("usedBy")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {modulePermissions.map((permission) => (
                            <tr key={permission.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {permission.action}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {permission.description || t("noDescription")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                  <FiShield className="mr-1 h-4 w-4 text-indigo-500" />
                                  <span>{permission._count?.roles || 0} {t("roles")}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Permission info card */}
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-indigo-800 dark:text-indigo-300">
                  {t("aboutPermissions.title")}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-indigo-700 dark:text-indigo-400">
                  <p>{t("aboutPermissions.description")}</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>{t("aboutPermissions.point1")}</li>
                    <li>{t("aboutPermissions.point2")}</li>
                    <li>{t("aboutPermissions.point3")}</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <span className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={discoverNewPermissions}
                      disabled={discoveringNewPermissions}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 disabled:opacity-50"
                    >
                      <FiShield className={`mr-2 ${discoveringNewPermissions ? "animate-pulse" : ""}`} />
                      {t("discoverPermissions")}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
