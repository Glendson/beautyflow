import React from 'react';

export interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel' | 'date' | 'time';
  placeholder?: string;
  value?: string | number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  value = '',
  required = false,
  disabled = false,
  error,
  helperText,
  onChange,
  onBlur,
  autoComplete,
  min,
  max,
  step,
}) => {
  const id = `input-${name}`;
  const hasError = !!error;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        min={min}
        step={step}
        max={max}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`
          w-full px-3 py-2 border rounded-lg font-medium
          transition-colors duration-200
          ${hasError
            ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : ''
          }
          focus:outline-none
        `}
      />
      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
