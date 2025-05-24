"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function InvoiceSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoice Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="numbering">Numbering</TabsTrigger>
          <TabsTrigger value="payment">Payment Options</TabsTrigger>
          <TabsTrigger value="emails">Email Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">General Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <FormInput
                  label="Default Due Days"
                  type="number"
                  defaultValue="30"
                  helperText="Number of days until an invoice is due by default"
                />
                
                <FormSelect
                  label="Default Currency"
                  defaultValue="USD"
                  options={[
                    { value: 'USD', label: 'US Dollar (USD)' },
                    { value: 'EUR', label: 'Euro (EUR)' },
                    { value: 'GBP', label: 'British Pound (GBP)' },
                    { value: 'JPY', label: 'Japanese Yen (JPY)' },
                    { value: 'CAD', label: 'Canadian Dollar (CAD)' }
                  ]}
                />
                
                <FormSelect
                  label="Tax Calculation"
                  defaultValue="line_item"
                  options={[
                    { value: 'line_item', label: 'Calculate tax per line item' },
                    { value: 'subtotal', label: 'Calculate tax on subtotal' }
                  ]}
                  helperText="How tax should be calculated on invoices"
                />
                
                <FormTextarea
                  label="Default Terms & Conditions"
                  defaultValue="Payment is due within the specified number of days. Late payments are subject to a 1.5% monthly interest charge."
                  helperText="Terms that will appear at the bottom of all invoices by default"
                />
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="numbering">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Invoice Numbering</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <FormSelect
                  label="Numbering Format"
                  defaultValue="sequential"
                  options={[
                    { value: 'sequential', label: 'Sequential (e.g., 00001, 00002)' },
                    { value: 'year_sequential', label: 'Year + Sequential (e.g., 2025-0001)' },
                    { value: 'custom', label: 'Custom Format' }
                  ]}
                />
                
                <FormInput
                  label="Prefix"
                  defaultValue="INV-"
                  helperText="Text to appear before the invoice number"
                />
                
                <FormInput
                  label="Next Invoice Number"
                  type="number"
                  defaultValue="1001"
                  helperText="The next sequential number to be used"
                />
                
                <FormInput
                  label="Minimum Digits"
                  type="number"
                  defaultValue="4"
                  helperText="Minimum number of digits with leading zeros"
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Preview</h3>
                <p>Next invoice number will be: <span className="font-bold">INV-1001</span></p>
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Options</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-1">
                <h3 className="font-medium">Available Payment Methods</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select the payment methods that customers can use to pay invoices
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="payment-method-bank"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="payment-method-bank" className="ml-2 text-sm font-medium">
                      Bank Transfer
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="payment-method-credit-card"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="payment-method-credit-card" className="ml-2 text-sm font-medium">
                      Credit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="payment-method-paypal"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="payment-method-paypal" className="ml-2 text-sm font-medium">
                      PayPal
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="payment-method-cash"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="payment-method-cash" className="ml-2 text-sm font-medium">
                      Cash
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="payment-method-check"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="payment-method-check" className="ml-2 text-sm font-medium">
                      Check
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Online Payment Integration</h3>
                
                <FormSelect
                  label="Payment Processor"
                  defaultValue="stripe"
                  options={[
                    { value: 'stripe', label: 'Stripe' },
                    { value: 'paypal', label: 'PayPal' },
                    { value: 'square', label: 'Square' },
                    { value: 'none', label: 'None - Manual Processing Only' }
                  ]}
                />
                
                <FormInput
                  label="API Key"
                  type="password"
                  defaultValue="sk_test_123456789"
                  helperText="Your payment processor API key"
                />
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="emails">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Email Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Send Invoice Email Automatically</h3>
                    <p className="text-sm text-gray-500">Automatically email invoices when they are created</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Send Payment Reminder Emails</h3>
                    <p className="text-sm text-gray-500">Automatically send reminders for overdue invoices</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <FormInput
                  label="Default Email Subject"
                  defaultValue="Invoice #{invoice_number} from ZBase"
                  helperText="Subject line for invoice emails. Use {invoice_number}, {company_name}, etc. for variables."
                />
                
                <FormTextarea
                  label="Email Introduction"
                  defaultValue="Dear {customer_name},\n\nPlease find attached your invoice #{invoice_number} for {invoice_amount}.\n\nThank you for your business."
                  helperText="Text that appears at the beginning of invoice emails"
                  rows={6}
                />
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
