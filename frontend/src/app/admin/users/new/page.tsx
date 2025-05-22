"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import MainLayout from "@/components/layouts/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { apiClient } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";

type Role = {
  id: string;
  name: string;
  description: string;
};

export default function CreateUserPage() {
  const t = useTranslations("admin.users");
  const router = useRouter();
  
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    roleIds: [] as number[],
  });
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Fetch roles for role selection
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await apiClient.get("/roles");
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    
    // Clear field-specific error when user types
    if (name in fieldErrors) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setNewUser({ ...newUser, roleIds: selectedOptions });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: "",
      password: "",
      name: "",
    };
    
    // Reset errors
    setError("");
    
    // Validate email
    if (!newUser.email.trim()) {
      errors.email = t("errors.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = t("errors.invalidEmail");
      isValid = false;
    }
    
    // Validate password
    if (!newUser.password.trim()) {
      errors.password = t("errors.passwordRequired");
      isValid = false;
    } else if (newUser.password.length < 6) {
      errors.password = t("errors.passwordTooShort");
      isValid = false;
    }
    
    // Validate name
    if (!newUser.name.trim()) {
      errors.name = t("errors.nameRequired");
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
      await apiClient.post("/users", newUser);
      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || t("errors.createFailed"));
    } finally {
      setLoading(false);
    }
  };

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
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t("createUser")}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t("createUserDescription")}
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
                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("form.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newUser.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                    )}
                  </div>
                  
                  {/* Password field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("form.password")} *
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={newUser.password}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                    )}
                  </div>
                  
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("form.name")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newUser.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        fieldErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Roles field */}
                  <div>
                    <label htmlFor="roles" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("form.roles")}
                    </label>
                    <select
                      id="roles"
                      name="roles"
                      multiple
                      onChange={handleRoleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t("form.rolesHint")}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link
                    href="/admin/users"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 mr-3"
                  >
                    {t("cancel")}
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t("saving")}
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" /> {t("save")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
