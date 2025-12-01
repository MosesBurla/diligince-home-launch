export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  channels: {
    requirements: boolean;
    approvals: boolean;
    payments: boolean;
    messages: boolean;
    systemAlerts: boolean;
  };
  digestFrequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TwoFactorAuthRequest {
  enabled: boolean;
  code?: string;
}

export interface TwoFactorAuthStatus {
  enabled: boolean;
  method?: 'app' | 'sms';
}

export interface RecoveryCodes {
  codes: string[];
  generatedAt: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
