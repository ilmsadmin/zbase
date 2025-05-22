"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";

export default function NewEmployeePage() {
  const t = useTranslations("admin.employees");
  const router = useRouter();
  
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    position: "",
    status: "active"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
    
    // Clear field-specific error when user types
    if (name in fieldErrors) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };
    
    // Reset errors
    setError("");
    
    // Validate name
    if (!newEmployee.name.trim()) {
      errors.name = t("createForm.nameRequired");
      isValid = false;
    }
    
    // Validate email
    if (!newEmployee.email.trim()) {
      errors.email = t("createForm.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      errors.email = t("createForm.emailInvalid");
      isValid = false;
    }
    
    // Validate password
    if (!newEmployee.password.trim()) {
      errors.password = t("createForm.passwordRequired");
      isValid = false;
    } else if (newEmployee.password.length < 8) {
      errors.password = t("createForm.passwordTooShort");
      isValid = false;
    }
    
    // Validate password confirmation
    if (newEmployee.password !== newEmployee.passwordConfirm) {
      errors.passwordConfirm = t("createForm.passwordNoMatch");
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Remove passwordConfirm from the payload
      const { passwordConfirm, ...employeeData } = newEmployee;
      await apiClient.post("/users", employeeData);
      router.push("/admin/employees");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating employee:", err);
      setError(err.response?.data?.message || t("errors.createFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href="/admin/employees"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiArrowLeft className="mr-1" /> {t("backToEmployees")}
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("createForm.title")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("createForm.description")}
                </p>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mx-4 mt-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
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
              
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.nameLabel")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newEmployee.name}
                      onChange={handleChange}
                      placeholder={t("createForm.namePlaceholder")}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.emailLabel")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newEmployee.email}
                      onChange={handleChange}
                      placeholder={t("createForm.emailPlaceholder")}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                    )}
                  </div>
                  
                  {/* Password field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.passwordLabel")} *
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={newEmployee.password}
                      onChange={handleChange}
                      placeholder={t("createForm.passwordPlaceholder")}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                    )}
                  </div>
                  
                  {/* Password confirmation field */}
                  <div>
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.passwordConfirmLabel")} *
                    </label>
                    <input
                      type="password"
                      name="passwordConfirm"
                      id="passwordConfirm"
                      value={newEmployee.passwordConfirm}
                      onChange={handleChange}
                      placeholder={t("createForm.passwordConfirmPlaceholder")}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.passwordConfirm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.passwordConfirm && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.passwordConfirm}</p>
                    )}
                  </div>
                  
                  {/* Phone field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.phoneLabel")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={newEmployee.phone}
                      onChange={handleChange}
                      placeholder={t("createForm.phonePlaceholder")}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  {/* Position field */}
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.positionLabel")}
                    </label>
                    <input
                      type="text"
                      name="position"
                      id="position"
                      value={newEmployee.position}
                      onChange={handleChange}
                      placeholder={t("createForm.positionPlaceholder")}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  {/* Status field */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("createForm.statusLabel")}
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newEmployee.status}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="active">{t("createForm.statusOptions.active")}</option>
                      <option value="inactive">{t("createForm.statusOptions.inactive")}</option>
                    </select>
                  </div>
                  
                  {/* Form actions */}
                  <div className="flex justify-end space-x-3">
                    <Link
                      href="/admin/employees"
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-900"
                    >
                      {t("createForm.cancel")}
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave className="mr-2" />
                      {loading ? t("saving") : t("createForm.submit")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RoleGuard>
  );
}
