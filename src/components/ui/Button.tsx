"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = "",
    disabled,
    ...props
  }, ref) => {
    const baseClasses =
      "font-semibold rounded-lg transition-colors duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary: "bg-blue-900 text-white hover:bg-blue-800",
      secondary: "bg-white border-2 border-blue-900 text-blue-900 hover:bg-blue-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-emerald-600 text-white hover:bg-emerald-700",
      outline: "border-2 border-slate-300 text-slate-900 hover:bg-slate-50",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {leftIcon && !isLoading && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
