import { api } from '@/services/api.service';
import { authRoutes } from './auth.routes';
import type {
  LookupAccountsRequest,
  LookupAccountsResponse,
  LoginRequest,
  LoginResponse,
  Verify2FARequest,
  Verify2FAResponse,
  Resend2FARequest,
  Resend2FAResponse
} from './auth.types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Lookup accounts associated with an email address
   */
  lookupAccounts: async (email: string): Promise<LookupAccountsResponse> => {
    const response = await api.post<LookupAccountsResponse>(
      authRoutes.lookupAccounts,
      { email } as LookupAccountsRequest
    );
    return response.data;
  },

  /**
   * Login with account selection and credentials
   */
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      authRoutes.login,
      request
    );
    return response.data;
  },

  /**
   * Verify 2FA OTP code
   */
  verify2FA: async (request: Verify2FARequest): Promise<Verify2FAResponse> => {
    const response = await api.post<Verify2FAResponse>(
      authRoutes.verify2FA,
      request
    );
    return response.data;
  },

  /**
   * Resend 2FA OTP code
   */
  resend2FA: async (twoFactorToken: string): Promise<Resend2FAResponse> => {
    const response = await api.post<Resend2FAResponse>(
      authRoutes.resend2FA,
      { twoFactorToken } as Resend2FARequest
    );
    return response.data;
  },
};
