"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiTrash2, FiX, FiRefreshCw } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { 
  Warranty, WarrantyStatus, UpdateWarrantyDto, warrantyService 
} from "@/lib/api/services/warranty";

interface Product {
  id: number;
  name: string;
  code: string;
}

interface Customer {
  id: number;
  name: string;
  code: string;
}

interface Invoice {
  id: number;
  code: string;
}

interface User {
  id: number;
  name: string;
}

// Mock services for related entities to be replaced with real ones
const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }
};

const customerService = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await fetch('/api/customers');
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  }
};

const invoiceService = {
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return response.json();
  }
};

const userService = {
  getAllTechnicians: async (): Promise<User[]> => {
    const response = await fetch('/api/users?role=technician');
    if (!response.ok) {
      throw new Error('Failed to fetch technicians');
    }
    return response.json();
  }
};

export default function WarrantyEditPage() {
  const t = useTranslations("admin.warranties");
  const params = useParams();
  const router = useRouter();
  
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [formData, setFormData] = useState<UpdateWarrantyDto>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

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
      setFormData({
        customerId: data.customerId,
        productId: data.productId,
        invoiceId: data.invoiceId,
        serialNumber: data.serialNumber,
        issueDescription: data.issueDescription,
        receivedDate: data.receivedDate ? new Date(data.receivedDate) : undefined,
        expectedReturnDate: data.expectedReturnDate ? new Date(data.expectedReturnDate) : undefined,
        status: data.status,
        diagnosis: data.diagnosis,
        solution: data.solution,
        cost: data.cost,
        charged: data.charged,
        notes: data.notes,
        technicianId: data.technicianId,
      });
      
      // Fetch related data
      const [productsData, customersData, invoicesData, techniciansData] = await Promise.all([
        productService.getAllProducts(),
        customerService.getAllCustomers(),
        invoiceService.getAllInvoices(),
        userService.getAllTechnicians()
      ]);
      
      setProducts(productsData);
      setCustomers(customersData);
      setInvoices(invoicesData);
      setTechnicians(techniciansData);
      
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const parsedValue = parseFloat(value);
      setFormData({ ...formData, [name]: isNaN(parsedValue) ? undefined : parsedValue });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'customerId' || name === 'productId' || name === 'invoiceId' || name === 'technicianId') {
      const parsedId = parseInt(value);
      setFormData({ ...formData, [name]: isNaN(parsedId) ? undefined : parsedId });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    if (!value) {
      const newFormData = { ...formData };
      delete newFormData[name as keyof UpdateWarrantyDto];
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: new Date(value) });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warranty) return;
    
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const updatedWarranty = await warrantyService.updateWarranty(warranty.id, formData);
      setWarranty(updatedWarranty);
      setSuccess(t("success.updated"));
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push(`/admin/warranties/${warranty.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating warranty:", err);
      setError(t("errors.updateFailed"));
      setSubmitting(false);
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

  if (!warranty && !loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {t("warrantyNotFound")}
          </div>
          <Link
            href="/admin/warranties"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">{t("edit.title")}: {warranty?.code}</h1>
            <p className="text-gray-600">{t("edit.subtitle")}</p>
          </div>
          <Link
            href={`/admin/warranties/${params.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiArrowLeft className="mr-2" /> {t("backToDetail")}
          </Link>
        </div>
        
        {/* Error alert */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <FiX className="mr-2" /> {error}
          </div>
        )}
        
        {/* Success alert */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <FiSave className="mr-2" /> {success}
          </div>
        )}
        
        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("form.basicInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                    {t("form.code")}
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={warranty?.code || ""}
                    disabled
                    className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">{t("form.codeHelp")}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                    {t("form.status")}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={WarrantyStatus.PENDING}>{t("statuses.pending")}</option>
                    <option value={WarrantyStatus.PROCESSING}>{t("statuses.processing")}</option>
                    <option value={WarrantyStatus.COMPLETED}>{t("statuses.completed")}</option>
                    <option value={WarrantyStatus.REJECTED}>{t("statuses.rejected")}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="serialNumber">
                    {t("form.serialNumber")}
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="receivedDate">
                    {t("form.receivedDate")}
                  </label>
                  <input
                    type="date"
                    id="receivedDate"
                    name="receivedDate"
                    value={formData.receivedDate ? new Date(formData.receivedDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleDateChange("receivedDate", e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expectedReturnDate">
                    {t("form.expectedReturnDate")}
                  </label>
                  <input
                    type="date"
                    id="expectedReturnDate"
                    name="expectedReturnDate"
                    value={formData.expectedReturnDate ? new Date(formData.expectedReturnDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleDateChange("expectedReturnDate", e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cost">
                    {t("form.cost")}
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost || ""}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="charged"
                    name="charged"
                    checked={formData.charged || false}
                    onChange={(e) => handleCheckboxChange("charged", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="charged" className="ml-2 block text-sm text-gray-900">
                    {t("form.charged")}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Related Entities */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("form.relatedEntities")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="customerId">
                    {t("form.customer")}
                  </label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{t("form.selectCustomer")}</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productId">
                    {t("form.product")}
                  </label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{t("form.selectProduct")}</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="invoiceId">
                    {t("form.invoice")}
                  </label>
                  <select
                    id="invoiceId"
                    name="invoiceId"
                    value={formData.invoiceId || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{t("form.selectInvoice")}</option>
                    {invoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.code}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="technicianId">
                    {t("form.technician")}
                  </label>
                  <select
                    id="technicianId"
                    name="technicianId"
                    value={formData.technicianId || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{t("form.selectTechnician")}</option>
                    {technicians.map((technician) => (
                      <option key={technician.id} value={technician.id}>
                        {technician.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Issue Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("form.issueDescription")}</h2>
              <div>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  rows={4}
                  value={formData.issueDescription || ""}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("form.enterIssueDescription")}
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">{t("form.issueDescriptionHelp")}</p>
              </div>
            </div>
            
            {/* Diagnosis and Solution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("form.diagnosisSolution")}</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="diagnosis">
                    {t("form.diagnosis")}
                  </label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    rows={3}
                    value={formData.diagnosis || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("form.enterDiagnosis")}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="solution">
                    {t("form.solution")}
                  </label>
                  <textarea
                    id="solution"
                    name="solution"
                    rows={3}
                    value={formData.solution || ""}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("form.enterSolution")}
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("form.notes")}</h2>
              <div>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("form.enterNotes")}
                ></textarea>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <Link
                href={`/admin/warranties/${params.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiX className="mr-2" /> {t("actions.cancel")}
              </Link>
              
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" /> {t("actions.saving")}
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> {t("actions.save")}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
