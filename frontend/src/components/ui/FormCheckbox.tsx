"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface FormCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  helperText?: string;
  error?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormCheckbox({
  className,
  label,
  helperText,
  error,
  checked,
  onChange,
  ...props
}: FormCheckboxProps) {
  // Create a hidden input to simulate a standard HTML checkbox for event handling
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleChange = () => {
    if (inputRef.current && onChange) {
      // Create a synthetic event that mimics a change event
      const event = {
        target: {
          name: props.name,
          checked: !checked,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(event);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <CheckboxPrimitive.Root
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            checked && "bg-primary text-primary-foreground",
            className
          )}
          checked={checked}
          onCheckedChange={handleChange}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center")}>
            <Check className="h-3 w-3 text-white" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        
        {/* Hidden input to handle traditional form submissions */}
        <input
          ref={inputRef}
          type="checkbox"
          className="hidden"
          name={props.name}
          checked={checked}
          onChange={() => {}}
        />
        
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
      
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
