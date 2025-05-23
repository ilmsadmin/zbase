"use client";

import { useState } from 'react';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Warehouse } from '@/lib/services/warehousesService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/lib/react-query/hooks';
import { WarehouseForm } from './WarehouseForm';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function WarehousesList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const router = useRouter();

  const { data, isLoading, isError, error } = useWarehouses({
    limit: 20,
    page: 1
  });

  const handleAddNew = () => {
    setSelectedWarehouse(null);
    setShowForm(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowForm(true);
  };

  const handleViewDetails = (warehouse: Warehouse) => {
    router.push(`/admin/warehouses/${warehouse.id}`);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedWarehouse(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouse Management</h1>
        <Button onClick={handleAddNew}>Add Warehouse</Button>
      </div>

      {/* Loading and error handling */}
      <LoadingState isLoading={isLoading} isError={isError} error={error}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items?.map((warehouse) => (
            <Card key={warehouse.id} className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{warehouse.name}</CardTitle>
                    <CardDescription>Code: {warehouse.code}</CardDescription>
                  </div>
                  {warehouse.isActive ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Inactive</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {warehouse.address && (
                    <p className="text-gray-600 mb-2">
                      {warehouse.address}, {warehouse.city || ''} {warehouse.province || ''}
                    </p>
                  )}
                  <p className="text-gray-500">Created: {formatDate(warehouse.createdAt)}</p>
                </div>
                
                {/* Quick stats per warehouse - placeholder until we fetch actual stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-xs text-blue-500 font-medium">Products</p>
                    <p className="text-xl font-bold">--</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-xs text-green-500 font-medium">Value</p>
                    <p className="text-xl font-bold">--</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(warehouse)}>
                  Edit
                </Button>
                <Button variant="default" size="sm" onClick={() => handleViewDetails(warehouse)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </LoadingState>

      {/* No warehouses placeholder */}
      {data?.items?.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first warehouse.</p>
          <Button onClick={handleAddNew}>Add Warehouse</Button>
        </div>
      )}

      {/* Warehouse form modal */}
      {showForm && (
        <WarehouseForm 
          isOpen={showForm} 
          onClose={handleFormClose} 
          warehouse={selectedWarehouse}
        />
      )}
    </div>
  );
}
