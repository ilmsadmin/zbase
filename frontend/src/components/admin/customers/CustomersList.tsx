"use client";

import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/lib/services/customersService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/lib/react-query/hooks';
import { CustomerForm } from './CustomerForm';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function CustomersList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const router = useRouter();

  const { data, isLoading, isError, error } = useCustomers({
    search: searchTerm || undefined,
    groupId: groupFilter || undefined,
    limit: 20,
    page: 1
  });

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleViewDetails = (customer: Customer) => {
    router.push(`/admin/customers/${customer.id}`);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <Button onClick={handleAddNew}>Thêm khách hàng</Button>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm khách hàng theo tên, email hoặc điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >            <option value="">Tất cả nhóm</option>
            <option value="group1">Bán lẻ</option>
            <option value="group2">Bán buôn</option>
            <option value="group3">VIP</option>
          </select>
        </div>
      </div>

      {/* Customer table */}
      <LoadingState isLoading={isLoading} isError={isError} error={error}>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhóm
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số dư
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.items?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{formatDate(customer.createdAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone || '-'}</div>
                      <div className="text-sm text-gray-500">{customer.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {customer.groupId ? 'Tên nhóm' : 'Chưa phân nhóm'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${customer.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(customer.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => handleViewDetails(customer)}
                      >                        Xem
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEdit(customer)}
                      >
                        Sửa
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {data?.items?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy khách hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </LoadingState>

      {/* Customer form modal */}
      {showForm && (
        <CustomerForm 
          isOpen={showForm} 
          onClose={handleFormClose} 
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}
