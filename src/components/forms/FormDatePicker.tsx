import React from 'react';

export interface FormDatePickerProps {
  name: string;
  label: string;
  value?: string | Date;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date) => void;
  onBlur?: () => void;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  value = '',
  required = false,
  disabled = false,
  error,
  helperText,
  minDate,
  maxDate,
  onChange,
  onBlur,
}) => {
  const id = `datepicker-${name}`;
  const hasError = !!error;

  // Converter Date para string no formato YYYY-MM-DD
  const formatDateToInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type="date"
        value={formatDateToInput(value)}
        onChange={(e) => {
          if (e.target.value) {
            onChange?.(new Date(e.target.value + 'T00:00:00'));
          }
        }}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        min={minDate ? formatDateToInput(minDate) : undefined}
        max={maxDate ? formatDateToInput(maxDate) : undefined}
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

export default FormDatePicker;
