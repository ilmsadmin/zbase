"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";

export default function CreateRolePage() {
  const t = useTranslations("admin.roles");
  const router = useRouter();
  
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
    
    // Clear field-specific error when user types
    if (name === "name") {
      setNameError("");
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError("");
    setError("");
    
    // Validate name
    if (!newRole.name.trim()) {
      setNameError(t("errors.nameRequired"));
      isValid = false;
    } else if (newRole.name.length < 2) {
      setNameError(t("errors.nameTooShort"));
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const createdRole = await apiClient.post("/roles", newRole);
      router.push(`/admin/roles/${createdRole.id}`);
    } catch (err) {
      console.error("Error creating role:", err);
      setError(t("errors.createFailed"));
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <MainLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header and back button */}
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/admin/roles"
                className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
              >
                <FiArrowLeft className="mr-2" /> {t("backToRoles")}
              </Link>
            </div>

            {/* Page title */}
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                  {t("createNewRole")}
                </h2>
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

            {/* Role form */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("roleName")} *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={newRole.name}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${
                            nameError ? "border-red-300 dark:border-red-700 ring-1 ring-red-500" : ""
                          }`}
                          placeholder={t("roleNamePlaceholder")}
                        />
                        {nameError && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameError}</p>
                        )}
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
                          rows={4}
                          value={newRole.description}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder={t("roleDescriptionPlaceholder")}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {t("roleDescriptionHelp")}
                      </p>
                    </div>
                    
                    <div className="pt-5">
                      <div className="flex justify-end">
                        <Link
                          href="/admin/roles"
                          className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                        >
                          {t("cancel")}
                        </Link>
                        <button
                          type="submit"
                          disabled={loading}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiSave className={`mr-2 ${loading ? "animate-pulse" : ""}`} />
                          {loading ? t("saving") : t("createRole")}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Role creation tips */}
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-indigo-800 dark:text-indigo-300">
                  {t("roleTips.title")}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-indigo-700 dark:text-indigo-400">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t("roleTips.tip1")}</li>
                    <li>{t("roleTips.tip2")}</li>
                    <li>{t("roleTips.tip3")}</li>
                    <li>{t("roleTips.tip4")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
