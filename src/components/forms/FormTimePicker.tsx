import React from 'react';

export interface FormTimePickerProps {
  name: string;
  label: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (time: string) => void;
  onBlur?: () => void;
}

export const FormTimePicker: React.FC<FormTimePickerProps> = ({
  name,
  label,
  value = '',
  required = false,
  disabled = false,
  error,
  helperText,
  onChange,
  onBlur,
}) => {
  const id = `timepicker-${name}`;
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
        type="time"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`
          w-full px-3 py-2 border rounded-lg font-medium
          transition-colors duration-200
          ${hasError
            ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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

export default FormTimePicker;
