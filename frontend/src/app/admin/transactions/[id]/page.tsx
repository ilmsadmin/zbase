"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { 
  FiEdit, FiTrash2, FiArrowLeft, FiCheck, FiX, 
  FiPrinter, FiDownload, FiFileText, FiUser, FiDollarSign 
} from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { 
  Transaction, TransactionStatus, TransactionType, 
  transactionService 
} from "@/lib/api/services/transaction";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";

export default function TransactionDetailPage() {
  const t = useTranslations("admin.transactions");
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get status badge class
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

  const fetchTransaction = async () => {
    setLoading(true);
    setError("");
    try {
      const id = Number(params.id);
      if (isNaN(id)) {
        setError(t("errors.invalidId"));
        setLoading(false);
        return;
      }

      const data = await transactionService.getTransactionById(id);
      setTransaction(data);
    } catch (err) {
      console.error("Error fetching transaction:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [params.id]);

  const handleDelete = async () => {
    if (!transaction) return;
    
    if (window.confirm(t("confirmDelete"))) {
      try {
        await transactionService.deleteTransaction(transaction.id);
        router.push("/admin/transactions");
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const handleStatusChange = async (status: TransactionStatus) => {
    if (!transaction) return;
    
    try {
      const updatedTransaction = await transactionService.updateTransaction(transaction.id, { status });
      setTransaction(updatedTransaction);
    } catch (err) {
      console.error("Error updating transaction status:", err);
      setError(t("errors.updateFailed"));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !transaction) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || t("errors.transactionNotFound")}
          </div>
          <Link 
            href="/admin/transactions"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center w-max"
          >
            <FiArrowLeft className="mr-2" /> {t("backToList")}
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link 
              href="/admin/transactions"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 mr-4 py-2 px-4 rounded flex items-center"
            >
              <FiArrowLeft className="mr-2" /> {t("backToList")}
            </Link>
            <h1 className="text-2xl font-semibold">{t("transactionDetails")}</h1>
          </div>
          <div className="flex space-x-2">
            <Link 
              href={`/admin/transactions/${transaction.id}/edit`}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded flex items-center"
            >
              <FiEdit className="mr-2" /> {t("edit")}
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center"
            >
              <FiTrash2 className="mr-2" /> {t("delete")}
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center"
              title={t("print")}
            >
              <FiPrinter className="mr-2" /> {t("print")}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {transaction.code}
                  </h2>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadgeClass(transaction.transactionType)} mr-2`}>
                      {t(`transactionTypes.${transaction.transactionType}`)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(transaction.status)}`}>
                      {t(`statuses.${transaction.status}`)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("transactionDate")}</div>
                  <div className="font-semibold">{formatDateTime(transaction.transactionDate)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-gray-500 text-sm">{t("amount")}</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(transaction.amount)}</div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm">{t("paymentMethod")}</div>
                  <div className="font-semibold">{t(`transactionMethods.${transaction.transactionMethod}`)}</div>
                  {transaction.paymentMethod && (
                    <div className="text-gray-500 text-sm mt-1">
                      {transaction.paymentMethod}
                    </div>
                  )}
                </div>
                
                {transaction.category && (
                  <div>
                    <div className="text-gray-500 text-sm">{t("category")}</div>
                    <div className="font-semibold">{t(`categories.${transaction.category}`)}</div>
                  </div>
                )}
                
                {transaction.reference && (
                  <div>
                    <div className="text-gray-500 text-sm">{t("reference")}</div>
                    <div className="font-semibold">{transaction.reference}</div>
                  </div>
                )}
                
                {transaction.dueDate && (
                  <div>
                    <div className="text-gray-500 text-sm">{t("dueDate")}</div>
                    <div className="font-semibold">{formatDateTime(transaction.dueDate)}</div>
                  </div>
                )}
              </div>

              {transaction.notes && (
                <div className="mb-6">
                  <div className="text-gray-500 text-sm">{t("notes")}</div>
                  <div className="bg-gray-50 p-3 rounded mt-1">{transaction.notes}</div>
                </div>
              )}

              {/* Banking information if available */}
              {(transaction.bankName || transaction.accountNumber || transaction.receiptNumber) && (
                <div className="border-t pt-4 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">{t("bankingDetails")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transaction.bankName && (
                      <div>
                        <div className="text-gray-500 text-sm">{t("bankName")}</div>
                        <div className="font-semibold">{transaction.bankName}</div>
                      </div>
                    )}
                    {transaction.accountNumber && (
                      <div>
                        <div className="text-gray-500 text-sm">{t("accountNumber")}</div>
                        <div className="font-semibold">{transaction.accountNumber}</div>
                      </div>
                    )}
                    {transaction.receiptNumber && (
                      <div>
                        <div className="text-gray-500 text-sm">{t("receiptNumber")}</div>
                        <div className="font-semibold">{transaction.receiptNumber}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status actions */}
              {transaction.status === TransactionStatus.PENDING && (
                <div className="flex items-center space-x-3 border-t pt-4">
                  <div className="text-gray-500 text-sm mr-2">{t("changeStatus")}:</div>
                  <button 
                    onClick={() => handleStatusChange(TransactionStatus.COMPLETED)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 py-1 px-3 rounded flex items-center text-sm"
                  >
                    <FiCheck className="mr-1" /> {t("statuses.completed")}
                  </button>
                  <button 
                    onClick={() => handleStatusChange(TransactionStatus.CANCELED)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded flex items-center text-sm"
                  >
                    <FiX className="mr-1" /> {t("statuses.canceled")}
                  </button>
                </div>
              )}
            </div>

            {/* Related documents section */}
            {transaction.invoiceId && transaction.invoice && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiFileText className="mr-2" /> {t("relatedDocuments")}
                </h3>
                <div className="border rounded p-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">{t("invoice")}</div>
                    <div className="font-semibold">{transaction.invoice.code}</div>
                    <div className="text-sm">{formatCurrency(transaction.invoice.totalAmount)}</div>
                  </div>
                  <Link 
                    href={`/admin/invoices/${transaction.invoiceId}`}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded"
                  >
                    {t("view")}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar information */}
          <div className="lg:col-span-1">
            {/* Customer or partner info */}
            {(transaction.customer || transaction.partner) && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiUser className="mr-2" /> 
                  {transaction.customer ? t("customerInformation") : t("partnerInformation")}
                </h3>
                
                {transaction.customer && (
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm">{t("name")}</div>
                      <div className="font-semibold">
                        <Link 
                          href={`/admin/customers/${transaction.customer.id}`} 
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {transaction.customer.name}
                        </Link>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm">{t("code")}</div>
                      <div>{transaction.customer.code}</div>
                    </div>
                  </div>
                )}
                
                {transaction.partner && (
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm">{t("name")}</div>
                      <div className="font-semibold">
                        <Link 
                          href={`/admin/partners/${transaction.partner.id}`} 
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {transaction.partner.name}
                        </Link>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm">{t("code")}</div>
                      <div>{transaction.partner.code}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Created by */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">{t("metadata")}</h3>
              
              <div className="mb-4">
                <div className="text-gray-500 text-sm">{t("createdBy")}</div>
                <div className="font-semibold">{transaction.user.name}</div>
                <div className="text-sm text-gray-500">{transaction.user.email}</div>
              </div>
              
              {transaction.shift && (
                <div className="mb-4">
                  <div className="text-gray-500 text-sm">{t("shift")}</div>
                  <div className="font-semibold">
                    <Link 
                      href={`/admin/shifts/${transaction.shift.id}`} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {t("shiftId", { id: transaction.shift.id })}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(transaction.shift.startTime)}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <div className="text-gray-500 text-sm">{t("createdAt")}</div>
                <div>{formatDateTime(transaction.createdAt)}</div>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">{t("updatedAt")}</div>
                <div>{formatDateTime(transaction.updatedAt)}</div>
              </div>
            </div>

            {/* Attachments if any */}
            {transaction.attachments && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiDownload className="mr-2" /> {t("attachments")}
                </h3>
                <div className="space-y-2">
                  {/* This is a placeholder for parsing and displaying attachments */}
                  <div className="border rounded p-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <FiFileText className="mr-2" />
                      <span>Receipt.pdf</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiDownload />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
