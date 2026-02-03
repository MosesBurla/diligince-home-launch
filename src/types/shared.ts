
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  mode: 'light' | 'dark';
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  neutral: string;
}

// User Types
export type UserRole = 'industry' | 'professional' | 'vendor';
export type VendorCategory = 'service' | 'product' | 'logistics';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  language: string;
  timezone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  userType?: 'Vendor' | 'Industry' | 'Professional';
  userSubType?: 'ServiceVendor' | 'ProductVendor' | 'LogisticVendor';
  initials?: string;
  profile?: any;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

// UI Component Types
export interface BaseMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  read: boolean;
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface BaseModal {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface BaseNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// Helper to map userSubType to vendor category
export const mapUserSubTypeToVendorCategory = (
  userSubType?: string
): VendorCategory | undefined => {
  if (!userSubType) return undefined;

  if (userSubType === 'ServiceVendor') return 'service';
  if (userSubType === 'ProductVendor') return 'product';
  if (userSubType === 'LogisticVendor') return 'logistics';

  return undefined;
};

// Dashboard routing utility
export const getDashboardRoute = (user: UserProfile): string => {
  switch (user.role) {
    case 'industry':
      return '/dashboard/industry';
    case 'professional':
      return '/dashboard/professional';
    case 'vendor':
      // Prefer userSubType, fallback to profile.vendorCategory
      const vendorCategory = user.userSubType
        ? mapUserSubTypeToVendorCategory(user.userSubType)
        : user.profile?.vendorCategory;

      if (vendorCategory === 'service') return '/dashboard/service-vendor';
      if (vendorCategory === 'product') return '/dashboard/product-vendor';
      if (vendorCategory === 'logistics') return '/dashboard/logistics-vendor';
      return '/dashboard';
    default:
      return '/login';
  }
};

// Settings routing utility based on role
export const getSettingsRoute = (role: UserRole | string): string => {
  switch (role) {
    case 'industry':
      return '/dashboard/industry-settings';
    case 'vendor':
      return '/vendor-settings';
    case 'professional':
      return '/professional-settings';
    default:
      return '/dashboard/industry-settings';
  }
};
