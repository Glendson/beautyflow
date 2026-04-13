import React from 'react';

export interface FormCheckboxProps {
  name: string;
  label: string;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  helperText?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  checked = false,
  required = false,
  disabled = false,
  error,
  onChange,
  onBlur,
  helperText,
}) => {
  const id = `checkbox-${name}`;
  const hasError = !!error;

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`
            w-4 h-4 rounded border transition-colors duration-200
            ${hasError
              ? 'border-red-500 bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500'
            }
            ${disabled
              ? 'bg-gray-100 cursor-not-allowed'
              : 'cursor-pointer'
            }
            focus:ring-offset-0 focus:outline-none
          `}
        />
        <label
          htmlFor={id}
          className={`
            ml-2 text-sm font-medium
            ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 ml-6">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500 ml-6">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormCheckbox;
