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
  name?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  minDate?: Date;
}

const FormDatePicker = ({
  name,
  label,
  placeholder = "Select a date",
  helperText,
  className,
  disabled = false,
  value,
  onChange,
  minDate,
}: FormDatePickerProps) => {
  // Check if we're in a form context and name is provided
  const formContext = name ? useFormContext() : null;
  
  // If we're using direct props (not in a form context)
  if (!name || !formContext) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground',
                className
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, 'PPP') : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              disabled={disabled}
              initialFocus
              fromDate={minDate}
            />
          </PopoverContent>
        </Popover>
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }

  // If we're using it with react-hook-form
  const { control, formState } = formContext;
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
                fromDate={minDate}
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
