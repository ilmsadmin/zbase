"use client";

import { useState, useEffect } from "react";
// Removed useParams import for locale migration;
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiUsers, FiRefreshCw, FiSearch, FiPlus, FiUserMinus, FiUserPlus, FiX } from "react-icons/fi";

type Role = {
  id: string;
  name: string;
  description: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  hasRole?: boolean;
};

export default function RoleUsersPage() {
  const t = useTranslations("admin.roles");
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  
  const [role, setRole] = useState<Role | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [roleUsers, setRoleUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [roleData, allUsersData, roleUsersData] = await Promise.all([
        apiClient.get(`/roles/${roleId}`),
        apiClient.get("/users"),
        apiClient.get(`/roles/${roleId}/users`),
      ]);
      
      setRole(roleData);
      setRoleUsers(roleUsersData);
      
      // Mark users that already have this role
      const roleUserIds = roleUsersData.map((u: User) => u.id);
      const formattedAllUsers = allUsersData.map((u: User) => ({
        ...u,
        hasRole: roleUserIds.includes(u.id)
      }));
      
      setAllUsers(formattedAllUsers);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleId]);

  const handleToggleUserRole = async (userId: string, hasRole: boolean) => {
    if (saving) return;
    
    setSaving(true);
    try {
      if (!hasRole) {
        // Assign role to user
        await apiClient.post(`/users/${userId}/roles/${roleId}`);
        
        // Update local state
        setAllUsers(allUsers.map(u => 
          u.id === userId ? { ...u, hasRole: true } : u
        ));
        
        // Add to role users
        const userToAdd = allUsers.find(u => u.id === userId);
        if (userToAdd) {
          setRoleUsers([...roleUsers, { ...userToAdd, hasRole: true }]);
        }
      } else {
        // Remove role from user
        await apiClient.delete(`/users/${userId}/roles/${roleId}`);
        
        // Update local state
        setAllUsers(allUsers.map(u => 
          u.id === userId ? { ...u, hasRole: false } : u
        ));
        
        // Remove from role users
        setRoleUsers(roleUsers.filter(u => u.id !== userId));
      }
      
      setShowAddUserModal(false);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError(hasRole ? t("errors.removeUserFailed") : t("errors.addUserFailed"));
    } finally {
      setSaving(false);
    }
  };

  const filteredAllUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredRoleUsers = roleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filtering users who don't already have the role (for the add user modal)
  const usersWithoutRole = allUsers.filter(user => !user.hasRole);
  const filteredUsersWithoutRole = usersWithoutRole.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Link
                  href={`/admin/roles/${roleId}`}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToRole")}
                </Link>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchData}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiRefreshCw className="mr-2" /> {t("refresh")}
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiUserPlus className="mr-2" /> {t("addUser")}
                </button>
              </div>
            </div>

            {/* Header with role info */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white shadow rounded-lg mb-6 p-6">
              <div className="flex items-center">
                <FiUsers className="h-12 w-12 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold">{t("manageUsersFor", { roleName: role.name })}</h2>
                  <p className="mt-1">{role.description || t("noDescription")}</p>
                  <div className="mt-3 text-green-100">
                    <span className="text-sm bg-green-800/40 rounded-full px-3 py-1">
                      {roleUsers.length} {t("usersAssigned")}
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
                    placeholder={t("searchUsers")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("usersWithRole", { roleName: role.name })}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("usersWithRoleDesc")}
                </p>
              </div>
              
              <div className="px-4 sm:px-6 py-5">
                {filteredRoleUsers.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? t("noUsersFound") : t("noUsersAssigned")}
                    </p>
                    {searchTerm ? (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                      >
                        {t("clearSearch")}
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                      >
                        <FiUserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                        {t("addUser")}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t("user")}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t("email")}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t("createdAt")}
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredRoleUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                    <span className="text-indigo-800 dark:text-indigo-200 font-medium">
                                      {user.name.substring(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <Link
                                  href={`/admin/users/${user.id}`}
                                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                >
                                  {t("view")}
                                </Link>
                                <button
                                  onClick={() => handleToggleUserRole(user.id, true)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                  disabled={saving}
                                >
                                  {t("remove")}
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
            
            {/* Add user modal */}
            {showAddUserModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                  </div>

                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  
                  <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                          <FiUserPlus className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                            {t("addUserToRole", { roleName: role.name })}
                          </h3>
                          <div className="mt-4">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t("searchUsersToAdd")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            
                            <div className="mt-4 max-h-60 overflow-y-auto">
                              {filteredUsersWithoutRole.length === 0 ? (
                                <div className="text-center py-4">
                                  <p className="text-gray-500 dark:text-gray-400">
                                    {t("noUsersToAdd")}
                                  </p>
                                </div>
                              ) : (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {filteredUsersWithoutRole.map((user) => (
                                    <li key={user.id} className="py-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                              <span className="text-indigo-800 dark:text-indigo-200 font-medium text-xs">
                                                {user.name.substring(0, 2).toUpperCase()}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleToggleUserRole(user.id, false)}
                                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-100 dark:bg-indigo-700/30 dark:hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                                          disabled={saving}
                                        >
                                          <FiPlus className="mr-1 h-4 w-4" />
                                          {t("add")}
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowAddUserModal(false)}
                      >
                        {t("close")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
