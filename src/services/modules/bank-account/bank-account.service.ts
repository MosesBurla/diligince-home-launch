import api from '../../core/api.service';
import { bankAccountRoutes } from './bank-account.routes';
import {
  BankAccount,
  BankAccountResponse,
  VerificationResponse,
  IFSCDetails,
} from './bank-account.types';

class BankAccountService {
  /**
   * Get company's bank account details
   */
  async getAccount(): Promise<BankAccount> {
    const response = await api.get<BankAccountResponse>(bankAccountRoutes.getAccount);
    return response.data;
  }

  /**
   * Save or update bank account details
   */
  async saveAccount(data: Partial<BankAccount>): Promise<BankAccount> {
    const response = await api.post<BankAccountResponse, Partial<BankAccount>>(
      bankAccountRoutes.saveAccount,
      data
    );
    return response.data;
  }

  async verifyAccount(): Promise<VerificationResponse['data']> {
    const response = await api.post<VerificationResponse, {}>(
      bankAccountRoutes.verify,
      {}
    );
    return response.data;
  }

  async unlockAccount(): Promise<BankAccount> {
    const response = await api.post<BankAccountResponse, {}>(
      bankAccountRoutes.unlock,
      {}
    );
    return response.data;
  }

  async getBankByIFSC(ifscCode: string): Promise<IFSCDetails> {
    const response = await api.get<{ success: boolean; data: IFSCDetails }>(
      bankAccountRoutes.ifscLookup(ifscCode)
    );
    return response.data;
  }
}

export const bankAccountService = new BankAccountService();
