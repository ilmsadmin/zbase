"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiEdit, FiTrash2, FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiTag } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Link } from '@/i18n/navigation';
import { formatDateTime } from '@/lib/utils/format';
import { apiClient } from "@/lib/api/client";

interface PageProps {
  params: {
    id: string;
  };
}

// Define the Employee interface
interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  status: 'active' | 'inactive';
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeDetailPage({ params }: PageProps) {
  const t = useTranslations('admin.employees');
  const { id } = params;
  const employeeId = parseInt(id, 10);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const employeeData = await apiClient.get(`/users/${employeeId}`);
      setEmployee(employeeData);
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError(t('errors.employeeNotFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await apiClient.delete(`/users/${employeeId}`);
        window.location.href = '/admin/employees';
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError(t('errors.deleteFailed'));
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !employee) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-600">
              {error || t('errors.employeeNotFound')}
            </div>
            <Link href="/admin/employees" className="text-blue-600 hover:underline mt-4 inline-block">
              <FiArrowLeft className="inline mr-2" /> {t('backToEmployees')}
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header with actions */}
          <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <Link href="/admin/employees" className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <FiUser size={24} className="text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
              <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full 
                ${employee.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'}`}>
                {employee.status === 'active' ? t('status.active') : t('status.inactive')}
              </span>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/employees/${employee.id}/roles`}>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  <FiShield className="mr-2" /> {t('employeeDetails.assignRoles')}
                </button>
              </Link>
              <Link href={`/admin/employees/${employee.id}/edit`}>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                  <FiEdit className="mr-2" /> {t('actions.edit')}
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                <FiTrash2 className="mr-2" /> {t('actions.delete')}
              </button>
            </div>
          </div>

          {/* Employee info content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t('employeeInfoTitle')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiUser className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">{t('createForm.nameLabel')}</div>
                      <div className="font-medium">{employee.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiMail className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">{t('employeeDetails.email')}</div>
                      <div className="font-medium">{employee.email}</div>
                    </div>
                  </div>
                  {employee.phone && (
                    <div className="flex items-start">
                      <FiPhone className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('employeeDetails.phone')}</div>
                        <div className="font-medium">{employee.phone}</div>
                      </div>
                    </div>
                  )}
                  {employee.position && (
                    <div className="flex items-start">
                      <FiTag className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('employeeDetails.position')}</div>
                        <div className="font-medium">{employee.position}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t('employeeRolesTitle')}</h2>
                <div>
                  <div className="text-sm text-gray-500 mb-2">{t('employeeDetails.assignedRoles')}</div>
                  {employee.roles && employee.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {employee.roles.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">{t('employeeDetails.noRolesAssigned')}</p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('employeeDetails.createdAt')}</div>
                      <div className="font-medium">{formatDateTime(employee.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-start mt-4">
                    <div className="mt-1 mr-3 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('employeeDetails.updatedAt')}</div>
                      <div className="font-medium">{formatDateTime(employee.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
