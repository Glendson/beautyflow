import React from 'react';

export interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  maxLength?: number;
  rows?: number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  label,
  placeholder,
  value = '',
  required = false,
  disabled = false,
  error,
  helperText,
  maxLength,
  rows = 4,
  onChange,
  onBlur,
}) => {
  const id = `textarea-${name}`;
  const hasError = !!error;
  const charCount = String(value).length;
  const charWarning = maxLength && charCount > maxLength * 0.8;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`
          w-full px-3 py-2 border rounded-lg font-medium resize-vertical
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
      <div className="flex justify-between items-start mt-1">
        <div>
          {hasError && (
            <p id={`${id}-error`} className="text-sm text-red-600">
              {error}
            </p>
          )}
          {helperText && !hasError && (
            <p id={`${id}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
        {maxLength && (
          <p className={`text-xs font-medium ${charWarning ? 'text-yellow-600' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormTextarea;
