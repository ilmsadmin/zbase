"use client";

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  helperText?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(  ({ className, name, label, helperText, ...props }, ref) => {
    const formContext = useFormContext();
    const { control, formState } = formContext || { formState: { errors: {} } };
    const error = formState?.errors?.[name as any];

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
        {!control ? (
          <textarea
            id={name}
            name={name}
            ref={ref}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
        ) : (
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <textarea
                {...field}
                {...props}
                id={name}
                ref={ref}
                className={cn(
                  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  error && 'border-red-500 focus-visible:ring-red-500',
                  className
                )}
                aria-invalid={!!error}
                value={field.value || ''}
              />
            )}
          />
        )}
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

FormTextarea.displayName = 'FormTextarea';

export { FormTextarea };
