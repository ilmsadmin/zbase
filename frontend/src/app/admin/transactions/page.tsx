"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, 
  FiRefreshCw, FiDollarSign, FiFilter, FiDownload, FiCalendar 
} from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { DataTable, DataTableColumn as Column } from "@/components/ui/Table";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";
import { 
  Transaction, TransactionType, TransactionStatus, 
  TransactionCategory, TransactionMethod, TransactionFilter, 
  transactionService 
} from "@/lib/api/services/transaction";
import { useRouter } from "next/navigation";

// Helper function to get a status badge class
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case TransactionStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case TransactionStatus.CANCELED:
      return 'bg-red-100 text-red-800';
    case TransactionStatus.FAILED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get transaction type badge class
const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case TransactionType.RECEIPT:
      return 'bg-blue-100 text-blue-800';
    case TransactionType.PAYMENT:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TransactionsPage() {
  const t = useTranslations("admin.transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const itemsPerPage = 20;
  
  const fetchTransactions = async (page = currentPage) => {
    setLoading(true);
    setError("");
    try {
      const data = await transactionService.getAllTransactions(filters, page, itemsPerPage);
      setTransactions(data.items);
      setTotalPages(data.meta.pages);
      setTotalItems(data.meta.total);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await transactionService.deleteTransaction(id);
        // Remove the deleted transaction from the state
        setTransactions(transactions.filter(transaction => transaction.id !== id));
      } catch (err) {
        console.error("Error deleting transaction:", err);
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

  const columns: Column<Transaction>[] = [
    {
      key: "code",
      header: t("table.code"),
      cell: (row) => (
        <Link href={`/admin/transactions/${row.id}`} className="text-blue-600 hover:text-blue-800">
          {row.code}
        </Link>
      ),
    },
    {
      key: "transactionType",
      header: t("table.type"),
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadgeClass(row.transactionType)}`}>
          {t(`transactionTypes.${row.transactionType}`)}
        </span>
      ),
    },
    {
      key: "amount",
      header: t("table.amount"),
      cell: (row) => formatCurrency(row.amount),
    },
    {
      key: "relatedTo",
      header: t("table.relatedTo"),
      cell: (row) => {
        if (row.customer) {
          return <span>Customer: <Link href={`/admin/customers/${row.customer.id}`} className="text-blue-600 hover:text-blue-800">{row.customer.name}</Link></span>;
        }
        if (row.partner) {
          return <span>Partner: <Link href={`/admin/partners/${row.partner.id}`} className="text-blue-600 hover:text-blue-800">{row.partner.name}</Link></span>;
        }
        if (row.invoice) {
          return <span>Invoice: <Link href={`/admin/invoices/${row.invoice.id}`} className="text-blue-600 hover:text-blue-800">{row.invoice.code}</Link></span>;
        }
        return "-";
      }
    },
    {
      key: "transactionMethod",
      header: t("table.method"),
      cell: (row) => t(`transactionMethods.${row.transactionMethod}`),
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
      key: "transactionDate",
      header: t("table.date"),
      cell: (row) => formatDateTime(row.transactionDate),
    },
    {
      key: "actions",
      header: t("table.actions"),
      cell: (row) => (
        <div className="flex space-x-2">
          <Link 
            href={`/admin/transactions/${row.id}`}
            className="p-2 text-blue-600 hover:text-blue-800"
            title={t("view")}
          >
            <FiEye />
          </Link>
          <Link 
            href={`/admin/transactions/${row.id}/edit`}
            className="p-2 text-yellow-600 hover:text-yellow-800"
            title={t("edit")}
          >
            <FiEdit />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:text-red-800"
            title={t("delete")}
          >
            <FiTrash2 />
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
            href="/admin/transactions/new"
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
                onClick={() => fetchTransactions(currentPage)}
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
                <label className="block text-sm font-medium mb-1">{t("filters.type")}</label>
                <select
                  value={filters.transactionType || ""}
                  onChange={(e) => handleFilterChange("transactionType", e.target.value || undefined)}
                  className="w-full border rounded py-2 px-3"
                >
                  <option value="">{t("filters.all")}</option>
                  <option value={TransactionType.RECEIPT}>{t("transactionTypes.receipt")}</option>
                  <option value={TransactionType.PAYMENT}>{t("transactionTypes.payment")}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("filters.status")}</label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                  className="w-full border rounded py-2 px-3"
                >
                  <option value="">{t("filters.all")}</option>
                  <option value={TransactionStatus.PENDING}>{t("statuses.pending")}</option>
                  <option value={TransactionStatus.COMPLETED}>{t("statuses.completed")}</option>
                  <option value={TransactionStatus.CANCELED}>{t("statuses.canceled")}</option>
                  <option value={TransactionStatus.FAILED}>{t("statuses.failed")}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("filters.category")}</label>
                <select
                  value={filters.category || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value || undefined)}
                  className="w-full border rounded py-2 px-3"
                >
                  <option value="">{t("filters.all")}</option>
                  <option value={TransactionCategory.SALE}>{t("categories.sale")}</option>
                  <option value={TransactionCategory.PURCHASE}>{t("categories.purchase")}</option>
                  <option value={TransactionCategory.EXPENSE}>{t("categories.expense")}</option>
                  <option value={TransactionCategory.INCOME}>{t("categories.income")}</option>
                  <option value={TransactionCategory.REFUND}>{t("categories.refund")}</option>
                  <option value={TransactionCategory.OTHER}>{t("categories.other")}</option>
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
                      className="w-full border rounded py-2 px-3"
                    />
                    <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">{t("filters.endDate")}</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) => handleFilterChange("endDate", e.target.value || undefined)}
                      className="w-full border rounded py-2 px-3"
                    />
                    <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="border hover:bg-gray-50 py-2 px-4 rounded"
                >
                  {t("filters.clear")}
                </button>
              </div>
            </div>
          )}
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500">{t("stats.totalTransactions")}</div>
              <div className="text-xl font-bold">{totalItems}</div>
            </div>
            {/* Add more stats as needed */}
          </div>

          <DataTable
            columns={columns}
            data={transactions}
            isLoading={loading}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: (page) => fetchTransactions(page),
            }}
            emptyMessage={t("noTransactions")}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
