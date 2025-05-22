"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FiSave, FiX, FiArrowLeft } from "react-icons/fi";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link } from "@/i18n/navigation";

// Define Customer interface
interface Customer {
  id?: number;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  groupId?: number;
  notes?: string;
  status?: string;
}

// Define CustomerGroup interface
interface CustomerGroup {
  id: number;
  name: string;
}

// Define customer service
const customerService = {
  createCustomer: async (data: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await fetch(`/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create customer");
    }
    return response.json();
  },
  getAllCustomerGroups: async (): Promise<CustomerGroup[]> => {
    const response = await fetch(`/api/customer-groups`);
    if (!response.ok) {
      throw new Error("Failed to fetch customer groups");
    }
    return response.json();
  },
  generateCustomerCode: async (): Promise<string> => {
    const response = await fetch(`/api/customers/generate-code`);
    if (!response.ok) {
      throw new Error("Failed to generate customer code");
    }
    const data = await response.json();
    return data.code;
  }
};

export default function CustomerNewPage() {
  const t = useTranslations("admin.customers");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);

  // Form state
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: "",
    code: "",
    phone: "",
    email: "",
    address: "",
    groupId: undefined,
    notes: "",
    status: "active",
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupsData, generatedCode] = await Promise.all([
        customerService.getAllCustomerGroups(),
        customerService.generateCustomerCode(),
      ]);
      setCustomerGroups(groupsData);
      
      // Initialize form with generated code
      setFormData(prev => ({
        ...prev,
        code: generatedCode
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const newCustomer = await customerService.createCustomer(formData);
      router.push(`/admin/customers/${newCustomer.id}`);
    } catch (err) {
      console.error("Error creating customer:", err);
      setError(t("errors.createFailed"));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin/customers" className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                {t("new")}
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t("basicInfo")}</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                    {t("fields.code")} *
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                  <p className="mt-1 text-xs text-gray-500">{t("codeHelp")}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    {t("fields.name")} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                    {t("fields.phone")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    {t("fields.email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                    {t("fields.address")}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t("additionalInfo")}</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="groupId">
                    {t("fields.group")}
                  </label>
                  <select
                    id="groupId"
                    name="groupId"
                    value={formData.groupId || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="">{t("selectGroup")}</option>
                    {customerGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                    {t("fields.status")}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || "active"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="active">{t("status.active")}</option>
                    <option value="inactive">{t("status.inactive")}</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    {t("fields.notes")}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end">
              <Link href="/admin/customers">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md mr-2 flex items-center"
                >
                  <FiX className="mr-2" /> {t("cancel")}
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-md flex items-center disabled:opacity-50"
              >
                <FiSave className="mr-2" /> {saving ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
