"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiRefreshCw, FiFileText, FiFilter, FiDownload } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { DataTable, Column } from "@/components/ui/Table/DataTable";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";

// Define Invoice interface
interface Invoice {
  id: number;
  code: string;
  date: string;
  customerId: number;
  customer?: {
    id: number;
    name: string;
    code: string;
  };
  total: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Define Invoice service
const invoiceService = {
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return response.json();
  },
  deleteInvoice: async (id: number): Promise<void> => {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
  }
};

export default function InvoicesPage() {
  const t = useTranslations("admin.invoices");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: string, to: string}>({
    from: '',
    to: ''
  });

  const fetchInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await invoiceService.deleteInvoice(id);
        // Remove the deleted invoice from the state
        setInvoices(invoices.filter(invoice => invoice.id !== id));
      } catch (err) {
        console.error("Error deleting invoice:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    const searchMatch = !searchTerm || 
      invoice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatch = !statusFilter || invoice.status === statusFilter;
    
    // Payment status filter
    const paymentStatusMatch = !paymentStatusFilter || invoice.paymentStatus === paymentStatusFilter;
    
    // Date range filter
    let dateMatch = true;
    if (dateRangeFilter.from) {
      dateMatch = dateMatch && new Date(invoice.date) >= new Date(dateRangeFilter.from);
    }
    if (dateRangeFilter.to) {
      dateMatch = dateMatch && new Date(invoice.date) <= new Date(dateRangeFilter.to);
    }
    
    return searchMatch && statusMatch && paymentStatusMatch && dateMatch;
  });

  // Calculate totals for displayed invoices
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const totalPaid = filteredInvoices
    .filter(inv => inv.paymentStatus === 'paid')
    .reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const totalUnpaid = filteredInvoices
    .filter(inv => inv.paymentStatus === 'unpaid')
    .reduce((sum, invoice) => sum + invoice.grandTotal, 0);

  // Define table columns
  const columns: Column<Invoice>[] = [
    {
      key: "code",
      header: t("columns.code"),
      sortable: true
    },
    {
      key: "date",
      header: t("columns.date"),
      render: (row) => formatDateTime(row.date, 'date-only'),
      sortable: true
    },
    {
      key: "customer",
      header: t("columns.customer"),
      render: (row) => row.customer?.name || '-',
      sortable: true
    },
    {
      key: "grandTotal",
      header: t("columns.total"),
      render: (row) => formatCurrency(row.grandTotal),
      sortable: true,
      align: 'right'
    },
    {
      key: "status",
      header: t("columns.status"),
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full 
          ${row.status === 'completed' ? 'bg-green-100 text-green-800' : 
            row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            row.status === 'draft' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'}`}
        >
          {t(`status.${row.status}`)}
        </span>
      ),
      sortable: true,
      align: 'center'
    },
    {
      key: "paymentStatus",
      header: t("columns.paymentStatus"),
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full 
          ${row.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
            row.paymentStatus === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}`}
        >
          {t(`paymentStatus.${row.paymentStatus}`)}
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
          <Link href={`/admin/invoices/${row.id}`}>
            <button className="p-1 text-blue-600 hover:text-blue-800" title={t("view")}>
              <FiEye size={18} />
            </button>
          </Link>
          <Link href={`/admin/invoices/${row.id}/edit`}>
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
              <FiFileText size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchInvoices}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiRefreshCw className="mr-2" /> {t("refresh")}
              </button>
              <Link href="/admin/invoices/new">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                  <FiPlus className="mr-2" /> {t("new")}
                </button>
              </Link>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-700">{t("summary.total")}</h3>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-blue-600">{filteredInvoices.length} {t("summary.invoices")}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-700">{t("summary.paid")}</h3>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-green-600">
                {filteredInvoices.filter(inv => inv.paymentStatus === 'paid').length} {t("summary.invoices")}
              </p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-700">{t("summary.unpaid")}</h3>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(totalUnpaid)}</p>
              <p className="text-sm text-red-600">
                {filteredInvoices.filter(inv => inv.paymentStatus === 'unpaid').length} {t("summary.invoices")}
              </p>
            </div>
          </div>

          {/* Search and filters section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Status filter */}
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">{t("filters.allStatuses")}</option>
                  <option value="draft">{t("status.draft")}</option>
                  <option value="pending">{t("status.pending")}</option>
                  <option value="completed">{t("status.completed")}</option>
                  <option value="cancelled">{t("status.cancelled")}</option>
                </select>
              </div>
              
              {/* Payment status filter */}
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={paymentStatusFilter || ''}
                  onChange={(e) => setPaymentStatusFilter(e.target.value || null)}
                >
                  <option value="">{t("filters.allPaymentStatuses")}</option>
                  <option value="paid">{t("paymentStatus.paid")}</option>
                  <option value="partially_paid">{t("paymentStatus.partially_paid")}</option>
                  <option value="unpaid">{t("paymentStatus.unpaid")}</option>
                </select>
              </div>
              
              {/* Date filter button */}
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={dateRangeFilter.from}
                  onChange={(e) => setDateRangeFilter({...dateRangeFilter, from: e.target.value})}
                  placeholder={t("filters.fromDate")}
                />
                <input 
                  type="date"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={dateRangeFilter.to}
                  onChange={(e) => setDateRangeFilter({...dateRangeFilter, to: e.target.value})}
                  placeholder={t("filters.toDate")}
                />
              </div>
            </div>
            
            {/* Active filters */}
            {(statusFilter || paymentStatusFilter || dateRangeFilter.from || dateRangeFilter.to) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {statusFilter && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {t("filters.status")}: {t(`status.${statusFilter}`)}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setStatusFilter(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {paymentStatusFilter && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {t("filters.paymentStatus")}: {t(`paymentStatus.${paymentStatusFilter}`)}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setPaymentStatusFilter(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {dateRangeFilter.from && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {t("filters.from")}: {dateRangeFilter.from}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setDateRangeFilter({...dateRangeFilter, from: ''})}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {dateRangeFilter.to && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {t("filters.to")}: {dateRangeFilter.to}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setDateRangeFilter({...dateRangeFilter, to: ''})}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                <button 
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                  onClick={() => {
                    setStatusFilter(null);
                    setPaymentStatusFilter(null);
                    setDateRangeFilter({from: '', to: ''});
                  }}
                >
                  {t("filters.clearAll")}
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Invoices table */}
          <div className="p-6">
            <DataTable 
              columns={columns}
              data={filteredInvoices}
              isLoading={loading}
              onRowClick={(row) => window.location.href = `/admin/invoices/${row.id}`}
              exportable
              exportFilename="invoices-list"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
