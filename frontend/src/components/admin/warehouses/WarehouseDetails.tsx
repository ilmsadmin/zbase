"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWarehouse, useWarehouseStats, useWarehouseInventory } from '@/hooks/useWarehouses';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { LoadingState } from '@/lib/react-query/hooks';
import { formatDate, formatCurrency } from '@/lib/utils';
import { WarehouseForm } from './WarehouseForm';
import { LocationTree } from './LocationTree';
import { WarehouseInventoryTable } from './WarehouseInventoryTable';

export function WarehouseDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Fetch warehouse info
  const { data: warehouse, isLoading, isError, error } = useWarehouse(id);
  
  // Fetch warehouse stats
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useWarehouseStats(id);
  
  // Fetch warehouse inventory
  const { 
    data: inventory,
    isLoading: isLoadingInventory 
  } = useWarehouseInventory(id);

  const handleBackClick = () => {
    router.push('/admin/warehouses');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            Back
          </Button>
          <h1 className="text-2xl font-bold">Warehouse Details</h1>
        </div>
        {warehouse && (
          <Button onClick={() => setShowEditForm(true)}>Edit Warehouse</Button>
        )}
      </div>

      <LoadingState isLoading={isLoading} isError={isError} error={error}>
        {warehouse && (
          <>
            {/* Warehouse Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Warehouse Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{warehouse.name}</h3>
                      <p className="text-sm text-gray-500">Code: {warehouse.code}</p>
                      {warehouse.description && (
                        <p className="text-sm mt-2">{warehouse.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Status</h4>
                      {warehouse.isActive ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                    
                    {warehouse.address && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Address</h4>
                        <p className="text-sm">
                          {warehouse.address}<br />
                          {warehouse.city && `${warehouse.city}, `}
                          {warehouse.province && `${warehouse.province} `}
                          {warehouse.postalCode && warehouse.postalCode}<br />
                          {warehouse.country && warehouse.country}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Created</h4>
                      <p className="text-sm">{formatDate(warehouse.createdAt)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Last Updated</h4>
                      <p className="text-sm">{formatDate(warehouse.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Cards */}
              <div className="col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Products</p>
                          <p className="text-2xl font-bold">
                            {isLoadingStats ? "--" : stats?.totalProducts || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                          <p className="text-2xl font-bold">
                            {isLoadingStats ? "--" : stats?.totalQuantity || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Value</p>
                          <p className="text-2xl font-bold">
                            {isLoadingStats ? "--" : formatCurrency(stats?.totalValue || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                          <p className="text-2xl font-bold">
                            {isLoadingStats ? "--" : stats?.lowStockCount || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Add more stats cards as needed */}
                </div>
              </div>
            </div>

            {/* Tabs for Locations and Inventory */}
            <Tabs defaultValue="locations" className="mt-6">
              <TabsList>
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>
              
              <TabsContent value="locations" className="py-4">
                <LocationTree warehouseId={id} />
              </TabsContent>
              
              <TabsContent value="inventory" className="py-4">
                <LoadingState isLoading={isLoadingInventory} isError={false}>
                  <WarehouseInventoryTable inventory={inventory?.items || []} />
                </LoadingState>
              </TabsContent>
            </Tabs>
            
            {/* Edit Form Modal */}
            {showEditForm && (
              <WarehouseForm
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                warehouse={warehouse}
              />
            )}
          </>
        )}
      </LoadingState>
    </div>
  );
}
