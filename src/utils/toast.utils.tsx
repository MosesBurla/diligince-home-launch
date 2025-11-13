import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  icon?: React.ReactNode;
}

class ToastService {
  /**
   * Show success toast (Green)
   */
  success(message: string, options?: ToastOptions) {
    return sonnerToast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: options?.icon || <CheckCircle2 className="h-5 w-5" />,
      dismissible: options?.dismissible !== false,
    });
  }

  /**
   * Show error toast (Red)
   */
  error(message: string, options?: ToastOptions) {
    return sonnerToast.error(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action,
      icon: options?.icon || <AlertCircle className="h-5 w-5" />,
      dismissible: options?.dismissible !== false,
    });
  }

  /**
   * Show warning toast (Amber/Yellow)
   */
  warning(message: string, options?: ToastOptions) {
    return sonnerToast.warning(message, {
      duration: options?.duration || 4500,
      description: options?.description,
      action: options?.action,
      icon: options?.icon || <AlertTriangle className="h-5 w-5" />,
      dismissible: options?.dismissible !== false,
    });
  }

  /**
   * Show info toast (Blue)
   */
  info(message: string, options?: ToastOptions) {
    return sonnerToast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: options?.icon || <Info className="h-5 w-5" />,
      dismissible: options?.dismissible !== false,
    });
  }

  /**
   * Show loading toast
   */
  loading(message: string, options?: { description?: string }) {
    return sonnerToast.loading(message, {
      description: options?.description,
    });
  }

  /**
   * Dismiss specific toast
   */
  dismiss(toastId: string | number) {
    sonnerToast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    sonnerToast.dismiss();
  }

  /**
   * Promise toast (for async operations)
   */
  promise<T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) {
    return sonnerToast.promise(promise, options);
  }
}

export const toast = new ToastService();
export default toast;
