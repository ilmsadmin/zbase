"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { 
  FiEdit, FiTrash2, FiArrowLeft, FiCheck, FiX, 
  FiPrinter, FiDownload, FiFileText, FiUser, FiTool 
} from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { 
  Warranty, WarrantyStatus, warrantyService 
} from "@/lib/api/services/warranty";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";

export default function WarrantyDetailPage() {
  const t = useTranslations("admin.warranties");
  const params = useParams();
  const router = useRouter();
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get status badge class
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

  const fetchWarranty = async () => {
    setLoading(true);
    setError("");
    try {
      const id = Number(params.id);
      if (isNaN(id)) {
        setError(t("errors.invalidId"));
        setLoading(false);
        return;
      }

      const data = await warrantyService.getWarrantyById(id);
      setWarranty(data);
    } catch (err) {
      console.error("Error fetching warranty:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranty();
  }, [params.id]);

  const handleDelete = async () => {
    if (!warranty) return;
    
    if (window.confirm(t("confirmDelete"))) {
      try {
        await warrantyService.deleteWarranty(warranty.id);
        router.push("/admin/warranties");
      } catch (err) {
        console.error("Error deleting warranty:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const handleStatusChange = async (status: WarrantyStatus) => {
    if (!warranty) return;
    
    try {
      const updatedWarranty = await warrantyService.updateWarranty(warranty.id, { status });
      setWarranty(updatedWarranty);
    } catch (err) {
      console.error("Error updating warranty status:", err);
      setError(t("errors.updateFailed"));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <div className="mt-4">
            <Link
              href="/admin/warranties"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2" /> {t("backToList")}
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!warranty) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {t("warrantyNotFound")}
          </div>
          <div className="mt-4">
            <Link
              href="/admin/warranties"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2" /> {t("backToList")}
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-semibold">{t("detail.title")}: {warranty.code}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(warranty.status)}`}>
                {t(`statuses.${warranty.status}`)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{t("detail.subtitle")}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/admin/warranties"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2" /> {t("backToList")}
            </Link>
            <Link
              href={`/admin/warranties/${warranty.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
            >
              <FiEdit className="mr-2" /> {t("edit")}
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <FiTrash2 className="mr-2" /> {t("delete")}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              <FiPrinter className="mr-2" /> {t("print")}
            </button>
          </div>
        </div>
        
        {/* Status Change Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">{t("detail.statusChange")}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange(WarrantyStatus.PENDING)}
              disabled={warranty.status === WarrantyStatus.PENDING}
              className={`px-4 py-2 rounded ${
                warranty.status === WarrantyStatus.PENDING
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
            >
              {t("statuses.pending")}
            </button>
            <button
              onClick={() => handleStatusChange(WarrantyStatus.PROCESSING)}
              disabled={warranty.status === WarrantyStatus.PROCESSING}
              className={`px-4 py-2 rounded ${
                warranty.status === WarrantyStatus.PROCESSING
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {t("statuses.processing")}
            </button>
            <button
              onClick={() => handleStatusChange(WarrantyStatus.COMPLETED)}
              disabled={warranty.status === WarrantyStatus.COMPLETED}
              className={`px-4 py-2 rounded ${
                warranty.status === WarrantyStatus.COMPLETED
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {t("statuses.completed")}
            </button>
            <button
              onClick={() => handleStatusChange(WarrantyStatus.REJECTED)}
              disabled={warranty.status === WarrantyStatus.REJECTED}
              className={`px-4 py-2 rounded ${
                warranty.status === WarrantyStatus.REJECTED
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {t("statuses.rejected")}
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">{t("detail.basicInfo")}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.code")}</span>
                <span className="font-medium">{warranty.code}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.status")}</span>
                <span className={`px-2 py-1 rounded-full text-xs inline-block w-fit ${getStatusBadgeClass(warranty.status)}`}>
                  {t(`statuses.${warranty.status}`)}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.receivedDate")}</span>
                <span className="font-medium">{formatDateTime(warranty.receivedDate)}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.expectedReturnDate")}</span>
                <span className="font-medium">{formatDateTime(warranty.expectedReturnDate)}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.serialNumber")}</span>
                <span className="font-medium">{warranty.serialNumber || "-"}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.cost")}</span>
                <span className="font-medium">{warranty.cost ? formatCurrency(warranty.cost) : "-"}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.charged")}</span>
                <span className="font-medium">
                  {warranty.charged ? (
                    <span className="text-green-600 flex items-center">
                      <FiCheck className="mr-1" /> {t("detail.yes")}
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <FiX className="mr-1" /> {t("detail.no")}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Related Entities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">{t("detail.relatedEntities")}</h2>
            <div className="grid grid-cols-1 gap-4">
              {warranty.customer && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("detail.customer")}</span>
                  <Link href={`/admin/customers/${warranty.customerId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                    <FiUser className="mr-1" /> {warranty.customer.name}
                  </Link>
                </div>
              )}
              
              {warranty.product && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("detail.product")}</span>
                  <Link href={`/admin/products/${warranty.productId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                    <FiFileText className="mr-1" /> {warranty.product.name}
                  </Link>
                </div>
              )}
              
              {warranty.invoice && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("detail.invoice")}</span>
                  <Link href={`/admin/invoices/${warranty.invoiceId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                    <FiFileText className="mr-1" /> {warranty.invoice.code}
                  </Link>
                </div>
              )}
              
              {warranty.technician && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("detail.technician")}</span>
                  <span className="font-medium flex items-center">
                    <FiTool className="mr-1" /> {warranty.technician.name}
                  </span>
                </div>
              )}
              
              {warranty.creator && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{t("detail.creator")}</span>
                  <span className="font-medium">{warranty.creator.name}</span>
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.createdAt")}</span>
                <span className="font-medium">{formatDateTime(warranty.createdAt)}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t("detail.updatedAt")}</span>
                <span className="font-medium">{formatDateTime(warranty.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Issue Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">{t("detail.issueDescription")}</h2>
            <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
              {warranty.issueDescription || t("detail.noIssueDescription")}
            </div>
          </div>
          
          {/* Diagnosis and Solution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">{t("detail.diagnosisSolution")}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">{t("detail.diagnosis")}</span>
                <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                  {warranty.diagnosis || t("detail.noDiagnosis")}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">{t("detail.solution")}</span>
                <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                  {warranty.solution || t("detail.noSolution")}
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-lg font-medium mb-4">{t("detail.notes")}</h2>
            <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
              {warranty.notes || t("detail.noNotes")}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
