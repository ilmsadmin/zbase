"use client";

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

const FormDatePicker = ({
  name,
  label,
  placeholder = "Select a date",
  helperText,
  className,
  disabled = false,
}: FormDatePickerProps) => {
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
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground',
                  error && 'border-red-500',
                  className
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(new Date(field.value), 'PPP') : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date)}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
};

export { FormDatePicker };
