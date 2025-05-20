"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiCheck, FiShield, FiRefreshCw, FiSearch, FiPlus, FiX } from "react-icons/fi";

type Role = {
  id: string;
  name: string;
  description: string;
};

type Permission = {
  id: string;
  action: string;
  description: string;
  isAssigned?: boolean;
};

export default function RolePermissionsPage() {
  const t = useTranslations("admin.roles");
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  
  const [role, setRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [roleData, allPermsData, rolePermsData] = await Promise.all([
        apiClient.get(`/roles/${roleId}`),
        apiClient.get("/permissions"),
        apiClient.get(`/permissions/role/${roleId}`),
      ]);
      
      setRole(roleData);
      setRolePermissions(rolePermsData);
      
      // Mark permissions that are already assigned to the role
      const rolePermIds = rolePermsData.map((p: Permission) => p.id);
      const formattedAllPermissions = allPermsData.map((p: Permission) => ({
        ...p,
        isAssigned: rolePermIds.includes(p.id)
      }));
      
      setAllPermissions(formattedAllPermissions);
    } catch (err) {
      console.error("Error fetching permissions data:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleId]);

  const handleTogglePermission = async (permissionId: string, isCurrentlyAssigned: boolean) => {
    if (saving) return;
    
    setSaving(true);
    try {      if (!isCurrentlyAssigned) {
        // Assign permission to role
        await apiClient.post(`/permissions/role/${roleId}/permission/${permissionId}`, {});
        
        // Update local state
        setAllPermissions(allPermissions.map(p => 
          p.id === permissionId ? { ...p, isAssigned: true } : p
        ));
        
        // Add to role permissions
        const permToAdd = allPermissions.find(p => p.id === permissionId);
        if (permToAdd) {
          setRolePermissions([...rolePermissions, { ...permToAdd, isAssigned: true }]);
        }
      } else {
        // Remove permission from role (API endpoint might be different, adjust as needed)
        await apiClient.delete(`/permissions/role/${roleId}/permission/${permissionId}`);
        
        // Update local state
        setAllPermissions(allPermissions.map(p => 
          p.id === permissionId ? { ...p, isAssigned: false } : p
        ));
        
        // Remove from role permissions
        setRolePermissions(rolePermissions.filter(p => p.id !== permissionId));
      }
    } catch (err) {
      console.error("Error updating permission:", err);
      setError(isCurrentlyAssigned ? t("errors.removePermissionFailed") : t("errors.addPermissionFailed"));
    } finally {
      setSaving(false);
    }
  };

  const filteredPermissions = allPermissions.filter(
    (perm) =>
      perm.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (perm.description && perm.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  if (!role) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <MainLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("roleNotFound")}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t("roleNotFoundDesc")}</p>
                <Link
                  href="/admin/roles"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToRoles")}
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
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={`/admin/roles/${roleId}`}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToRole")}
                </Link>
              </div>
              <button
                onClick={fetchData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
              >
                <FiRefreshCw className="mr-2" /> {t("refresh")}
              </button>
            </div>

            {/* Header with role info */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow rounded-lg mb-6 p-6">
              <div className="flex items-center">
                <FiShield className="h-12 w-12 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold">{t("managePermissionsFor", { roleName: role.name })}</h2>
                  <p className="mt-1">{role.description || t("noDescription")}</p>
                  <div className="mt-3 text-purple-100">
                    <span className="text-sm bg-purple-800/40 rounded-full px-3 py-1">
                      {rolePermissions.length} {t("permissionsAssigned")}
                    </span>
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

            {/* Search box */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={t("searchPermissions")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Current permissions summary */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("assignedPermissions")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("assignedPermissionsDesc")}
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {rolePermissions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("noPermissionsAssigned")}
                    </p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <div className="flex flex-wrap gap-2">
                      {rolePermissions.map((permission) => (
                        <div 
                          key={permission.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200"
                        >
                          <span className="truncate max-w-xs">{permission.action}</span>
                          <button
                            onClick={() => handleTogglePermission(permission.id, true)}
                            className="ml-2 flex-shrink-0 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 focus:outline-none"
                            disabled={saving}
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* All permissions table with toggle controls */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("allPermissions")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("allPermissionsDesc")}
                </p>
              </div>
              
              <div className="px-4 sm:px-6 py-5">
                {filteredPermissions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? t("noPermissionsFound") : t("noPermissionsInSystem")}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                      >
                        {t("clearSearch")}
                      </button>
                    )}
                  </div>
                ) : (
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
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredPermissions.map((permission) => (
                          <tr key={permission.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {permission.action}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {permission.description || t("noDescription")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleTogglePermission(permission.id, permission.isAssigned || false)}
                                className={`inline-flex items-center px-3 py-2 border ${
                                  permission.isAssigned
                                    ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                                    : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/50"
                                } rounded-md text-sm leading-4 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900`}
                                disabled={saving}
                              >
                                {permission.isAssigned ? (
                                  <>
                                    <FiX className="mr-2 h-4 w-4" />
                                    {t("remove")}
                                  </>
                                ) : (
                                  <>
                                    <FiPlus className="mr-2 h-4 w-4" />
                                    {t("assign")}
                                  </>
                                )}
                              </button>
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
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
