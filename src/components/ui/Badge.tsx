"use client";

import React from "react";
import type { AppointmentStatus } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "danger" | "warning" | "info";
  size?: "sm" | "md";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    variant = "default",
    size = "md",
    className = "",
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      default: "bg-slate-100 text-slate-700",
      primary: "bg-blue-100 text-blue-700",
      success: "bg-emerald-100 text-emerald-700",
      danger: "bg-red-100 text-red-700",
      warning: "bg-amber-100 text-amber-700",
      info: "bg-sky-100 text-sky-700",
    };

    const sizeClasses = {
      sm: "px-2 py-1 text-xs font-medium rounded",
      md: "px-3 py-1.5 text-sm font-semibold rounded-md",
    };

    return (
      <span
        ref={ref}
        className={`inline-block ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export function StatusBadge({
  status,
  ...props
}: {
  status: AppointmentStatus;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const statusConfig = {
    scheduled: { label: "Agendado", variant: "primary" as const },
    confirmed: { label: "Confirmado", variant: "success" as const },
    canceled: { label: "Cancelado", variant: "danger" as const },
    completed: { label: "Concluído", variant: "success" as const },
    no_show: { label: "Não compareceu", variant: "warning" as const },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  );
}
