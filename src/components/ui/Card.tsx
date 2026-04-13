"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    elevation = "md",
    padding = "md",
    className = "",
    children,
    ...props
  }, ref) => {
    const elevationClasses = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    };

    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl border border-slate-200
          ${elevationClasses[elevation]}
          ${paddingClasses[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
