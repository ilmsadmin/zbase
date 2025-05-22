"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FiArrowLeft, FiCheck, FiShield, FiSave, FiRefreshCw, FiSearch, FiPlus, FiX } from "react-icons/fi";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link, useRouter } from "@/i18n/navigation";
import { apiClient } from "@/lib/api/client";
import RoleGuard from "@/components/auth/RoleGuard";

interface PageProps {
  params: {
    id: string;
  };
}

type Employee = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

type Role = {
  id: string;
  name: string;
  description: string;
  isAssigned?: boolean;
};

export default function EmployeeRolesPage({ params }: PageProps) {
  const t = useTranslations("admin.employees");
  const router = useRouter();
  const { id } = params;
  const employeeId = parseInt(id, 10);
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  
  // Fetch employee and roles data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Get employee data
      const employeeData = await apiClient.get(`/users/${employeeId}`);
      setEmployee(employeeData);
      
      // Get all roles
      const allRolesData = await apiClient.get("/roles");
      
      // Mark roles that are already assigned to the employee
      const employeeRoleIds = employeeData.roles || [];
      const formattedRoles = allRolesData.map((role: Role) => ({
        ...role,
        isAssigned: employeeRoleIds.includes(role.name)
      }));
      
      setRoles(formattedRoles);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const handleToggleRole = async (roleId: string, currentlyAssigned: boolean) => {
    if (!employee || saving) return;
    
    setSaving(true);
    try {
      if (currentlyAssigned) {
        // Remove role
        await apiClient.delete(`/users/${employeeId}/roles/${roleId}`);
      } else {
        // Add role
        await apiClient.post(`/users/${employeeId}/roles/${roleId}`);
      }
      
      // Update local state
      setRoles(roles.map(role => 
        role.id === roleId ? { ...role, isAssigned: !currentlyAssigned } : role
      ));
      
      // Show success message
      // ...
      
    } catch (err) {
      console.error("Error updating roles:", err);
      setError(t("errors.roleUpdateFailed"));
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Split into assigned and available roles
  const assignedRoles = filteredRoles.filter(role => role.isAssigned);
  const availableRoles = filteredRoles.filter(role => !role.isAssigned);

  if (loading) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    );
  }

  if (!employee) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("errors.employeeNotFound")}
                </h2>
                <Link
                  href="/admin/employees"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiArrowLeft className="mr-2" /> {t("backToEmployees")}
                </Link>
              </div>
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb and actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Link
                  href="/admin/employees"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  {t("title")}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href={`/admin/employees/${employeeId}`}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  {employee.name}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("roles.title")}
                </span>
              </div>

              <div>
                <button
                  onClick={fetchData}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                >
                  <FiRefreshCw className="mr-2" /> {t("refresh")}
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

            {/* Header with user info */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow rounded-lg mb-6 p-6">
              <div className="flex items-center">
                <FiShield className="h-12 w-12 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold">
                    {t("roles.description")}
                  </h2>
                  <div className="mt-2">
                    <div className="text-lg font-medium">{employee.name}</div>
                    <div className="text-indigo-100">{employee.email}</div>
                  </div>
                  <div className="mt-3 text-indigo-100">
                    <span className="text-sm bg-indigo-800/40 rounded-full px-3 py-1">
                      {assignedRoles.length} {t("employeeDetails.assignedRoles")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                    placeholder={t("search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Two column layout for roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned Roles */}
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t("roles.assigned")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("employeeDetails.assignedRoles")}
                  </p>
                </div>
                
                <div className="px-4 sm:px-6 py-5">
                  {assignedRoles.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm ? t("search.clearFilters") : t("employeeDetails.noRolesAssigned")}
                      </p>
                      
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        >
                          {t("search.clearFilters")}
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {assignedRoles.map((role) => (
                        <li key={role.id} className="py-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {role.description || t("noDescription")}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleRole(role.id, true)}
                              disabled={saving}
                              className="ml-4 inline-flex items-center p-1.5 border border-red-300 dark:border-red-600 rounded-full shadow-sm text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-900"
                            >
                              <FiX className="h-5 w-5" />
                              <span className="sr-only">{t("roles.removeRole")}</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Available Roles */}
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t("roles.available")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {t("roles.description")}
                  </p>
                </div>
                
                <div className="px-4 sm:px-6 py-5">
                  {availableRoles.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm ? t("noRolesFound") : t("noRolesAvailable")}
                      </p>
                      
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        >
                          {t("search.clearFilters")}
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {availableRoles.map((role) => (
                        <li key={role.id} className="py-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {role.description || t("noDescription")}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleRole(role.id, false)}
                              disabled={saving}
                              className="ml-4 inline-flex items-center p-1.5 border border-green-300 dark:border-green-600 rounded-full shadow-sm text-green-600 dark:text-green-400 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:ring-offset-gray-900"
                            >
                              <FiPlus className="h-5 w-5" />
                              <span className="sr-only">{t("roles.addRole")}</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Back button */}
            <div className="mt-6">
              <Link
                href={`/admin/employees/${employeeId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
              >
                <FiArrowLeft className="mr-2" /> {t("backToEmployee")}
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RoleGuard>
  );
}
