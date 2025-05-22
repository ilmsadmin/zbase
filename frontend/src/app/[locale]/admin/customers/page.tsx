"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiRefreshCw, FiUsers } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { DataTable, Column } from "@/components/ui/Table/DataTable";
import { formatDateTime } from "@/lib/utils/format";

// Define the Customer type
interface Customer {
  id: number;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  groupId?: number;
  group?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Define the customer service
const customerService = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await fetch('/api/customers');
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  },
  deleteCustomer: async (id: number): Promise<void> => {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }
  }
};

export default function CustomersPage() {
  const t = useTranslations("admin.customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await customerService.deleteCustomer(id);
        // Remove the deleted customer from the state
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (err) {
        console.error("Error deleting customer:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  // Define table columns
  const columns: Column<Customer>[] = [
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
      key: "phone",
      header: t("columns.phone"),
      sortable: true
    },
    {
      key: "email",
      header: t("columns.email"),
      sortable: true
    },
    {
      key: "group",
      header: t("columns.group"),
      render: (row) => row.group?.name || '-',
      sortable: true
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
          <Link href={`/admin/customers/${row.id}`}>
            <button className="p-1 text-blue-600 hover:text-blue-800" title={t("view")}>
              <FiEye size={18} />
            </button>
          </Link>
          <Link href={`/admin/customers/${row.id}/edit`}>
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
              <FiUsers size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchCustomers}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiRefreshCw className="mr-2" /> {t("refresh")}
              </button>
              <Link href="/admin/customers/new">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                  <FiPlus className="mr-2" /> {t("new")}
                </button>
              </Link>
            </div>
          </div>

          {/* Search and filters section */}
          <div className="p-6 border-b border-gray-200">
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
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Customer table */}
          <div className="p-6">
            <DataTable 
              columns={columns}
              data={customers}
              isLoading={loading}
              onRowClick={(row) => window.location.href = `/admin/customers/${row.id}`}
              exportable
              exportFilename="customers-list"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
