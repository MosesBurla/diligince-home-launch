import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/industry/bank-account`;

export const bankAccountRoutes = {
  getAccount: BASE_PATH,
  saveAccount: BASE_PATH,
  verify: `${BASE_PATH}/verify`,
  unlock: `${BASE_PATH}/unlock`,
  ifscLookup: (code: string) => `${BASE_PATH}/ifsc/${code}`,
};
