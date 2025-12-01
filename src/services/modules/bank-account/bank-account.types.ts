export interface BankAccount {
  id?: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'savings' | 'current';
  upiId?: string;
  upiQrCodeUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  isLocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFSCDetails {
  bank: string;
  ifsc: string;
  branch: string;
  address: string;
  city: string;
  district: string;
  state: string;
}

export interface BankAccountResponse {
  success: boolean;
  data: BankAccount;
  message: string;
}

export interface VerificationResponse {
  success: boolean;
  data: {
    status: 'pending' | 'verified' | 'rejected';
    verificationId: string;
    message: string;
  };
}
