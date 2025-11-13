import { useCallback } from 'react';
import toast from '@/utils/toast.utils';

interface NotificationOptions {
  duration?: number;
  description?: string;
}

interface UseNotificationsReturn {
  showSuccess: (message: string, options?: NotificationOptions) => void;
  showError: (message: string, options?: NotificationOptions) => void;
  showWarning: (message: string, options?: NotificationOptions) => void;
  showInfo: (message: string, options?: NotificationOptions) => void;
  showLoading: (message: string) => string | number;
  dismiss: (toastId: string | number) => void;
  dismissAll: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const showSuccess = useCallback((message: string, options?: NotificationOptions) => {
    toast.success(message, options);
  }, []);

  const showError = useCallback((message: string, options?: NotificationOptions) => {
    toast.error(message, options);
  }, []);

  const showWarning = useCallback((message: string, options?: NotificationOptions) => {
    toast.warning(message, options);
  }, []);

  const showInfo = useCallback((message: string, options?: NotificationOptions) => {
    toast.info(message, options);
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((toastId: string | number) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismissAll();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
};
