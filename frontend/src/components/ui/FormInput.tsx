"use client";

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from './Input';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, name, label, helperText, type = 'text', ...props }, ref) => {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Input
              {...field}
              {...props}
              type={type}
              id={name}
              ref={ref}
              className={cn(
                error && 'border-red-500 focus-visible:ring-red-500',
                className
              )}
              aria-invalid={!!error}
              value={field.value || ''}
            />
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
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
