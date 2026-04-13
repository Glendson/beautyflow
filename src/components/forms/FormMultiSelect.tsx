import React from 'react';

export interface FormMultiSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  selectedValues?: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (values: string[]) => void;
  onBlur?: () => void;
}

export const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  options,
  selectedValues = [],
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  onChange,
  onBlur,
}) => {
  const id = `multiselect-${name}`;
  const hasError = !!error;

  const handleChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange?.(selectedValues.filter(v => v !== value));
    } else {
      onChange?.([...selectedValues, value]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`
          border rounded-lg p-3 bg-white max-h-48 overflow-y-auto
          transition-colors duration-200
          ${hasError
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'
          }
          ${disabled ? 'bg-gray-100' : ''}
        `}
        role="group"
        aria-label={label}
      >
        {options.length === 0 ? (
          <p className="text-gray-500 text-sm py-2">Nenhuma opção disponível</p>
        ) : (
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center py-1 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={onBlur}
                  disabled={disabled}
                  aria-invalid={hasError}
                  className={`
                    w-4 h-4 rounded border transition-colors duration-200
                    ${hasError
                      ? 'border-red-500 text-red-600 focus:ring-red-500'
                      : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                    }
                    ${disabled ? 'cursor-not-allowed' : ''}
                    focus:ring-2 focus:outline-none
                  `}
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedValues.map((value) => {
            const label = options.find(o => o.value === value)?.label || value;
            return (
              <span
                key={value}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {label}
                <button
                  onClick={() => handleChange(value)}
                  disabled={disabled}
                  className="ml-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  aria-label={`Remove ${label}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormMultiSelect;
