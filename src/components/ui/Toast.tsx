'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  autoClose?: boolean;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastType, autoClose?: boolean) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType, autoClose = true) => {
      const id = Date.now().toString();
      const toast: ToastMessage = { id, message, type, autoClose };
      setToasts((prev) => [...prev, toast]);

      if (autoClose) {
        setTimeout(() => removeToast(id), 3000);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: () => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  useEffect(() => {
    if (toast.autoClose) {
      const timer = setTimeout(onRemove, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.autoClose, onRemove]);

  const bgColorMap: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const iconMap: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`${bgColorMap[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] animate-fade-in`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">{iconMap[toast.type]}</span>
        <span>{toast.message}</span>
      </div>
      {toast.autoClose && (
        <button
          onClick={onRemove}
          className="text-white/80 hover:text-white ml-2 flex-shrink-0"
          aria-label="Close toast"
        >
          ✕
        </button>
      )}
    </div>
  );
};
