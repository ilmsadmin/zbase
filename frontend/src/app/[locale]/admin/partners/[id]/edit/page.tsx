"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FiSave, FiX, FiArrowLeft } from "react-icons/fi";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

// Define Partner interface
interface Partner {
  id: number;
  code: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
  website?: string;
  category: 'supplier' | 'manufacturer' | 'distributor' | 'other';
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Define partner service
const partnerService = {
  getPartnerById: async (id: number): Promise<Partner> => {
    const response = await fetch(`/api/partners/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch partner");
    }
    return response.json();
  },
  updatePartner: async (id: number, data: Partial<Partner>): Promise<Partner> => {
    const response = await fetch(`/api/partners/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update partner");
    }
    return response.json();
  }
};

export default function PartnerEditPage({ params }: PageProps) {
  const t = useTranslations("admin.partners");
  const router = useRouter();
  const { id } = params;
  const partnerId = parseInt(id, 10);

  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: "",
    code: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    taxId: "",
    website: "",
    category: "supplier",
    status: "active",
    notes: "",
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const partnerData = await partnerService.getPartnerById(partnerId);
      setPartner(partnerData);
      
      // Initialize form with partner data
      setFormData({
        name: partnerData.name || "",
        code: partnerData.code || "",
        contactName: partnerData.contactName || "",
        phone: partnerData.phone || "",
        email: partnerData.email || "",
        address: partnerData.address || "",
        taxId: partnerData.taxId || "",
        website: partnerData.website || "",
        category: partnerData.category || "supplier",
        status: partnerData.status || "active",
        notes: partnerData.notes || "",
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [partnerId]);

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
      await partnerService.updatePartner(partnerId, formData);
      router.push(`/admin/partners/${partnerId}`);
    } catch (err) {
      console.error("Error updating partner:", err);
      setError(t("errors.updateFailed"));
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

  if (error && !partner) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-600">{error}</div>
            <Link href="/admin/partners" className="text-primary hover:underline mt-4 inline-block">
              <FiArrowLeft className="inline mr-2" /> {t("backToList")}
            </Link>
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
              <Link href={`/admin/partners/${partnerId}`} className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                {t("edit")} - {partner?.name}
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
              {/* Partner Basic Info */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                    {t("fields.category")} *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="supplier">{t("categories.supplier")}</option>
                    <option value="manufacturer">{t("categories.manufacturer")}</option>
                    <option value="distributor">{t("categories.distributor")}</option>
                    <option value="other">{t("categories.other")}</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contactName">
                    {t("fields.contactName")}
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    value={formData.contactName || ""}
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
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t("additionalInfo")}</h2>

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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taxId">
                    {t("fields.taxId")}
                  </label>
                  <input
                    id="taxId"
                    name="taxId"
                    type="text"
                    value={formData.taxId || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
                    {t("fields.website")}
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
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
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end">
              <Link href={`/admin/partners/${partnerId}`}>
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
