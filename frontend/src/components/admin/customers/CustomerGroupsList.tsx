"use client";

import { useState } from 'react';
import { useCustomerGroups } from '@/hooks/useCustomers';
import { CustomerGroup } from '@/lib/services/customersService';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/lib/react-query/hooks';
import { formatDate } from '@/lib/utils';
import { CustomerGroupForm } from './CustomerGroupForm';

export function CustomerGroupsList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | null>(null);

  const { data, isLoading, isError, error } = useCustomerGroups();

  const handleAddNew = () => {
    setSelectedGroup(null);
    setShowForm(true);
  };

  const handleEdit = (group: CustomerGroup) => {
    setSelectedGroup(group);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedGroup(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Groups</h1>
        <Button onClick={handleAddNew}>Add Group</Button>
      </div>

      <LoadingState isLoading={isLoading} isError={isError} error={error}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items?.map((group) => (
            <Card key={group.id} className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{group.name}</CardTitle>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {/* This would ideally come from the API */}
                    {Math.floor(Math.random() * 100)} members
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.description && (
                    <p className="text-sm text-gray-600">{group.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Discount</p>
                      <p className="text-lg font-semibold">
                        {group.discountPercentage ? `${group.discountPercentage}%` : 'None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm">
                        {formatDate(group.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleEdit(group)}
                    >
                      Edit Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* No groups placeholder */}
        {data?.items?.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customer groups found</h3>
            <p className="text-gray-500 mb-4">Create groups to organize your customers and offer special pricing.</p>
            <Button onClick={handleAddNew}>Add First Group</Button>
          </div>
        )}
      </LoadingState>

      {/* Customer group form modal */}
      {showForm && (
        <CustomerGroupForm 
          isOpen={showForm} 
          onClose={handleFormClose} 
          group={selectedGroup}
        />
      )}
    </div>
  );
}
