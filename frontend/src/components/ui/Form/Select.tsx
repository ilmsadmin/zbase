import { forwardRef, ReactNode, SelectHTMLAttributes } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  containerClassName?: string;
  emptyOption?: string;
  showErrorIcon?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      id,
      name,
      icon,
      size = 'md',
      className = '',
      containerClassName = '',
      fullWidth = false,
      disabled = false,
      emptyOption,
      showErrorIcon = true,
      ...props
    },
    ref
  ) => {
    const selectSizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-2.5 text-base'
    };
    
    const iconClasses = {
      sm: 'pl-8',
      md: 'pl-10',
      lg: 'pl-12'
    };
    
    const getSelectClasses = () => {
      let classes = `block rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 ${selectSizeClasses[size]}`;
                    
      if (icon) classes += ` ${iconClasses[size]}`;
      if (disabled) classes += ' bg-gray-100 text-gray-500 cursor-not-allowed';
      if (fullWidth) classes += ' w-full';
      if (error) classes += ' border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500';
      
      return classes;
    };
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id || name}
            className={`block text-sm font-medium ${disabled ? 'text-gray-400' : error ? 'text-red-700' : 'text-gray-700'} mb-1`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`${error ? 'text-red-500' : 'text-gray-500'}`}>
                {icon}
              </span>
            </div>
          )}
          <select
            ref={ref}
            id={id || name}
            name={name}
            disabled={disabled}
            className={`${getSelectClasses()} ${className}`}
            {...props}
          >
            {emptyOption !== undefined && (
              <option value="">{emptyOption}</option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {error && showErrorIcon && (
            <div className="absolute inset-y-0 right-8 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
