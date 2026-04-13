"use client";

import React from "react";
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const iconMap = {
  info: InfoIcon,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colorMap = {
  info: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", icon: "text-sky-600" },
  success: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", icon: "text-emerald-600" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "text-amber-600" },
  error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: "text-red-600" },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({
    variant = "info",
    title,
    dismissible = false,
    onDismiss,
    className = "",
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const Icon = iconMap[variant];
    const colors = colorMap[variant];

    if (!isVisible) return null;

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        className={`
          border rounded-lg p-4 flex gap-3
          ${colors.bg} ${colors.border} ${colors.text}
          ${className}
        `}
        {...props}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-lg opacity-50 hover:opacity-75"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";
