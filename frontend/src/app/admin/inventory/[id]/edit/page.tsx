"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/layouts/AdminLayout";
import { inventoryService, Inventory, UpdateInventoryDto } from "@/lib/api/services/inventory";
import { Product, productService } from "@/lib/api/services/product";
import { Warehouse, warehouseService } from "@/lib/api/services/warehouse";
import { Link } from "@/i18n/navigation";
import { FiArrowLeft, FiSave, FiTrash2 } from "react-icons/fi";
import { formatDateTime } from "@/lib/utils/format";

export default function EditInventoryPage() {
  const t = useTranslations("admin.inventory");
  const router = useRouter();
  const { id } = useParams();
  const inventoryId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [formData, setFormData] = useState<UpdateInventoryDto>({});
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | undefined>(undefined);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await inventoryService.getInventoryById(inventoryId);
      setInventory(data);
      setFormData({
        productId: data.productId,
        warehouseId: data.warehouseId,
        locationId: data.locationId,
        quantity: data.quantity,
        minStockLevel: data.minStockLevel,
        maxStockLevel: data.maxStockLevel
      });
      setSelectedWarehouse(data.warehouseId);
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

  const fetchLocations = async (warehouseId: number) => {
    try {
      const data = await warehouseService.getWarehouseLocations(warehouseId);
      setLocations(data || []);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchFilters();
  }, [inventoryId]);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchLocations(selectedWarehouse);
    }
  }, [selectedWarehouse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Parse numeric values
    let parsedValue: string | number = value;
    if (type === "number") {
      parsedValue = value ? parseFloat(value) : 0;
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const warehouseId = parseInt(e.target.value);
    setSelectedWarehouse(warehouseId);
    setFormData({
      ...formData,
      warehouseId,
      locationId: undefined // Reset location when warehouse changes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      await inventoryService.updateInventory(inventoryId, formData);
      setSuccess(t("updateSuccess"));
      // Refresh data after update
      fetchInventory();
    } catch (err) {
      console.error("Error updating inventory:", err);
      setError(t("errors.updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await inventoryService.deleteInventory(inventoryId);
        router.push("/admin/inventory");
      } catch (err) {
        console.error("Error deleting inventory:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("loading")}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!inventory && !loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{t("errors.inventoryNotFound")}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Link
                href="/admin/inventory"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiArrowLeft className="mr-2" /> {t("backToList")}
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href="/admin/inventory" className="mr-4">
                <FiArrowLeft className="h-6 w-6 text-gray-500" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{t("editInventory")}</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiTrash2 className="mr-2" /> {t("delete")}
              </button>
            </div>
          </div>

          {/* Error and success messages */}
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

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t("inventoryDetails")}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("editInventoryDescription")}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Product selection */}
                  <div className="sm:col-span-3">
                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                      {t("product")} <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="productId"
                        name="productId"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.productId}
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
                  <div className="sm:col-span-3">
                    <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700">
                      {t("warehouse")} <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="warehouseId"
                        name="warehouseId"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.warehouseId}
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
                  <div className="sm:col-span-3">
                    <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
                      {t("location")}
                    </label>
                    <div className="mt-1">
                      <select
                        id="locationId"
                        name="locationId"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.locationId || ""}
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

                  {/* Quantity */}
                  <div className="sm:col-span-3">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      {t("quantity")} <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="0"
                        step="0.01"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Min Stock Level */}
                  <div className="sm:col-span-3">
                    <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700">
                      {t("minStockLevel")} <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="minStockLevel"
                        id="minStockLevel"
                        min="0"
                        step="0.01"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.minStockLevel}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{t("minStockLevelHelp")}</p>
                  </div>

                  {/* Max Stock Level */}
                  <div className="sm:col-span-3">
                    <label htmlFor="maxStockLevel" className="block text-sm font-medium text-gray-700">
                      {t("maxStockLevel")}
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="maxStockLevel"
                        id="maxStockLevel"
                        min="0"
                        step="0.01"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.maxStockLevel || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{t("maxStockLevelHelp")}</p>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <Link
                      href="/admin/inventory"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {t("cancel")}
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("saving")}
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" /> {t("save")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Metadata */}
          {inventory && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t("metadata")}</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t("id")}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inventory.id}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t("createdAt")}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateTime(inventory.createdAt)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t("updatedAt")}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateTime(inventory.updatedAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
