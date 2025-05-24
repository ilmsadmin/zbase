"use client";

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  isClearable?: boolean;
  searchable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(
  ({ className, name, label, helperText, options, placeholder, isClearable, value, onChange, ...props }, ref) => {
    const formContext = useFormContext();
    // If not used within a FormProvider context, use the direct value and onChange props
    const isFormProviderAvailable = !!formContext;
    
    const error = isFormProviderAvailable ? formContext.formState.errors[name] : null;
    
    return (
      <div className="space-y-2" ref={ref}>
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        {isFormProviderAvailable ? (
          <Controller
            control={formContext.control}
            name={name}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === "_empty_" && isClearable) {
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value === undefined || field.value === "" ? "_empty_" : field.value}
                {...props}
              >
                <SelectTrigger className={cn(error && 'border-red-500 focus-visible:ring-red-500')}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {isClearable && (
                    <SelectItem value="_empty_">
                      {placeholder || "Select..."}
                    </SelectItem>
                  )}
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value || "_empty_value"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Select
            onValueChange={(newValue) => {
              if (newValue === "_empty_" && isClearable) {
                onChange?.("");
              } else {
                onChange?.(newValue);
              }
            }}
            value={value === undefined || value === "" ? "_empty_" : value}
            {...props}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {isClearable && (
                <SelectItem value="_empty_">
                  {placeholder || "Select..."}
                </SelectItem>
              )}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value || "_empty_value"}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

FormSelect.displayName = 'FormSelect';

export { FormSelect };