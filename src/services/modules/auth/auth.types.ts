// Auth module types

// ========== Account Lookup Types ==========
export interface LookupAccountsRequest {
  email: string;
}

export interface AvailableAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'industry' | 'professional' | 'vendor';
  role: string;
  companyName?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface LookupAccountsResponse {
  success: boolean;
  data: {
    accounts: AvailableAccount[];
  };
  message: string;
}

// ========== Login Types ==========
export interface LoginRequest {
  accountId: string;
  email: string;
  userType: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    twoFactorRequired: boolean;
    twoFactorToken?: string;
    twoFactorMethod?: 'app' | 'sms';
    expiresAt?: string;
    user?: User;
    access_token?: string;
    refresh_token?: string;
  };
  message: string;
}

// ========== 2FA Types ==========
export interface Verify2FARequest {
  twoFactorToken: string;
  code: string;
}

export interface Verify2FAResponse {
  success: boolean;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
  message: string;
  attemptsRemaining?: number;
}

export interface Resend2FARequest {
  twoFactorToken: string;
}

export interface Resend2FAResponse {
  success: boolean;
  data: {
    expiresAt: string;
    resendCooldown: number;
  };
  message: string;
  cooldownRemaining?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  companyName?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyName?: string;
}
