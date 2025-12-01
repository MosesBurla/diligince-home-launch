import api from '../../core/api.service';
import { userAccountRoutes } from './user-account.routes';
import {
  UserProfile,
  NotificationPreferences,
  ChangePasswordRequest,
  TwoFactorAuthRequest,
  TwoFactorAuthStatus,
  RecoveryCodes,
  ActiveSession,
  ApiResponse,
} from './user-account.types';

class UserAccountService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>(userAccountRoutes.profile);
    return response.data;
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<ApiResponse<NotificationPreferences>>(userAccountRoutes.notifications);
    return response.data;
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await api.patch<ApiResponse<NotificationPreferences>, Partial<NotificationPreferences>>(
      userAccountRoutes.notifications, preferences
    );
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.patch<ApiResponse<void>, ChangePasswordRequest>(userAccountRoutes.changePassword, data);
  }

  async toggle2FA(data: TwoFactorAuthRequest): Promise<TwoFactorAuthStatus> {
    const response = await api.patch<ApiResponse<TwoFactorAuthStatus>, TwoFactorAuthRequest>(
      userAccountRoutes.twoFactorAuth, data
    );
    return response.data;
  }

  async get2FAStatus(): Promise<TwoFactorAuthStatus> {
    const response = await api.get<ApiResponse<TwoFactorAuthStatus>>(userAccountRoutes.twoFactorStatus);
    return response.data;
  }

  async generateRecoveryCodes(): Promise<RecoveryCodes> {
    const response = await api.post<ApiResponse<RecoveryCodes>, {}>(userAccountRoutes.recoveryCodes, {});
    return response.data;
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    const response = await api.get<ApiResponse<ActiveSession[]>>(userAccountRoutes.activeSessions);
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await api.remove<ApiResponse<void>>(userAccountRoutes.revokeSession(sessionId));
  }
}

export const userAccountService = new UserAccountService();
