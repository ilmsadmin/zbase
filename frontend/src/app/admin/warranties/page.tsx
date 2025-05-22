"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, 
  FiRefreshCw, FiFilter, FiDownload, FiCalendar, FiTool 
} from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { DataTable, DataTableColumn as Column } from "@/components/ui/Table";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";
import { 
  Warranty, WarrantyStatus, WarrantyFilter, 
  warrantyService 
} from "@/lib/api/services/warranty";
import { useRouter } from "next/navigation";

// Helper function to get a status badge class
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case WarrantyStatus.PROCESSING:
      return 'bg-blue-100 text-blue-800';
    case WarrantyStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case WarrantyStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case WarrantyStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function WarrantiesPage() {
  const t = useTranslations("admin.warranties");
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<WarrantyFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const itemsPerPage = 20;
  
  const fetchWarranties = async (page = currentPage) => {
    setLoading(true);
    setError("");
    try {
      const data = await warrantyService.getAllWarranties(filters, page, itemsPerPage);
      setWarranties(data.items);
      setTotalPages(data.meta.pages);
      setTotalItems(data.meta.total);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching warranties:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await warrantyService.deleteWarranty(id);
        // Remove the deleted warranty from the state
        setWarranties(warranties.filter(warranty => warranty.id !== id));
      } catch (err) {
        console.error("Error deleting warranty:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, code: searchTerm });
    setCurrentPage(1);
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const columns: Column<Warranty>[] = [
    {
      key: "code",
      header: t("table.code"),
      cell: (row) => (
        <Link href={`/admin/warranties/${row.id}`} className="text-blue-600 hover:text-blue-800">
          {row.code}
        </Link>
      ),
    },
    {
      key: "product",
      header: t("table.product"),
      cell: (row) => (
        row.product ? (
          <Link href={`/admin/products/${row.productId}`} className="text-blue-600 hover:text-blue-800">
            {row.product.name}
          </Link>
        ) : (
          "-"
        )
      ),
    },
    {
      key: "customer",
      header: t("table.customer"),
      cell: (row) => (
        row.customer ? (
          <Link href={`/admin/customers/${row.customerId}`} className="text-blue-600 hover:text-blue-800">
            {row.customer.name}
          </Link>
        ) : (
          "-"
        )
      ),
    },
    {
      key: "serialNumber",
      header: t("table.serialNumber"),
      cell: (row) => row.serialNumber || "-",
    },
    {
      key: "receivedDate",
      header: t("table.receivedDate"),
      cell: (row) => formatDateTime(row.receivedDate),
    },
    {
      key: "expectedReturnDate",
      header: t("table.expectedReturnDate"),
      cell: (row) => formatDateTime(row.expectedReturnDate),
    },
    {
      key: "status",
      header: t("table.status"),
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row.status)}`}>
          {t(`statuses.${row.status}`)}
        </span>
      ),
    },
    {
      key: "technician",
      header: t("table.technician"),
      cell: (row) => row.technician ? row.technician.name : "-",
    },
    {
      key: "actions",
      header: t("table.actions"),
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/warranties/${row.id}`}
            className="text-blue-600 hover:text-blue-900"
            title={t("view")}
          >
            <FiEye size={18} />
          </Link>
          <Link
            href={`/admin/warranties/${row.id}/edit`}
            className="text-yellow-600 hover:text-yellow-900"
            title={t("edit")}
          >
            <FiEdit size={18} />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900"
            title={t("delete")}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{t("title")}</h1>
            <p className="text-gray-600">{t("description")}</p>
          </div>
          <Link
            href="/admin/warranties/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FiPlus className="mr-2" /> {t("new")}
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="border rounded-l py-2 px-4 w-80 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r"
                >
                  <FiSearch />
                </button>
              </div>
            </form>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`border ${showFilters ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'} py-2 px-4 rounded flex items-center`}
              >
                <FiFilter className="mr-2" /> {t("filters")}
              </button>
              <button
                onClick={() => fetchWarranties(currentPage)}
                className="border hover:bg-gray-50 py-2 px-4 rounded flex items-center"
                title={t("refresh")}
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
              </button>
              <button
                className="border hover:bg-gray-50 py-2 px-4 rounded flex items-center"
                title={t("export")}
              >
                <FiDownload className="mr-2" /> {t("export")}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("filters.status")}</label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                  className="w-full border rounded py-2 px-3"
                >
                  <option value="">{t("filters.all")}</option>
                  <option value={WarrantyStatus.PENDING}>{t("statuses.pending")}</option>
                  <option value={WarrantyStatus.PROCESSING}>{t("statuses.processing")}</option>
                  <option value={WarrantyStatus.COMPLETED}>{t("statuses.completed")}</option>
                  <option value={WarrantyStatus.REJECTED}>{t("statuses.rejected")}</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">{t("filters.startDate")}</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) => handleFilterChange("startDate", e.target.value || undefined)}
                      className="w-full border rounded py-2 px-3 pr-8"
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">{t("filters.endDate")}</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) => handleFilterChange("endDate", e.target.value || undefined)}
                      className="w-full border rounded py-2 px-3 pr-8"
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("filters.serialNumber")}</label>
                <input
                  type="text"
                  value={filters.serialNumber || ""}
                  onChange={(e) => handleFilterChange("serialNumber", e.target.value || undefined)}
                  className="w-full border rounded py-2 px-3"
                  placeholder={t("filters.enterSerialNumber")}
                />
              </div>
              
              <div className="flex justify-end items-end">
                <button
                  onClick={clearFilters}
                  className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border rounded"
                >
                  {t("filters.clear")}
                </button>
              </div>
            </div>
          )}

          <DataTable
            columns={columns}
            data={warranties}
            loading={loading}
            pagination={{
              currentPage,
              totalPages,
              totalItems,
              onPageChange: (page) => fetchWarranties(page),
              itemsPerPage,
            }}
            emptyState={{
              message: t("emptyState"),
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
