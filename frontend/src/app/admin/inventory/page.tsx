"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  inventoryService, 
  Inventory, 
  CreateInventoryTransactionDto 
} from "@/lib/api/services/inventory";
import { Product, productService } from "@/lib/api/services/product";
import { Warehouse, warehouseService } from "@/lib/api/services/warehouse";
import { Link } from "@/i18n/navigation";
import { 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiRefreshCw, 
  FiFilter, 
  FiBox,
  FiAlertTriangle,
  FiArrowDown,
  FiArrowUp,
  FiRepeat,
  FiTool
} from "react-icons/fi";
import { formatDateTime } from "@/lib/utils/format";

export default function InventoryPage() {
  const t = useTranslations("admin.inventory");
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState("");
  const [transactionType, setTransactionType] = useState<string | undefined>(undefined);
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  
  // Filter states
  const [warehouseFilter, setWarehouseFilter] = useState<number | undefined>(undefined);
  const [productFilter, setProductFilter] = useState<number | undefined>(undefined);
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Transaction form states
  const [transactionData, setTransactionData] = useState<Partial<CreateInventoryTransactionDto>>({
    transactionType: "in",
    quantity: 0
  });

  const fetchInventory = async (page: number = 1) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await inventoryService.getAllInventory(
        page,
        itemsPerPage,
        warehouseFilter,
        productFilter,
        undefined, // locationId
        lowStockFilter
      );
      
      setInventory(response.items);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.total);
      setCurrentPage(response.meta.page);
    } catch (err) {
      console.error("Error fetching inventory:", err);
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

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchInventory(1);
  }, [warehouseFilter, productFilter, lowStockFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchInventory(page);
  };

  const handleDeleteInventory = async (inventoryId: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await inventoryService.deleteInventory(inventoryId);
        fetchInventory(currentPage);
      } catch (err) {
        console.error("Error deleting inventory:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const openTransactionModal = (item: Inventory, type: string) => {
    setSelectedItem(item);
    setTransactionData({
      productId: item.productId,
      warehouseId: item.warehouseId,
      locationId: item.locationId,
      transactionType: type,
      quantity: type === "out" ? Math.min(1, item.quantity) : 1
    });
    setTransactionType(type);
    setTransactionModal(true);
  };

  const handleTransaction = async () => {
    if (!selectedItem || !transactionData.transactionType) return;
    
    try {
      await inventoryService.createTransaction({
        productId: transactionData.productId!,
        warehouseId: transactionData.warehouseId!,
        locationId: transactionData.locationId,
        transactionType: transactionData.transactionType,
        quantity: transactionData.quantity || 0,
        notes: transactionData.notes
      });
      
      setTransactionModal(false);
      fetchInventory(currentPage);
      
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(t("errors.transactionFailed"));
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <div className="flex space-x-2">
              <Link
                href="/admin/inventory/transactions"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiRepeat className="mr-2" /> {t("viewTransactions")}
              </Link>
              <Link
                href="/admin/inventory/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2" /> {t("addInventory")}
              </Link>
            </div>
          </div>

          {/* Search and filter */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t("searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>

                <div className="w-full md:w-48">
                  <label htmlFor="warehouse" className="sr-only">{t("filterByWarehouse")}</label>
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

                <div className="w-full md:w-48">
                  <label htmlFor="product" className="sr-only">{t("filterByProduct")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBox className="h-5 w-5 text-gray-400" />
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

                <div className="flex items-center">
                  <input
                    id="lowStock"
                    name="lowStock"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={lowStockFilter}
                    onChange={(e) => {
                      setLowStockFilter(e.target.checked);
                      setCurrentPage(1);
                    }}
                  />
                  <label htmlFor="lowStock" className="ml-2 text-sm text-gray-600">
                    {t("showLowStock")}
                  </label>
                </div>

                <button
                  onClick={() => fetchInventory(currentPage)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiRefreshCw className="mr-2" /> {t("refresh")}
                </button>
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

          {/* Inventory list */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("product")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("warehouse")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("location")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("quantity")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("stockLevels")}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin h-5 w-5 text-blue-500 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("loading")}
                        </div>
                      </td>
                    </tr>
                  ) : inventory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {t("noInventoryItems")}
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item.id} className={item.quantity <= item.minStockLevel ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.product?.name}</span>
                            <span className="text-xs text-gray-500">{item.product?.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.warehouse?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.location ? 
                            `${item.location.zone}-${item.location.aisle}-${item.location.rack}-${item.location.shelf}-${item.location.position}` : 
                            t("noLocationAssigned")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {item.quantity <= item.minStockLevel && (
                              <FiAlertTriangle className="text-red-500 mr-2" title={t("lowStock")} />
                            )}
                            <span className={item.quantity <= item.minStockLevel ? "font-bold text-red-600" : ""}>
                              {item.quantity} {item.product?.unit || t("units")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="text-xs">{t("min")}: {item.minStockLevel}</div>
                            {item.maxStockLevel && (
                              <div className="text-xs">{t("max")}: {item.maxStockLevel}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openTransactionModal(item, "in")}
                              className="text-green-600 hover:text-green-900"
                              title={t("addStock")}
                            >
                              <FiArrowDown className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => openTransactionModal(item, "out")}
                              className="text-red-600 hover:text-red-900"
                              disabled={item.quantity <= 0}
                              title={t("removeStock")}
                            >
                              <FiArrowUp className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => openTransactionModal(item, "adjustment")}
                              className="text-blue-600 hover:text-blue-900"
                              title={t("adjustStock")}
                            >
                              <FiTool className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <Link
                              href={`/admin/inventory/${item.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title={t("edit")}
                            >
                              <FiEdit className="h-5 w-5" aria-hidden="true" />
                            </Link>
                            <button
                              onClick={() => handleDeleteInventory(item.id)}
                              className="text-red-600 hover:text-red-900"
                              title={t("delete")}
                            >
                              <FiTrash2 className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
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

      {/* Transaction Modal */}
      {transactionModal && selectedItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {transactionType === "in" 
                        ? t("addStock") 
                        : transactionType === "out" 
                        ? t("removeStock") 
                        : t("adjustStock")
                      }
                    </h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">{t("product")}: </span> 
                          {selectedItem.product?.name} ({selectedItem.product?.code})
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">{t("currentStock")}: </span> 
                          {selectedItem.quantity} {selectedItem.product?.unit || t("units")}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">{t("location")}: </span> 
                          {selectedItem.location 
                            ? `${selectedItem.location.zone}-${selectedItem.location.aisle}-${selectedItem.location.rack}-${selectedItem.location.shelf}-${selectedItem.location.position}` 
                            : t("noLocationAssigned")
                          }
                        </p>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          {transactionType === "adjustment" ? t("newQuantity") : t("quantity")}
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          min="0"
                          step="0.01"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={transactionData.quantity}
                          onChange={(e) => setTransactionData({
                            ...transactionData,
                            quantity: parseFloat(e.target.value) || 0
                          })}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          {t("notes")}
                        </label>
                        <textarea
                          name="notes"
                          id="notes"
                          rows={3}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder={t("notesPlaceholder")}
                          value={transactionData.notes || ''}
                          onChange={(e) => setTransactionData({
                            ...transactionData,
                            notes: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleTransaction}
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setTransactionModal(false)}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
