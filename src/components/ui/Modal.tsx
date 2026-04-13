"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    open,
    onClose,
    title,
    footer,
    size = "md",
    closeOnEscape = true,
    closeOnOutsideClick = true,
    className = "",
    children,
    ...props
  }, ref) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === "Escape" && open) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [open, closeOnEscape, onClose]);

    if (!open) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOutsideClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
        role="presentation"
      >
        <div
          ref={ref}
          className={`bg-white rounded-lg shadow-xl ${sizeMap[size]} w-full mx-4 ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          {...props}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";
