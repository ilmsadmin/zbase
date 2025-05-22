"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiRefreshCw, FiBriefcase } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { DataTable, Column } from "@/components/ui/Table/DataTable";
import { formatDateTime } from "@/lib/utils/format";

// Define the Partner type
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
  createdAt: string;
  updatedAt: string;
}

// Define the partner service
const partnerService = {
  getAllPartners: async (): Promise<Partner[]> => {
    const response = await fetch('/api/partners');
    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }
    return response.json();
  },
  deletePartner: async (id: number): Promise<void> => {
    const response = await fetch(`/api/partners/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete partner');
    }
  }
};

export default function PartnersPage() {
  const t = useTranslations("admin.partners");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await partnerService.getAllPartners();
      setPartners(data);
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await partnerService.deletePartner(id);
        // Remove the deleted partner from the state
        setPartners(partners.filter(partner => partner.id !== id));
      } catch (err) {
        console.error("Error deleting partner:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  // Filter partners by category if a filter is selected
  const filteredPartners = filterCategory 
    ? partners.filter(partner => partner.category === filterCategory)
    : partners;

  // Define table columns
  const columns: Column<Partner>[] = [
    {
      key: "code",
      header: t("columns.code"),
      sortable: true
    },
    {
      key: "name",
      header: t("columns.name"),
      sortable: true
    },
    {
      key: "category",
      header: t("columns.category"),
      render: (row) => t(`categories.${row.category}`),
      sortable: true
    },
    {
      key: "contactName",
      header: t("columns.contactName"),
      render: (row) => row.contactName || '-',
      sortable: true
    },
    {
      key: "phone",
      header: t("columns.phone"),
      render: (row) => row.phone || '-',
      sortable: true
    },
    {
      key: "status",
      header: t("columns.status"),
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full 
          ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {t(`status.${row.status}`)}
        </span>
      ),
      sortable: true,
      align: 'center'
    },
    {
      key: "createdAt",
      header: t("columns.createdAt"),
      render: (row) => formatDateTime(row.createdAt),
      sortable: true
    },
    {
      key: "actions",
      header: t("columns.actions"),
      render: (row) => (
        <div className="flex space-x-2">
          <Link href={`/admin/partners/${row.id}`}>
            <button className="p-1 text-blue-600 hover:text-blue-800" title={t("view")}>
              <FiEye size={18} />
            </button>
          </Link>
          <Link href={`/admin/partners/${row.id}/edit`}>
            <button className="p-1 text-green-600 hover:text-green-800" title={t("edit")}>
              <FiEdit size={18} />
            </button>
          </Link>
          <button 
            className="p-1 text-red-600 hover:text-red-800" 
            title={t("delete")}
            onClick={() => handleDelete(row.id)}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      align: 'center',
      width: '150px'
    }
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header with title and action buttons */}
          <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <FiBriefcase size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchPartners}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiRefreshCw className="mr-2" /> {t("refresh")}
              </button>
              <Link href="/admin/partners/new">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                  <FiPlus className="mr-2" /> {t("new")}
                </button>
              </Link>
            </div>
          </div>

          {/* Search and filters section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder={t("searchPlaceholder")}
                />
              </div>
              
              {/* Category filter */}
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={filterCategory || ''}
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                  <option value="">{t("filters.allCategories")}</option>
                  <option value="supplier">{t("categories.supplier")}</option>
                  <option value="manufacturer">{t("categories.manufacturer")}</option>
                  <option value="distributor">{t("categories.distributor")}</option>
                  <option value="other">{t("categories.other")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Partners table */}
          <div className="p-6">
            <DataTable 
              columns={columns}
              data={filteredPartners}
              isLoading={loading}
              onRowClick={(row) => window.location.href = `/admin/partners/${row.id}`}
              exportable
              exportFilename="partners-list"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
