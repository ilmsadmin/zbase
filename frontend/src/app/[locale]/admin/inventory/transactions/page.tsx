"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  inventoryService,
  InventoryTransaction, 
  CreateInventoryTransactionDto 
} from "@/lib/api/services/inventory";
import { Product, productService } from "@/lib/api/services/product";
import { Warehouse, warehouseService } from "@/lib/api/services/warehouse";
import { Link } from "@/i18n/navigation";
import { 
  FiArrowLeft, 
  FiPlus, 
  FiSearch, 
  FiRefreshCw, 
  FiFilter,
  FiCalendar,
  FiClock
} from "react-icons/fi";
import { formatDateTime } from "@/lib/utils/format";

export default function InventoryTransactionsPage() {
  const t = useTranslations("admin.inventory");
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState("");
  const [newTransactionModal, setNewTransactionModal] = useState(false);
  
  // Filter states
  const [warehouseFilter, setWarehouseFilter] = useState<number | undefined>(undefined);
  const [productFilter, setProductFilter] = useState<number | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Transaction form state
  const [transactionData, setTransactionData] = useState<Partial<CreateInventoryTransactionDto>>({
    transactionType: "in",
    quantity: 1
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | undefined>(undefined);
  const [locations, setLocations] = useState<any[]>([]);

  const fetchTransactions = async (page: number = 1) => {
    setLoading(true);
    setError("");
    
    try {
      const startDateObj = startDate ? new Date(startDate) : undefined;
      const endDateObj = endDate ? new Date(endDate) : undefined;
      
      const response = await inventoryService.getAllTransactions(
        page,
        itemsPerPage,
        productFilter,
        warehouseFilter,
        undefined, // locationId
        typeFilter,
        startDateObj,
        endDateObj
      );
      
      setTransactions(response.items);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.total);
      setCurrentPage(response.meta.page);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [warehouseData, productData] = await Promise.all([
        warehouseService.getAllWarehouses(),
        productService.getAllProducts(1, 100)
      ]);
      
      setWarehouses(warehouseData.items || warehouseData);
      setProducts(productData.items || []);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  };

  const fetchLocations = async (warehouseId: number) => {
    try {
      const data = await warehouseService.getWarehouseLocations(warehouseId);
      setLocations(data || []);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [warehouseFilter, productFilter, typeFilter, startDate, endDate]);
  
  useEffect(() => {
    if (selectedWarehouse) {
      fetchLocations(selectedWarehouse);
    }
  }, [selectedWarehouse]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTransactions(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Parse numeric values
    let parsedValue: string | number = value;
    if (type === "number") {
      parsedValue = value ? parseFloat(value) : 0;
    }
    
    setTransactionData({
      ...transactionData,
      [name]: parsedValue
    });
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const warehouseId = parseInt(value);
      setSelectedWarehouse(warehouseId);
      setTransactionData({
        ...transactionData,
        warehouseId,
        locationId: undefined // Reset location when warehouse changes
      });
    } else {
      setSelectedWarehouse(undefined);
      setTransactionData({
        ...transactionData,
        warehouseId: undefined,
        locationId: undefined
      });
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await inventoryService.createTransaction(transactionData as CreateInventoryTransactionDto);
      setNewTransactionModal(false);
      // Reset form
      setTransactionData({
        transactionType: "in",
        quantity: 1
      });
      setSelectedWarehouse(undefined);
      // Refresh transactions
      fetchTransactions(currentPage);
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(t("errors.transactionFailed"));
    }
  };

  const getTransactionTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'in':
        return 'bg-green-100 text-green-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href="/admin/inventory" className="mr-4">
                <FiArrowLeft className="h-6 w-6 text-gray-500" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{t("transactionsTitle")}</h1>
            </div>
            <button
              onClick={() => setNewTransactionModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> {t("newTransaction")}
            </button>
          </div>

          {/* Search and filter */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="w-full">
                  <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">{t("warehouse")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiFilter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="warehouse"
                      name="warehouse"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={warehouseFilter || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setWarehouseFilter(value ? Number(value) : undefined);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">{t("allWarehouses")}</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">{t("product")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="product"
                      name="product"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={productFilter || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProductFilter(value ? Number(value) : undefined);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">{t("allProducts")}</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.code} - {product.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">{t("transactionType")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiFilter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="type"
                      name="type"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={typeFilter || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTypeFilter(value || undefined);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">{t("allTypes")}</option>
                      <option value="in">{t("transactionTypeIn")}</option>
                      <option value="out">{t("transactionTypeOut")}</option>
                      <option value="transfer">{t("transactionTypeTransfer")}</option>
                      <option value="adjustment">{t("transactionTypeAdjustment")}</option>
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">{t("startDate")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={startDate || ""}
                      onChange={(e) => {
                        setStartDate(e.target.value || undefined);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">{t("endDate")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={endDate || ""}
                      onChange={(e) => {
                        setEndDate(e.target.value || undefined);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="w-full flex items-end">
                  <button
                    onClick={() => fetchTransactions(currentPage)}
                    className="inline-flex items-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiRefreshCw className="mr-2" /> {t("refresh")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Transactions list */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("id")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("date")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("product")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("warehouse")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("location")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("type")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("quantity")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("reference")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("notes")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin h-5 w-5 text-blue-500 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("loading")}
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {t("noTransactions")}
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{formatDateTime(transaction.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{transaction.product?.name}</span>
                            <span className="text-xs text-gray-500">{transaction.product?.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.warehouse?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.location ? 
                            `${transaction.location.zone}-${transaction.location.aisle}-${transaction.location.rack}-${transaction.location.shelf}-${transaction.location.position}` : 
                            t("noLocationAssigned")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeStyle(transaction.transactionType)}`}>
                            {transaction.transactionType === 'in' ? t('transactionTypeIn') :
                             transaction.transactionType === 'out' ? t('transactionTypeOut') :
                             transaction.transactionType === 'transfer' ? t('transactionTypeTransfer') :
                             transaction.transactionType === 'adjustment' ? t('transactionTypeAdjustment') :
                             transaction.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={
                            transaction.transactionType === 'in' ? 'text-green-600 font-medium' :
                            transaction.transactionType === 'out' ? 'text-red-600 font-medium' :
                            'text-gray-900'
                          }>
                            {transaction.transactionType === 'in' ? '+' : 
                             transaction.transactionType === 'out' ? '-' : ''}
                            {transaction.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.referenceType ? (
                            <div>
                              <span className="font-medium">{transaction.referenceType}</span>
                              {transaction.referenceId && (
                                <span className="ml-1">#{transaction.referenceId}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">{t("noReference")}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {transaction.notes || <span className="text-gray-400">{t("noNotes")}</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("previous")}
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("next")}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t("showing")} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> {t("to")}{" "}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> {t("of")}{" "}
                      <span className="font-medium">{totalItems}</span> {t("results")}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">{t("previous")}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        
                        // Display current page, first/last page, and 1 page around current page
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        
                        // Show ellipsis
                        if (
                          (pageNum === 2 && currentPage > 3) ||
                          (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span
                              key={i}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">{t("next")}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Transaction Modal */}
      {newTransactionModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateTransaction}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {t("newTransaction")}
                      </h3>
                      <div className="mt-4">
                        <div className="grid grid-cols-1 gap-y-4">
                          {/* Product selection */}
                          <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                              {t("product")} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <select
                                id="productId"
                                name="productId"
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={transactionData.productId || ""}
                                onChange={handleInputChange}
                              >
                                <option value="">{t("selectProduct")}</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>{product.code} - {product.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Warehouse selection */}
                          <div>
                            <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700">
                              {t("warehouse")} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <select
                                id="warehouseId"
                                name="warehouseId"
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={transactionData.warehouseId || ""}
                                onChange={handleWarehouseChange}
                              >
                                <option value="">{t("selectWarehouse")}</option>
                                {warehouses.map((warehouse) => (
                                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Location selection */}
                          <div>
                            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
                              {t("location")}
                            </label>
                            <div className="mt-1">
                              <select
                                id="locationId"
                                name="locationId"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={transactionData.locationId || ""}
                                onChange={handleInputChange}
                                disabled={!selectedWarehouse || locations.length === 0}
                              >
                                <option value="">{t("noLocation")}</option>
                                {locations.map((location) => (
                                  <option key={location.id} value={location.id}>
                                    {`${location.zone}-${location.aisle}-${location.rack}-${location.shelf}-${location.position}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Transaction Type */}
                          <div>
                            <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
                              {t("transactionType")} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <select
                                id="transactionType"
                                name="transactionType"
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={transactionData.transactionType || "in"}
                                onChange={handleInputChange}
                              >
                                <option value="in">{t("transactionTypeIn")}</option>
                                <option value="out">{t("transactionTypeOut")}</option>
                                <option value="transfer">{t("transactionTypeTransfer")}</option>
                                <option value="adjustment">{t("transactionTypeAdjustment")}</option>
                              </select>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                              {t("quantity")} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                min={transactionData.transactionType === 'adjustment' ? 0 : 0.01}
                                step="0.01"
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={transactionData.quantity || 0}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          {/* Reference */}
                          <div className="grid grid-cols-2 gap-x-4">
                            <div>
                              <label htmlFor="referenceType" className="block text-sm font-medium text-gray-700">
                                {t("referenceType")}
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="referenceType"
                                  id="referenceType"
                                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  value={transactionData.referenceType || ''}
                                  onChange={handleInputChange}
                                  placeholder={t("referenceTypePlaceholder")}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700">
                                {t("referenceId")}
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="referenceId"
                                  id="referenceId"
                                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  value={transactionData.referenceId || ''}
                                  onChange={handleInputChange}
                                  placeholder={t("referenceIdPlaceholder")}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              {t("notes")}
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={transactionData.notes || ''}
                                onChange={handleInputChange}
                                placeholder={t("notesPlaceholder")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {t("create")}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setNewTransactionModal(false)}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
