"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { 
  Transaction, TransactionStatus, TransactionMethod, 
  TransactionCategory, UpdateTransactionDto, transactionService 
} from "@/lib/api/services/transaction";

export default function TransactionEditPage() {
  const t = useTranslations("admin.transactions");
  const params = useParams();
  const router = useRouter();
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<UpdateTransactionDto>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setFormData({
        amount: data.amount,
        transactionMethod: data.transactionMethod,
        transactionDate: data.transactionDate ? new Date(data.transactionDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.status,
        category: data.category,
        reference: data.reference,
        customerId: data.customerId,
        partnerId: data.partnerId,
        paymentMethod: data.paymentMethod,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        receiptNumber: data.receiptNumber,
        notes: data.notes,
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const parsedAmount = parseFloat(value);
      setFormData({ ...formData, [name]: isNaN(parsedAmount) ? 0 : parsedAmount });
    } else if (name === 'customerId' || name === 'partnerId') {
      const parsedId = parseInt(value);
      setFormData({ ...formData, [name]: isNaN(parsedId) ? undefined : parsedId });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    if (!value) {
      const newFormData = { ...formData };
      delete newFormData[name as keyof UpdateTransactionDto];
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: new Date(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;
    
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const updatedTransaction = await transactionService.updateTransaction(transaction.id, formData);
      setTransaction(updatedTransaction);
      setSuccess(t("updateSuccess"));
      
      // Redirect back to transaction details after a short delay
      setTimeout(() => {
        router.push(`/admin/transactions/${transaction.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(t("errors.updateFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/transactions/${transaction?.id || ''}`);
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

  if (error && !transaction) {
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
              href={`/admin/transactions/${transaction?.id || ''}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 mr-4 py-2 px-4 rounded flex items-center"
            >
              <FiArrowLeft className="mr-2" /> {t("back")}
            </Link>
            <h1 className="text-2xl font-semibold">{t("editTransaction")}</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Transaction details section */}
              <div className="space-y-6">
                <h2 className="font-semibold text-gray-700 border-b pb-2">{t("transactionDetails")}</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                    {t("code")}
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={transaction?.code || ''}
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">{t("codeCannotBeChanged")}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="transactionMethod">
                    {t("transactionMethod")}
                  </label>
                  <select
                    id="transactionMethod"
                    name="transactionMethod"
                    value={formData.transactionMethod || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  >
                    <option value="">{t("selectOption")}</option>
                    <option value={TransactionMethod.CASH}>{t("transactionMethods.cash")}</option>
                    <option value={TransactionMethod.BANK_TRANSFER}>{t("transactionMethods.bank_transfer")}</option>
                    <option value={TransactionMethod.CREDIT_CARD}>{t("transactionMethods.credit_card")}</option>
                    <option value={TransactionMethod.E_WALLET}>{t("transactionMethods.e_wallet")}</option>
                    <option value={TransactionMethod.OTHER}>{t("transactionMethods.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
                    {t("amount")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="amount"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                    {t("status")}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  >
                    <option value={TransactionStatus.PENDING}>{t("statuses.pending")}</option>
                    <option value={TransactionStatus.COMPLETED}>{t("statuses.completed")}</option>
                    <option value={TransactionStatus.CANCELED}>{t("statuses.canceled")}</option>
                    <option value={TransactionStatus.FAILED}>{t("statuses.failed")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                    {t("category")}
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  >
                    <option value="">{t("selectOption")}</option>
                    <option value={TransactionCategory.SALE}>{t("categories.sale")}</option>
                    <option value={TransactionCategory.PURCHASE}>{t("categories.purchase")}</option>
                    <option value={TransactionCategory.EXPENSE}>{t("categories.expense")}</option>
                    <option value={TransactionCategory.INCOME}>{t("categories.income")}</option>
                    <option value={TransactionCategory.REFUND}>{t("categories.refund")}</option>
                    <option value={TransactionCategory.OTHER}>{t("categories.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="transactionDate">
                    {t("transactionDate")}
                  </label>
                  <input
                    type="date"
                    id="transactionDate"
                    value={formData.transactionDate ? new Date(formData.transactionDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('transactionDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dueDate">
                    {t("dueDate")} <span className="text-xs text-gray-500">({t("optional")})</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('dueDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                </div>
              </div>

              {/* Additional details section */}
              <div className="space-y-6">
                <h2 className="font-semibold text-gray-700 border-b pb-2">{t("additionalDetails")}</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reference">
                    {t("reference")} <span className="text-xs text-gray-500">({t("optional")})</span>
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                </div>

                {/* Additional fields based on transaction method */}
                {formData.transactionMethod === TransactionMethod.BANK_TRANSFER && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bankName">
                        {t("bankName")}
                      </label>
                      <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={formData.bankName || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="accountNumber">
                        {t("accountNumber")}
                      </label>
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                      />
                    </div>
                  </>
                )}

                {/* Receipt number for any method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="receiptNumber">
                    {t("receiptNumber")} <span className="text-xs text-gray-500">({t("optional")})</span>
                  </label>
                  <input
                    type="text"
                    id="receiptNumber"
                    name="receiptNumber"
                    value={formData.receiptNumber || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paymentMethod">
                    {t("specificPaymentMethod")} <span className="text-xs text-gray-500">({t("optional")})</span>
                  </label>
                  <input
                    type="text"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod || ''}
                    onChange={handleChange}
                    placeholder={t("e.g.Visa, Mastercard, PayPal")}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    {t("notes")} <span className="text-xs text-gray-500">({t("optional")})</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center"
                disabled={submitting}
              >
                <FiX className="mr-2" /> {t("cancel")}
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
                disabled={submitting}
              >
                <FiSave className="mr-2" /> 
                {submitting ? t("saving") : t("saveChanges")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
