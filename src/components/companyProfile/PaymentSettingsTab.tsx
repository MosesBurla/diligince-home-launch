import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Lock, AlertCircle } from 'lucide-react';
import BankAccountForm from './BankAccountForm';
import BankVerificationStatus from './BankVerificationStatus';
import toast from '@/utils/toast.utils';

export interface BankAccount {
  id?: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountNumberConfirm: string;
  ifscCode: string;
  branchName: string;
  accountType: 'savings' | 'current';
  upiId?: string;
  upiQrCodeUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  isLocked: boolean;
}

const PaymentSettingsTab = () => {
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    try {
      setIsLoading(true);
      // TODO: API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for development
      setBankAccount(null); // Start with no account
    } catch (error) {
      console.error('Error fetching bank account:', error);
      toast.error('Failed to load bank account details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!bankAccount) return;

    setIsUnlocking(true);
    const loadingToast = toast.loading('Unlocking account...');

    try {
      // TODO: API integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBankAccount(prev => prev ? { ...prev, isLocked: false, verificationStatus: 'pending' } : null);
      toast.dismiss(loadingToast);
      toast.success('Account unlocked. You can now edit details.');
      toast.info('Re-verification required', {
        description: 'Please update your details and re-verify your account.',
        duration: 5000
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to unlock account');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSaveBankAccount = async (data: BankAccount) => {
    const loadingToast = toast.loading('Saving bank account...');

    try {
      // TODO: API integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBankAccount(data);
      toast.dismiss(loadingToast);
      toast.success('Bank account details saved successfully');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save bank account details');
      throw error;
    }
  };

  const handleVerify = async () => {
    if (!bankAccount) return;

    const loadingToast = toast.loading('Submitting for verification...');

    try {
      // TODO: API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBankAccount(prev => prev ? { 
        ...prev, 
        verificationStatus: 'verified',
        verifiedAt: new Date().toISOString(),
        isLocked: true 
      } : null);
      
      toast.dismiss(loadingToast);
      toast.success('Bank account verified successfully', {
        description: 'Your account has been locked for security.'
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Verification failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading payment settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lock Warning */}
      {bankAccount?.isLocked && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">
                  Account Locked
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                  Your bank account details are locked after verification. Click "Unlock to Edit" if you need to make changes.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className="mt-3"
                >
                  {isUnlocking ? 'Unlocking...' : 'Unlock to Edit'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Status */}
      {bankAccount && (
        <BankVerificationStatus 
          status={bankAccount.verificationStatus}
          verifiedAt={bankAccount.verifiedAt}
          onVerify={handleVerify}
          isLocked={bankAccount.isLocked}
        />
      )}

      {/* Bank Account Form */}
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="text-primary" size={24} />
            Bank Account Details
          </CardTitle>
          <CardDescription>
            Add your company's bank account for payment processing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <BankAccountForm
            bankAccount={bankAccount}
            onSave={handleSaveBankAccount}
            isLocked={bankAccount?.isLocked || false}
          />
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">Security Information</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
                <li>All bank details are encrypted and stored securely</li>
                <li>Your account will be locked after successful verification</li>
                <li>Re-verification is required after unlocking and editing</li>
                <li>Contact support for any security concerns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettingsTab;
