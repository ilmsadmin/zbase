"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomer, useCustomerTransactions } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { LoadingState } from '@/lib/react-query/hooks';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CustomerForm } from './CustomerForm';
import { PurchaseHistoryTable } from './PurchaseHistoryTable';
import { CustomerTransactionsTable } from './CustomerTransactionsTable';
import { CustomerNotesSection } from './CustomerNotesSection';

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Fetch customer info
  const { data: customer, isLoading, isError, error } = useCustomer(id);
  
  // Fetch customer transactions
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
  } = useCustomerTransactions(id);

  const handleBackClick = () => {
    router.push('/admin/customers');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            Back
          </Button>
          <h1 className="text-2xl font-bold">Customer Details</h1>
        </div>
        {customer && (
          <Button onClick={() => setShowEditForm(true)}>Edit Customer</Button>
        )}
      </div>

      <LoadingState isLoading={isLoading} isError={isError} error={error}>
        {customer && (
          <>
            {/* Customer Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      {customer.groupId && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Group Name
                        </span>
                      )}
                    </div>
                    
                    {(customer.phone || customer.email) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                        {customer.phone && <p className="text-sm">Phone: {customer.phone}</p>}
                        {customer.email && <p className="text-sm">Email: {customer.email}</p>}
                      </div>
                    )}
                    
                    {customer.address && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Address</h4>
                        <p className="text-sm">
                          {customer.address}<br />
                          {customer.city && `${customer.city}, `}
                          {customer.province && `${customer.province} `}
                          {customer.postalCode && customer.postalCode}<br />
                          {customer.country && customer.country}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Credit Information</h4>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm">Credit Limit:</p>
                        <p className="text-sm font-medium">
                          {customer.creditLimit ? formatCurrency(customer.creditLimit) : 'Not set'}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm">Current Balance:</p>
                        <p className={`text-sm font-medium ${customer.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(customer.balance)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Account Created</h4>
                      <p className="text-sm">{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <div className="col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Purchase Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Orders</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Spent</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Purchase</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                          <p className="text-2xl font-bold">--</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className={`text-4xl font-bold ${customer.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(customer.balance)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {customer.balance < 0 
                            ? 'Customer owes this amount' 
                            : customer.balance > 0 
                              ? 'Customer credit balance'
                              : 'Account is settled'}
                        </p>
                        <div className="mt-4 space-x-2">
                          <Button variant="outline" size="sm">Record Payment</Button>
                          <Button variant="outline" size="sm">Add Credit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="purchases" className="mt-6">
              <TabsList>
                <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                <TabsTrigger value="transactions">Credit/Debt</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="purchases" className="py-4">
                <PurchaseHistoryTable customerId={id} />
              </TabsContent>
              
              <TabsContent value="transactions" className="py-4">
                <CustomerTransactionsTable 
                  transactions={transactions?.items || []}
                  isLoading={isLoadingTransactions}
                />
              </TabsContent>
              
              <TabsContent value="notes" className="py-4">
                <CustomerNotesSection 
                  customerId={id}
                  initialNotes={customer.notes || ''}
                />
              </TabsContent>
            </Tabs>
            
            {/* Edit Form Modal */}
            {showEditForm && (
              <CustomerForm
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                customer={customer}
              />
            )}
          </>
        )}
      </LoadingState>
    </div>
  );
}
