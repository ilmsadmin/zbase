'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, FormInput, FormTextarea, FormSelect, FormFileUpload } from '@/components/ui';
import { Save } from 'lucide-react';

const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Tên công ty là bắt buộc'),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string().email('Định dạng email không hợp lệ').or(z.string().length(0)),
  taxId: z.string(),
  taxRate: z.string().transform(val => (val === '' ? '0' : val)),
  currency: z.string().min(1, 'Tiền tệ là bắt buộc'),
  currencySymbol: z.string().min(1, 'Ký hiệu tiền tệ là bắt buộc'),
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

  const methods = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: defaultCompanySettings,
  });  const { 
    handleSubmit, 
    formState: { isDirty } 
  } = methods;
  const currencyOptions = [
    { label: 'Việt Nam Đồng (VND)', value: 'VND' },
    { label: 'Đô la Mỹ (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'Yên Nhật (JPY)', value: 'JPY' },
    { label: 'Bảng Anh (GBP)', value: 'GBP' },
  ];
  const currencyPositionOptions = [
    { label: 'Trước số tiền (€100)', value: 'before' },
    { label: 'Sau số tiền (100€)', value: 'after' },
  ];

  const separatorOptions = {
    decimal: [
      { label: 'Dấu chấm (.)', value: '.' },
      { label: 'Dấu phẩy (,)', value: ',' },
    ],
    thousands: [
      { label: 'Dấu phẩy (,)', value: ',' },
      { label: 'Dấu chấm (.)', value: '.' },
      { label: 'Dấu cách ( )', value: ' ' },
      { label: 'Không có', value: '' },
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
  };  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Cài đặt công ty</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Info Section */}
        <div className="bg-card border border-border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Thông tin công ty</h3>
          
          <div className="mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-32">
                <img 
                  src={logoUrl} 
                  alt="Logo công ty" 
                  className="w-full h-32 object-contain border border-border rounded-md p-2"
                />
                <div className="mt-2">
                  <FormFileUpload
                    accept="image/*"
                    onFileSelected={handleLogoUpload}
                    buttonText="Tải lên Logo"
                    size="sm"
                    fullWidth
                  />
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">                <div className="md:col-span-2">
                  <FormInput
                    label="Tên công ty"
                    name="companyName"
                  />
                </div>
                  <div className="md:col-span-2">
                  <FormTextarea
                    label="Địa chỉ"
                    name="address"
                    rows={2}
                  />
                </div>
                
                <FormInput
                  label="Thành phố"
                  name="city"
                />
                
                <FormInput
                  label="Tỉnh/Thành"
                  name="state"
                />
                
                <FormInput
                  label="Mã bưu chính"
                  name="postalCode"
                />
                
                <FormInput
                  label="Quốc gia"
                  name="country"
                />
              </div>
            </div>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Số điện thoại"
              name="phone"
            />
            
            <FormInput
              label="Email"
              type="email"
              name="email"
            />
            
            <FormInput
              label="Website"
              name="website"
            />
          </div>
        </div>
        
        {/* Tax Settings Section */}
        <div className="bg-card border border-border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Cài đặt thuế</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Mã số thuế / VAT"
              name="taxId"
            />
            
            <FormInput
              label="Thuế suất mặc định (%)"
              type="number"
              min="0"
              max="100"
              step="0.01"
              name="taxRate"
            />
          </div>
        </div>
        
        {/* Currency Settings Section */}
        <div className="bg-card border border-border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Cài đặt tiền tệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Tiền tệ"
              name="currency"
              options={currencyOptions}
            />
            
            <FormInput
              label="Ký hiệu tiền tệ"
              name="currencySymbol"
            />
            
            <FormSelect
              label="Vị trí tiền tệ"
              name="currencyPosition"
              options={currencyPositionOptions}
            />
            
            <FormSelect
              label="Dấu thập phân"
              name="decimalSeparator"
              options={separatorOptions.decimal}
            />
            
            <FormSelect
              label="Dấu phân cách hàng nghìn"
              name="thousandsSeparator"
              options={separatorOptions.thousands}
            />
          </div>
        </div>
          {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || (!isDirty && logoUrl === '/no-image.svg')}
          >
            {isSubmitting ? 'Đang lưu...' : isSaved ? 'Đã lưu!' : 'Lưu cài đặt'}
          </Button>
        </div></form>
      </div>
    </FormProvider>
  );
}
