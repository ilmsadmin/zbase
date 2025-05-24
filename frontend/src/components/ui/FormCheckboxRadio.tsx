"use client";

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import { Circle } from 'lucide-react';

// Checkbox Component
interface FormCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  name: string;
  label?: string;
  helperText?: string;
}

const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  FormCheckboxProps
>(({ className, name, label, helperText, ...props }, ref) => {
  const formContext = useFormContext();
  const { control, formState } = formContext || { formState: { errors: {} } };
  const error = formState?.errors?.[name as any];

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-start space-x-2">
            <CheckboxPrimitive.Root
              ref={ref}
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={cn(
                'peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                error && 'border-red-500',
                className
              )}
              {...props}
            >
              <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center')}>
                <Check className="h-4 w-4" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
          </div>
        )}
      />
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-500">
          {error.message as string}
        </p>
      )}
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

// Radio Component
interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  name: string;
  label?: string;
  options: RadioOption[];
  helperText?: string;
}

const FormRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  FormRadioGroupProps
>(({ className, name, label, options, helperText, ...props }, ref) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium leading-none mb-2">{label}</p>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroupPrimitive.Root
            onValueChange={field.onChange}
            value={field.value}
            className={cn('space-y-2', className)}
            {...props}
            ref={ref}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupPrimitive.Item
                  id={`${name}-${option.value}`}
                  value={option.value}
                  className={cn(
                    'h-4 w-4 rounded-full border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-red-500'
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <Circle className="h-2.5 w-2.5 fill-current text-primary" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroupPrimitive.Root>
        )}
      />
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-500">
          {error.message as string}
        </p>
      )}
    </div>
  );
});

FormRadioGroup.displayName = 'FormRadioGroup';

export { FormCheckbox, FormRadioGroup };
