"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useRouter } from "next/navigation";
import { 
  FiSave, FiArrowLeft, FiX, FiUser, 
  FiDollarSign, FiCalendar, FiFileText, FiRefreshCw
} from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { 
  transactionService, 
  CreateTransactionDto, 
  TransactionType,
  TransactionMethod,
  TransactionStatus,
  TransactionCategory
} from "@/lib/api/services/transaction";

// Define interfaces for related entities that will be used in dropdowns
interface Customer {
  id: number;
  name: string;
  code: string;
}

interface Partner {
  id: number;
  name: string;
  code: string;
}

interface Invoice {
  id: number;
  code: string;
  totalAmount: number;
  status: string;
}

// Mock services for related entities to be replaced with real ones
const customerService = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await fetch('/api/customers');
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  }
};

const partnerService = {
  getAllPartners: async (): Promise<Partner[]> => {
    const response = await fetch('/api/partners');
    if (!response.ok) {
      throw new Error('Failed to fetch partners');
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

export default function CreateTransactionPage() {
  const t = useTranslations("admin.transactions");
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateTransactionDto>({
    transactionType: TransactionType.RECEIPT,
    transactionMethod: TransactionMethod.CASH,
    amount: 0,
    status: TransactionStatus.PENDING,
    category: TransactionCategory.SALE,
    transactionDate: new Date(),
    userId: 1 // This should come from authentication context
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Generate transaction code (generally handled by backend)
  const [generatedCode, setGeneratedCode] = useState("");

  // Load data needed for the form
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all data in parallel
      const [customersData, partnersData, invoicesData] = await Promise.all([
        customerService.getAllCustomers(),
        partnerService.getAllPartners(),
        invoiceService.getAllInvoices()
      ]);
      
      setCustomers(customersData);
      setPartners(partnersData);
      setInvoices(invoicesData);
      
      // In a real implementation, you might want to fetch a generated code from backend
      // For now, use a placeholder
      setGeneratedCode(`TRX-${new Date().getTime().toString().substring(0, 10)}`);
      
      // Set generated code in form data
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const parsedAmount = parseFloat(value);
      setFormData({ ...formData, [name]: isNaN(parsedAmount) ? 0 : parsedAmount });
    } else if (name === 'customerId' || name === 'partnerId' || name === 'invoiceId') {
      const parsedId = parseInt(value);
      setFormData({ ...formData, [name]: isNaN(parsedId) ? undefined : parsedId });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    if (!value) {
      const newFormData = { ...formData };
      delete newFormData[name as keyof CreateTransactionDto];
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: new Date(value) });
    }
  };

  // Additional field rendering logic based on selected transaction method
  const renderMethodSpecificFields = () => {
    switch (formData.transactionMethod) {
      case TransactionMethod.BANK_TRANSFER:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="accountNumber">
                {t("form.accountNumber")}
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="bankName">
                {t("form.bankName")}
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </>
        );
      case TransactionMethod.CREDIT_CARD:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="receiptNumber">
              {t("form.receiptNumber")}
            </label>
            <input
              type="text"
              id="receiptNumber"
              name="receiptNumber"
              value={formData.receiptNumber || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await transactionService.createTransaction(formData);
      setSuccess(t("success.created"));
      
      // Redirect to the transaction detail page after successful creation
      setTimeout(() => {
        router.push(`/admin/transactions/${response.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(t("errors.createFailed"));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{t("new.title")}</h1>
          </div>
          <Link
            href="/admin/transactions"
            className="flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <FiArrowLeft size={16} />
            <span>{t("actions.back")}</span>
          </Link>
        </div>
        
        {/* Error alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-800">
            <FiX size={20} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Success alert */}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-4 text-sm text-green-800">
            <FiX size={20} className="text-green-400" />
            <span>{success}</span>
          </div>
        )}
        
        {/* Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleSubmit}>
            {/* Basic information */}
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                {t("form.basicInfo")}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Transaction code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="code">
                    {t("form.code")}
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code || generatedCode}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">{t("form.codeHelp")}</p>
                </div>
                
                {/* Transaction type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="transactionType">
                    {t("form.type")}
                  </label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value={TransactionType.RECEIPT}>{t("types.receipt")}</option>
                    <option value={TransactionType.PAYMENT}>{t("types.payment")}</option>
                  </select>
                </div>
                
                {/* Transaction method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="transactionMethod">
                    {t("form.method")}
                  </label>
                  <select
                    id="transactionMethod"
                    name="transactionMethod"
                    value={formData.transactionMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value={TransactionMethod.CASH}>{t("methods.cash")}</option>
                    <option value={TransactionMethod.BANK_TRANSFER}>{t("methods.bankTransfer")}</option>
                    <option value={TransactionMethod.CREDIT_CARD}>{t("methods.creditCard")}</option>
                    <option value={TransactionMethod.E_WALLET}>{t("methods.eWallet")}</option>
                    <option value={TransactionMethod.OTHER}>{t("methods.other")}</option>
                  </select>
                </div>
                
                {/* Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
                    {t("form.amount")}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiDollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="0"
                      step="0.01"
                      value={formData.amount || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
                
                {/* Transaction date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="transactionDate">
                    {t("form.transactionDate")}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiCalendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="transactionDate"
                      name="transactionDate"
                      value={formData.transactionDate ? new Date(formData.transactionDate).toISOString().split('T')[0] : ""}
                      onChange={(e) => handleDateChange("transactionDate", e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
                
                {/* Due date (optional) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="dueDate">
                    {t("form.dueDate")}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiCalendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ""}
                      onChange={(e) => handleDateChange("dueDate", e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                
                {/* Transaction status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                    {t("form.status")}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value={TransactionStatus.PENDING}>{t("statuses.pending")}</option>
                    <option value={TransactionStatus.COMPLETED}>{t("statuses.completed")}</option>
                    <option value={TransactionStatus.CANCELED}>{t("statuses.canceled")}</option>
                    <option value={TransactionStatus.FAILED}>{t("statuses.failed")}</option>
                  </select>
                </div>
                
                {/* Transaction category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="category">
                    {t("form.category")}
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value={TransactionCategory.SALE}>{t("categories.sale")}</option>
                    <option value={TransactionCategory.PURCHASE}>{t("categories.purchase")}</option>
                    <option value={TransactionCategory.EXPENSE}>{t("categories.expense")}</option>
                    <option value={TransactionCategory.INCOME}>{t("categories.income")}</option>
                    <option value={TransactionCategory.REFUND}>{t("categories.refund")}</option>
                    <option value={TransactionCategory.OTHER}>{t("categories.other")}</option>
                  </select>
                </div>
                
                {/* Reference */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="reference">
                    {t("form.reference")}
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
            
            {/* Related entities */}
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                {t("form.relatedEntities")}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Customer */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="customerId">
                    {t("form.customer")}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiUser size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="customerId"
                      name="customerId"
                      value={formData.customerId || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">{t("form.selectCustomer")}</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Partner */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="partnerId">
                    {t("form.partner")}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiUser size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="partnerId"
                      name="partnerId"
                      value={formData.partnerId || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">{t("form.selectPartner")}</option>
                      {partners.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name} ({partner.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Invoice */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="invoiceId">
                    {t("form.invoice")}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiFileText size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="invoiceId"
                      name="invoiceId"
                      value={formData.invoiceId || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">{t("form.selectInvoice")}</option>
                      {invoices.map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>
                          {invoice.code} ({invoice.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Method specific fields */}
            {renderMethodSpecificFields()}
            
            {/* Notes */}
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                {t("form.additionalInfo")}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="notes">
                  {t("form.notes")}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            {/* Form actions */}
            <div className="flex items-center justify-end gap-2">
              <Link
                href="/admin/transactions"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {t("actions.cancel")}
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <FiRefreshCw size={16} className="animate-spin" />
                    <span>{t("actions.saving")}</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>{t("actions.save")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
