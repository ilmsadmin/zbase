'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, FormInput, FormTextarea, FormSelect, FormFileUpload } from '@/components/ui';
import { Save } from 'lucide-react';

const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string().email('Invalid email format').or(z.string().length(0)),
  taxId: z.string(),
  taxRate: z.string().transform(val => (val === '' ? '0' : val)),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  currencyPosition: z.enum(['before', 'after']),
  decimalSeparator: z.enum(['.', ',']),
  thousandsSeparator: z.enum([',', '.', ' ', '']),
  website: z.string(),
});

type CompanySettingsValues = z.infer<typeof companySettingsSchema>;

// Mock data for form
const defaultCompanySettings: CompanySettingsValues = {
  companyName: 'ZBase Enterprise',
  address: '123 Main Street',
  city: 'Ho Chi Minh City',
  state: '',
  postalCode: '70000',
  country: 'Vietnam',
  phone: '+84 28 1234 5678',
  email: 'info@zbase.example.com',
  taxId: '1234567890',
  taxRate: '10',
  currency: 'VND',
  currencySymbol: '₫',
  currencyPosition: 'after',
  decimalSeparator: ',',
  thousandsSeparator: '.',
  website: 'https://zbase.example.com',
};

export default function CompanySettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string>('/no-image.svg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isDirty } 
  } = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: defaultCompanySettings,
  });

  const currencyOptions = [
    { label: 'Vietnam Dong (VND)', value: 'VND' },
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'British Pound (GBP)', value: 'GBP' },
  ];

  const currencyPositionOptions = [
    { label: 'Before amount (€100)', value: 'before' },
    { label: 'After amount (100€)', value: 'after' },
  ];

  const separatorOptions = {
    decimal: [
      { label: 'Dot (.)', value: '.' },
      { label: 'Comma (,)', value: ',' },
    ],
    thousands: [
      { label: 'Comma (,)', value: ',' },
      { label: 'Dot (.)', value: '.' },
      { label: 'Space ( )', value: ' ' },
      { label: 'None', value: '' },
    ],
  };

  const handleLogoUpload = (file: File) => {
    // In a real app, this would upload the file to the server
    // and then update the logoUrl with the URL from the server
    const objectUrl = URL.createObjectURL(file);
    setLogoUrl(objectUrl);
    console.log('Uploaded file:', file.name);
    return () => URL.revokeObjectURL(objectUrl);
  };

  const onSubmit = async (data: CompanySettingsValues) => {
    setIsSubmitting(true);
    setIsSaved(false);
    
    try {
      // In a real app, this would send the data to the server
      console.log('Submitting company settings:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving company settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Company Settings</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Info Section */}
        <div className="bg-card border border-border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Company Information</h3>
          
          <div className="mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-32">
                <img 
                  src={logoUrl} 
                  alt="Company Logo" 
                  className="w-full h-32 object-contain border border-border rounded-md p-2"
                />
                <div className="mt-2">
                  <FormFileUpload
                    accept="image/*"
                    onFileSelected={handleLogoUpload}
                    buttonText="Upload Logo"
                    size="sm"
                    fullWidth
                  />
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput
                    label="Company Name"
                    {...register('companyName')}
                    error={errors.companyName?.message}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <FormTextarea
                    label="Address"
                    {...register('address')}
                    error={errors.address?.message}
                    rows={2}
                  />
                </div>
                
                <FormInput
                  label="City"
                  {...register('city')}
                  error={errors.city?.message}
                />
                
                <FormInput
                  label="State/Province"
                  {...register('state')}
                  error={errors.state?.message}
                />
                
                <FormInput
                  label="Postal Code"
                  {...register('postalCode')}
                  error={errors.postalCode?.message}
                />
                
                <FormInput
                  label="Country"
                  {...register('country')}
                  error={errors.country?.message}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Phone"
              {...register('phone')}
              error={errors.phone?.message}
            />
            
            <FormInput
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <FormInput
              label="Website"
              {...register('website')}
              error={errors.website?.message}
            />
          </div>
        </div>
        
        {/* Tax Settings Section */}
        <div className="bg-card border border-border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Tax Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Tax ID / VAT Number"
              {...register('taxId')}
              error={errors.taxId?.message}
            />
            
            <FormInput
              label="Default Tax Rate (%)"
              type="number"
              min="0"
              max="100"
              step="0.01"
              {...register('taxRate')}
              error={errors.taxRate?.message}
            />
          </div>
        </div>
        
        {/* Currency Settings Section */}
        <div className="bg-card border border-border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Currency Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Currency"
              name="currency"
              control={control}
              options={currencyOptions}
              error={errors.currency?.message}
            />
            
            <FormInput
              label="Currency Symbol"
              {...register('currencySymbol')}
              error={errors.currencySymbol?.message}
            />
            
            <FormSelect
              label="Currency Position"
              name="currencyPosition"
              control={control}
              options={currencyPositionOptions}
              error={errors.currencyPosition?.message}
            />
            
            <FormSelect
              label="Decimal Separator"
              name="decimalSeparator"
              control={control}
              options={separatorOptions.decimal}
              error={errors.decimalSeparator?.message}
            />
            
            <FormSelect
              label="Thousands Separator"
              name="thousandsSeparator"
              control={control}
              options={separatorOptions.thousands}
              error={errors.thousandsSeparator?.message}
            />
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || (!isDirty && logoUrl === '/no-image.svg')}
          >
            {isSubmitting ? 'Saving...' : isSaved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
