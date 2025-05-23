"use client";

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  FormRadioGroup,
  FormDatePicker,
  FormFileUpload,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Spinner
} from '@/components/ui';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  description: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms' }),
  preferredContact: z.string(),
  birthdate: z.date().optional(),
  avatar: z.any().optional(),
});

export default function ComponentsTest() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      description: '',
      agreeToTerms: false,
      preferredContact: 'email',
      birthdate: undefined,
      avatar: null,
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    alert('Form submitted! Check console for data.');
  };

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'food', label: 'Food & Beverages' },
  ];

  const contactOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'mail', label: 'Mail' },
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">UI Components Test</h1>
      
      {/* Base UI Components Demo */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Base UI Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><span>🔍</span></Button>
            </div>
          </div>
          
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
          
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Cards</h3>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Alerts</h3>
            <div className="space-y-2">
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong!</AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your changes have been saved.</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Please review this information.</AlertDescription>
              </Alert>
              <Alert variant="info">
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>Here's something you should know.</AlertDescription>
              </Alert>
            </div>
          </div>
          
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Spinner/Loading</h3>
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
              <Spinner color="secondary" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Components Demo */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Form Components</h2>
        <Card>
          <CardHeader>
            <CardTitle>Form Components Demo</CardTitle>
            <CardDescription>Fill out this form to test all form components</CardDescription>
          </CardHeader>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    helperText="Enter your full name"
                  />
                  <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    helperText="We'll never share your email"
                  />
                </div>
                
                <FormSelect
                  name="category"
                  label="Category"
                  options={categories}
                  placeholder="Select a category"
                  helperText="Choose the most relevant category"
                  searchable={true}
                />
                
                <FormTextarea
                  name="description"
                  label="Description"
                  placeholder="Tell us more..."
                  helperText="Optional details about your request"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormRadioGroup
                    name="preferredContact"
                    label="Preferred Contact Method"
                    options={contactOptions}
                    helperText="How should we contact you?"
                  />
                  
                  <FormDatePicker
                    name="birthdate"
                    label="Birth Date"
                    placeholder="Select your birth date"
                    helperText="Optional"
                  />
                </div>
                
                <FormFileUpload
                  name="avatar"
                  label="Profile Picture"
                  accept="image/*"
                  helperText="Upload a profile picture (max 5MB)"
                  maxSize={5}
                  showPreview={true}
                />
                
                <FormCheckbox
                  name="agreeToTerms"
                  label="I agree to the terms and conditions"
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">Submit Form</Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
}
