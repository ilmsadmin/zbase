"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from '@/services/api/invoices';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormSelect } from '@/components/ui/FormSelect';
import { useRouter } from 'next/navigation';

export default function InvoiceTemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Fetch invoice templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['invoiceTemplates'],
    queryFn: () => invoicesApi.getInvoiceTemplates(),
  });

  const handleViewTemplate = (templateId: string) => {
    // Logic to preview the template would go here
    window.open(`/api/invoices/templates/${templateId}/preview`, '_blank');
  };

  const handleSetDefault = async (templateId: string) => {
    try {
      // This would call an API to set a template as default
      alert('Template set as default');
    } catch (error) {
      console.error('Error setting default template:', error);
      alert('Failed to set template as default');
    }
  };

  const templateOptions = templates?.map((template: any) => ({
    value: template.id,
    label: template.name,
  })) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Templates</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Default Template */}
        <Card className="p-4">
          <div className="aspect-w-8 aspect-h-11 bg-gray-100 mb-4">
            <div className="flex items-center justify-center">
              <img 
                src="/images/templates/default-template.png" 
                alt="Default Template"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/no-image.svg';
                }}
              />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2">Default Template</h3>
          <p className="text-gray-600 text-sm mb-4">Standard invoice template for business use</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleViewTemplate('default')}>
              Preview
            </Button>
            <Button onClick={() => handleSetDefault('default')}>
              Set as Default
            </Button>
          </div>
        </Card>

        {/* Thermal Printer Template */}
        <Card className="p-4">
          <div className="aspect-w-8 aspect-h-11 bg-gray-100 mb-4">
            <div className="flex items-center justify-center">
              <img 
                src="/images/templates/thermal-template.png" 
                alt="Thermal Printer Template"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/no-image.svg';
                }}
              />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2">Thermal Printer Template</h3>
          <p className="text-gray-600 text-sm mb-4">Compact receipt for POS thermal printers</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleViewTemplate('thermal')}>
              Preview
            </Button>
            <Button onClick={() => handleSetDefault('thermal')}>
              Set as Default
            </Button>
          </div>
        </Card>

        {/* A4 Template */}
        <Card className="p-4">
          <div className="aspect-w-8 aspect-h-11 bg-gray-100 mb-4">
            <div className="flex items-center justify-center">
              <img 
                src="/images/templates/a4-template.png" 
                alt="A4 Template"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/no-image.svg';
                }}
              />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2">A4 Template</h3>
          <p className="text-gray-600 text-sm mb-4">Full-page invoice for professional printing</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleViewTemplate('a4')}>
              Preview
            </Button>
            <Button onClick={() => handleSetDefault('a4')}>
              Set as Default
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
