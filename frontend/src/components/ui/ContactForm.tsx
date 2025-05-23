'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { Button } from './Button';
import { Send } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      message: '',
    },
  });

  const { handleSubmit, formState } = methods;
  
  const { isSubmitting } = formState;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="name"
            label="Họ và tên"
            placeholder="Nhập họ và tên của bạn"
            required
          />
          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại của bạn"
          />
          <FormInput
            name="companyName"
            label="Tên công ty"
            placeholder="Nhập tên công ty của bạn"
          />
        </div>
        
        <FormTextarea
          name="message"
          label="Tin nhắn"
          placeholder="Hãy cho chúng tôi biết bạn quan tâm đến điều gì..."
          rows={4}
          required
        />        <Button 
          type="submit" 
          className="w-full md:w-auto bg-orange-300 hover:bg-orange-400 text-orange-900 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Đang gửi...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Gửi tin nhắn
            </>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
