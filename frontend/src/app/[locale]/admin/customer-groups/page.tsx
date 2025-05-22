"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiUsers } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { DataTable, Column } from "@/components/ui/Table/DataTable";
import { formatDateTime } from "@/lib/utils/format";
import { Modal } from "@/components/ui/modal/Modal";

// Define the CustomerGroup type
interface CustomerGroup {
  id: number;
  name: string;
  description?: string;
  discount?: number;
  priority?: number;
  _count?: {
    customers: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Define the customer group service
const customerGroupService = {
  getAllGroups: async (): Promise<CustomerGroup[]> => {
    const response = await fetch('/api/customer-groups');
    if (!response.ok) {
      throw new Error('Failed to fetch customer groups');
    }
    return response.json();
  },
  createGroup: async (data: Partial<CustomerGroup>): Promise<CustomerGroup> => {
    const response = await fetch('/api/customer-groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create customer group');
    }
    return response.json();
  },
  updateGroup: async (id: number, data: Partial<CustomerGroup>): Promise<CustomerGroup> => {
    const response = await fetch(`/api/customer-groups/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update customer group');
    }
    return response.json();
  },
  deleteGroup: async (id: number): Promise<void> => {
    const response = await fetch(`/api/customer-groups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete customer group');
    }
  },
};

export default function CustomerGroupsPage() {
  const t = useTranslations("admin.customerGroups");
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: 0,
    priority: 0,
  });

  const fetchGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await customerGroupService.getAllGroups();
      setGroups(data);
    } catch (err) {
      console.error("Error fetching customer groups:", err);
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await customerGroupService.deleteGroup(id);
        // Remove the deleted group from the state
        setGroups(groups.filter(group => group.id !== id));
      } catch (err) {
        console.error("Error deleting customer group:", err);
        setError(t("errors.deleteFailed"));
      }
    }
  };

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
      discount: 0,
      priority: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (group: CustomerGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      discount: group.discount || 0,
      priority: group.priority || 0,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGroup) {
        // Update existing group
        const updatedGroup = await customerGroupService.updateGroup(editingGroup.id, formData);
        setGroups(groups.map(group => group.id === updatedGroup.id ? updatedGroup : group));
      } else {
        // Create new group
        const newGroup = await customerGroupService.createGroup(formData);
        setGroups([...groups, newGroup]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving customer group:", err);
      setError(editingGroup ? t("errors.updateFailed") : t("errors.createFailed"));
    }
  };

  // Define table columns
  const columns: Column<CustomerGroup>[] = [
    {
      key: "name",
      header: t("columns.name"),
      sortable: true
    },
    {
      key: "description",
      header: t("columns.description"),
      render: (row) => row.description || '-',
      sortable: true
    },
    {
      key: "discount",
      header: t("columns.discount"),
      render: (row) => row.discount ? `${row.discount}%` : '0%',
      sortable: true,
      align: 'center'
    },
    {
      key: "priority",
      header: t("columns.priority"),
      render: (row) => row.priority?.toString() || '0',
      sortable: true,
      align: 'center'
    },
    {
      key: "customers",
      header: t("columns.customers"),
      render: (row) => row._count?.customers?.toString() || '0',
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
          <button 
            className="p-1 text-green-600 hover:text-green-800" 
            title={t("edit")}
            onClick={() => openEditModal(row)}
          >
            <FiEdit size={18} />
          </button>
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
      width: '100px'
    }
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header with title and action buttons */}
          <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <FiUsers size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchGroups}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiRefreshCw className="mr-2" /> {t("refresh")}
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
              >
                <FiPlus className="mr-2" /> {t("new")}
              </button>
            </div>
          </div>

          {/* Search and filters section */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder={t("searchPlaceholder")}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Customer Groups table */}
          <div className="p-6">
            <DataTable 
              columns={columns}
              data={groups}
              isLoading={loading}
              exportable
              exportFilename="customer-groups-list"
            />
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? t("editGroup") : t("createGroup")}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t("fields.name")} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t("fields.description")}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fields.discount")} (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fields.priority")}
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {editingGroup ? t("update") : t("create")}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
