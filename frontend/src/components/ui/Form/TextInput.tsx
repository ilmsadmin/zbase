import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  containerClassName?: string;
  showErrorIcon?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      hint,
      id,
      name,
      leftIcon,
      rightIcon,
      size = 'md',
      className = '',
      containerClassName = '',
      fullWidth = false,
      disabled = false,
      showErrorIcon = true,
      ...props
    },
    ref
  ) => {
    const inputSizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-2.5 text-base'
    };
    
    const leftIconClasses = {
      sm: 'pl-8',
      md: 'pl-10',
      lg: 'pl-12'
    };
    
    const rightIconClasses = {
      sm: 'pr-8',
      md: 'pr-10',
      lg: 'pr-12'
    };
    
    const getInputClasses = () => {
      let classes = `block rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 ${inputSizeClasses[size]}`;
                    
      if (leftIcon) classes += ` ${leftIconClasses[size]}`;
      if (rightIcon || (error && showErrorIcon)) classes += ` ${rightIconClasses[size]}`;
      if (disabled) classes += ' bg-gray-100 text-gray-500 cursor-not-allowed';
      if (fullWidth) classes += ' w-full';
      if (error) classes += ' border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500';
      
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
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`${error ? 'text-red-500' : 'text-gray-500'}`}>
                {leftIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            id={id || name}
            name={name}
            disabled={disabled}
            className={`${getInputClasses()} ${className}`}
            {...props}
          />
          {(rightIcon || (error && showErrorIcon)) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {error && showErrorIcon ? (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              ) : (
                rightIcon
              )}
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

TextInput.displayName = 'TextInput';

export default TextInput;
