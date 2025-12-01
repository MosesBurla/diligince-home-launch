import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Loader2, Upload } from 'lucide-react';
import toast from '@/utils/toast.utils';
import { BankAccount } from './PaymentSettingsTab';

interface BankAccountFormProps {
  bankAccount: BankAccount | null;
  onSave: (data: BankAccount) => Promise<void>;
  isLocked: boolean;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ bankAccount, onSave, isLocked }) => {
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    accountNumberConfirm: '',
    ifscCode: '',
    branchName: '',
    accountType: 'current',
    upiId: '',
    upiQrCodeUrl: '',
    verificationStatus: 'pending',
    isLocked: false
  });
  const [isFetchingIFSC, setIsFetchingIFSC] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (bankAccount) {
      setFormData(bankAccount);
    }
  }, [bankAccount]);

  const handleChange = (field: keyof BankAccount, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchBankDetailsByIFSC = async (ifscCode: string) => {
    if (ifscCode.length !== 11) return;

    setIsFetchingIFSC(true);
    try {
      // TODO: API integration - Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock bank details
      const mockBankDetails = {
        bankName: 'State Bank of India',
        branchName: 'Andheri East Branch'
      };

      setFormData(prev => ({
        ...prev,
        bankName: mockBankDetails.bankName,
        branchName: mockBankDetails.branchName
      }));

      toast.success('Bank details fetched successfully');
    } catch (error) {
      toast.error('Invalid IFSC code or bank details not found');
    } finally {
      setIsFetchingIFSC(false);
    }
  };

  const handleIFSCChange = (value: string) => {
    const upperValue = value.toUpperCase();
    handleChange('ifscCode', upperValue);
    
    if (upperValue.length === 11) {
      fetchBankDetailsByIFSC(upperValue);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.bankName?.trim()) {
      toast.error('Bank name is required');
      return false;
    }
    if (!formData.accountHolderName?.trim()) {
      toast.error('Account holder name is required');
      return false;
    }
    if (!formData.accountNumber?.trim()) {
      toast.error('Account number is required');
      return false;
    }
    if (formData.accountNumber !== formData.accountNumberConfirm) {
      toast.error('Account numbers do not match');
      return false;
    }
    if (!formData.ifscCode?.trim() || formData.ifscCode.length !== 11) {
      toast.error('Valid IFSC code is required (11 characters)');
      return false;
    }
    if (!formData.branchName?.trim()) {
      toast.error('Branch name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave(formData as BankAccount);
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  const getFieldStatus = (fieldValue: any) => {
    if (!fieldValue || String(fieldValue).trim() === '') return 'empty';
    return 'filled';
  };

  const getFieldClassName = (status: string) => {
    if (isLocked) return 'bg-muted';
    if (status === 'empty') return 'border-red-300 focus:border-red-500';
    if (status === 'filled') return 'border-green-300 focus:border-green-500';
    return '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bank Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Banking Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IFSC Code - First for auto-fetch */}
          <div className="space-y-2">
            <Label htmlFor="ifscCode" className="flex items-center gap-2">
              IFSC Code <span className="text-red-500">*</span>
              {isFetchingIFSC && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              {getFieldStatus(formData.ifscCode) === 'filled' && !isFetchingIFSC && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </Label>
            <Input
              id="ifscCode"
              value={formData.ifscCode || ''}
              onChange={(e) => handleIFSCChange(e.target.value)}
              placeholder="e.g., SBIN0001234"
              maxLength={11}
              className={getFieldClassName(getFieldStatus(formData.ifscCode))}
              disabled={isLocked}
            />
            <p className="text-xs text-muted-foreground">
              Enter IFSC code to auto-fetch bank details
            </p>
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName" className="flex items-center gap-2">
              Bank Name <span className="text-red-500">*</span>
              {getFieldStatus(formData.bankName) === 'filled' && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </Label>
            <Input
              id="bankName"
              value={formData.bankName || ''}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="Enter bank name"
              className={getFieldClassName(getFieldStatus(formData.bankName))}
              disabled={isLocked}
            />
          </div>

          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="accountHolderName" className="flex items-center gap-2">
              Account Holder Name <span className="text-red-500">*</span>
              {getFieldStatus(formData.accountHolderName) === 'filled' && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </Label>
            <Input
              id="accountHolderName"
              value={formData.accountHolderName || ''}
              onChange={(e) => handleChange('accountHolderName', e.target.value)}
              placeholder="As per bank records"
              className={getFieldClassName(getFieldStatus(formData.accountHolderName))}
              disabled={isLocked}
            />
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="accountType" className="flex items-center gap-2">
              Account Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.accountType || 'current'}
              onValueChange={(value) => handleChange('accountType', value)}
              disabled={isLocked}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="current">Current Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="flex items-center gap-2">
              Account Number <span className="text-red-500">*</span>
              {getFieldStatus(formData.accountNumber) === 'filled' && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </Label>
            <Input
              id="accountNumber"
              type="text"
              value={formData.accountNumber || ''}
              onChange={(e) => handleChange('accountNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              className={getFieldClassName(getFieldStatus(formData.accountNumber))}
              disabled={isLocked}
            />
          </div>

          {/* Confirm Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumberConfirm" className="flex items-center gap-2">
              Confirm Account Number <span className="text-red-500">*</span>
              {formData.accountNumber && 
               formData.accountNumberConfirm && 
               formData.accountNumber === formData.accountNumberConfirm ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : formData.accountNumberConfirm && formData.accountNumber !== formData.accountNumberConfirm ? (
                <XCircle className="w-4 h-4 text-red-600" />
              ) : null}
            </Label>
            <Input
              id="accountNumberConfirm"
              type="text"
              value={formData.accountNumberConfirm || ''}
              onChange={(e) => handleChange('accountNumberConfirm', e.target.value.replace(/\D/g, ''))}
              placeholder="Re-enter account number"
              className={
                formData.accountNumberConfirm && formData.accountNumber !== formData.accountNumberConfirm
                  ? 'border-red-300 focus:border-red-500'
                  : getFieldClassName(getFieldStatus(formData.accountNumberConfirm))
              }
              disabled={isLocked}
            />
            {formData.accountNumberConfirm && 
             formData.accountNumber !== formData.accountNumberConfirm && (
              <p className="text-xs text-red-600">Account numbers do not match</p>
            )}
          </div>

          {/* Branch Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="branchName" className="flex items-center gap-2">
              Branch Name <span className="text-red-500">*</span>
              {getFieldStatus(formData.branchName) === 'filled' && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </Label>
            <Input
              id="branchName"
              value={formData.branchName || ''}
              onChange={(e) => handleChange('branchName', e.target.value)}
              placeholder="Branch name"
              className={getFieldClassName(getFieldStatus(formData.branchName))}
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* UPI Details (Optional) */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-foreground">UPI Details (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              value={formData.upiId || ''}
              onChange={(e) => handleChange('upiId', e.target.value)}
              placeholder="yourcompany@bank"
              disabled={isLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upiQrCode">UPI QR Code</Label>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              disabled={isLocked}
            >
              <Upload size={16} className="mr-2" />
              Upload QR Code
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isLocked && (
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(bankAccount || {})}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? 'Saving...' : 'Save Details'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default BankAccountForm;
