import React from 'react';

export interface FormSelectProps<T = string> {
  name: string;
  label: string;
  options: { value: T; label: string }[];
  value?: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (value: T) => void;
  onBlur?: () => void;
}

export const FormSelect = React.forwardRef<
  HTMLSelectElement,
  FormSelectProps
>(({
  name,
  label,
  options,
  value = '',
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  onChange,
  onBlur,
}: FormSelectProps, ref) => {
  const id = `select-${name}`;
  const hasError = !!error;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`
          w-full px-3 py-2 border rounded-lg font-medium
          bg-white transition-colors duration-200 appearance-none cursor-pointer
          ${hasError
            ? 'border-red-500 text-red-900 focus:ring-2 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : ''
          }
          focus:outline-none
        `}
      >
        {placeholder && (
          <option value="" disabled defaultValue="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
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
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
