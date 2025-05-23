'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({ checked = false, onCheckedChange, className, disabled = false }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'h-4 w-4 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'flex items-center justify-center',
        checked && 'bg-blue-600 border-blue-600',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
}
