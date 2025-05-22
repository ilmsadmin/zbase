"use client";

import { useState, useEffect } from "react";
// Removed useParams import for locale migration;
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiSave, FiTrash2, FiUsers, FiShield, FiEdit } from "react-icons/fi";

type Role = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type Permission = {
  id: string;
  action: string;
  description: string;
};

export default function RoleDetailsPage() {
  const t = useTranslations("admin.roles");
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  
  const [role, setRole] = useState<Role | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [editedRole, setEditedRole] = useState({
    name: "",
    description: "",
  });

  const fetchRoleData = async () => {
    setLoading(true);
    setError("");
    try {
      const [roleData, usersData, permissionsData] = await Promise.all([
        apiClient.get(`/roles/${roleId}`),
        apiClient.get(`/roles/${roleId}/users`),
        apiClient.get(`/roles/${roleId}/permissions`),
      ]);
      
      setRole(roleData);
      setUsers(usersData);
      setPermissions(permissionsData);
      setEditedRole({
        name: roleData.name,
        description: roleData.description || "",
      });
    } catch (err) {
      console.error("Error fetching role data:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, [roleId]);

  const handleDelete = async () => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await apiClient.delete(`/roles/${roleId}`);
        router.push("/admin/roles");
      } catch (err) {
        console.error("Error deleting role:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedRole({
        name: role?.name || "",
        description: role?.description || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const updatedRole = await apiClient.patch(`/roles/${roleId}`, editedRole);
      setRole(updatedRole);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Error updating role:", err);
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
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Link
                  href="/admin/roles"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToRoles")}
                </Link>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiEdit className="mr-2" /> {isEditing ? t("cancel") : t("edit")}
                </button>
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                  >
                    <FiSave className="mr-2" /> {t("save")}
                  </button>
                ) : (
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-900"
                  >
                    <FiTrash2 className="mr-2" /> {t("delete")}
                  </button>
                )}
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

            {/* Role details */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("roleDetails")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("roleDetailsDesc")}
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("roleName")}
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editedRole.name}
                          onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder={t("roleNamePlaceholder")}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("roleDescription")}
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={editedRole.description}
                          onChange={(e) => setEditedRole({ ...editedRole, description: e.target.value })}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder={t("roleDescriptionPlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("roleName")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {role.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("roleId")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {role.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("createdAt")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("updatedAt")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(role.updatedAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("roleDescription")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {role.description || t("noDescription")}
                      </dd>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Link
                href={`/admin/roles/${roleId}/permissions`}
                className="block p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg text-white hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                <div className="flex items-center">
                  <FiShield className="h-10 w-10 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold">{t("managePermissions")}</h3>
                    <p>{t("managePermissionsDesc")}</p>
                    <p className="mt-2 font-medium">{permissions.length} {t("permissionsAssigned")}</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href={`/admin/roles/${roleId}/users`}
                className="block p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg text-white hover:from-green-600 hover:to-teal-700 transition-all"
              >
                <div className="flex items-center">
                  <FiUsers className="h-10 w-10 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold">{t("manageUsers")}</h3>
                    <p>{t("manageUsersDesc")}</p>
                    <p className="mt-2 font-medium">{users.length} {t("usersAssigned")}</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Role permissions preview */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t("rolePermissions")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("rolePermissionsDesc")}
                  </p>
                </div>
                <Link
                  href={`/admin/roles/${roleId}/permissions`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-100 dark:bg-indigo-700/30 dark:hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  {t("managePermissions")}
                </Link>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {permissions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("noPermissions")}
                    </p>
                    <Link
                      href={`/admin/roles/${roleId}/permissions`}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                    >
                      {t("assignPermissions")}
                    </Link>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.slice(0, 6).map((permission) => (
                        <li key={permission.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{permission.action}</div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{permission.description || t("noDescription")}</div>
                        </li>
                      ))}
                    </ul>
                    {permissions.length > 6 && (
                      <div className="mt-6 text-center">
                        <Link
                          href={`/admin/roles/${roleId}/permissions`}
                          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          {t("viewAllPermissions", { count: permissions.length - 6 })}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Role users preview */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t("roleUsers")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("roleUsersDesc")}
                  </p>
                </div>
                <Link
                  href={`/admin/roles/${roleId}/users`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-100 dark:bg-indigo-700/30 dark:hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  {t("manageUsers")}
                </Link>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {users.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("noUsers")}
                    </p>
                    <Link
                      href={`/admin/roles/${roleId}/users`}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                    >
                      {t("assignUsers")}
                    </Link>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {users.slice(0, 5).map((user) => (
                        <li key={user.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <span className="text-indigo-800 dark:text-indigo-200 font-medium">
                                  {user.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                            <div>
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-100 dark:bg-indigo-700/30 dark:hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                              >
                                {t("view")}
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {users.length > 5 && (
                      <div className="mt-6 text-center">
                        <Link
                          href={`/admin/roles/${roleId}/users`}
                          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          {t("viewAllUsers", { count: users.length - 5 })}
                        </Link>
                      </div>
                    )}
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
