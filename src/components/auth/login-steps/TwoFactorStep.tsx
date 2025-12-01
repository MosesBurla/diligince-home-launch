import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AvailableAccount } from '@/services/modules/auth';

interface TwoFactorStepProps {
  selectedAccount: AvailableAccount;
  twoFactorMethod: 'app' | 'sms';
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
  resending: boolean;
  error: string;
  attemptsRemaining?: number;
  resendCooldown: number;
}

export const TwoFactorStep: React.FC<TwoFactorStepProps> = ({
  selectedAccount,
  twoFactorMethod,
  code,
  onCodeChange,
  onVerify,
  onResend,
  onBack,
  loading,
  resending,
  error,
  attemptsRemaining,
  resendCooldown,
}) => {
  const [countdown, setCountdown] = useState(resendCooldown);

  useEffect(() => {
    setCountdown(resendCooldown);
  }, [resendCooldown]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (code.length === 6) {
      onVerify();
    }
  }, [code]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleResend = async () => {
    if (countdown === 0) {
      await onResend();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
        disabled={loading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={selectedAccount.avatar} alt={selectedAccount.firstName} />
              <AvatarFallback className="text-2xl">
                {getInitials(selectedAccount.firstName, selectedAccount.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Two-Factor Authentication</h2>
        <p className="text-muted-foreground">
          Enter the 6-digit code from your {twoFactorMethod === 'app' ? 'authenticator app' : 'phone'}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-destructive text-sm block">{error}</span>
              {attemptsRemaining !== undefined && attemptsRemaining > 0 && (
                <span className="text-muted-foreground text-xs mt-1 block">
                  {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={onCodeChange}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="button"
          disabled={loading || code.length !== 6}
          onClick={onVerify}
          className="w-full"
          size="lg"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
          <Button
            variant="link"
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="text-primary"
          >
            {resending ? (
              'Sending...'
            ) : countdown > 0 ? (
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Resend in {countdown}s</span>
              </span>
            ) : (
              'Resend Code'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
