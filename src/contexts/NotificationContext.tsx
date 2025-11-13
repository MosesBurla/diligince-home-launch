
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { BaseNotification } from '@/types/shared';

interface NotificationContextType {
  showSuccess: (message: string, options?: Partial<BaseNotification>) => void;
  showError: (message: string, options?: Partial<BaseNotification>) => void;
  showWarning: (message: string, options?: Partial<BaseNotification>) => void;
  showInfo: (message: string, options?: Partial<BaseNotification>) => void;
  showLoading: (message: string) => string | number;
  dismiss: (toastId: string | number) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notifications = useNotifications();

  const showSuccess = (message: string, options?: Partial<BaseNotification>) => {
    notifications.showSuccess(message, {
      duration: options?.duration,
      description: options?.message,
    });
  };

  const showError = (message: string, options?: Partial<BaseNotification>) => {
    notifications.showError(message, {
      duration: options?.duration,
      description: options?.message,
    });
  };

  const showWarning = (message: string, options?: Partial<BaseNotification>) => {
    notifications.showWarning(message, {
      duration: options?.duration,
      description: options?.message,
    });
  };

  const showInfo = (message: string, options?: Partial<BaseNotification>) => {
    notifications.showInfo(message, {
      duration: options?.duration,
      description: options?.message,
    });
  };

  const value: NotificationContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading: notifications.showLoading,
    dismiss: notifications.dismiss,
    dismissAll: notifications.dismissAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
