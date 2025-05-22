import { forwardRef, InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      hint,
      id,
      name,
      className = '',
      containerClassName = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex items-start ${containerClassName}`}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={id || name}
            name={name}
            type="checkbox"
            disabled={disabled}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 
                      ${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
                      ${error ? 'border-red-300' : ''}
                      ${className}`}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={id || name}
              className={`font-medium ${disabled ? 'text-gray-400' : error ? 'text-red-700' : 'text-gray-700'}`}
            >
              {label}
            </label>
          )}
          {(error || hint) && (
            <p className={`mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
              {error || hint}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
