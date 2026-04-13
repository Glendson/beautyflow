"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    required,
    icon,
    className = "",
    disabled,
    ...props
  }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 border rounded-lg transition-colors
              ${icon ? "pl-10" : ""}
              ${error
                ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                : "border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }
              ${disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {helperText && <p className="text-sm text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
