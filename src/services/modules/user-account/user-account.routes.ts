import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/auth/user`;

export const userAccountRoutes = {
  profile: `${BASE_PATH}/profile`,
  notifications: `${BASE_PATH}/notifications`,
  changePassword: `${BASE_PATH}/security/password`,
  twoFactorAuth: `${BASE_PATH}/security/2fa`,
  twoFactorStatus: `${BASE_PATH}/security/2fa/status`,
  recoveryCodes: `${BASE_PATH}/security/recovery-codes`,
  activeSessions: `${BASE_PATH}/security/sessions`,
  revokeSession: (sessionId: string) => `${BASE_PATH}/security/sessions/${sessionId}`,
};
