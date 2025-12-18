import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { authService, type AvailableAccount } from '@/services/modules/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { EmailStep } from '@/components/auth/login-steps/EmailStep';
import { AccountSelectionStep } from '@/components/auth/login-steps/AccountSelectionStep';
import { PasswordStep } from '@/components/auth/login-steps/PasswordStep';
import { TwoFactorStep } from '@/components/auth/login-steps/TwoFactorStep';
import { toast } from 'sonner';
import { VerificationStatus } from '@/types/verification';

type LoginStep = 'email' | 'account-selection' | 'password' | '2fa';

interface LoginState {
  step: LoginStep;
  email: string;
  accounts: AvailableAccount[];
  selectedAccount: AvailableAccount | null;
  password: string;
  twoFactorToken: string | null;
  twoFactorMethod: 'app' | 'sms' | null;
  twoFactorCode: string;
  expiresAt: string | null;
}

const MultiStepLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login: contextLogin, verify2FA: contextVerify2FA, getDashboardUrl, verificationStatus } = useUser();

  const [state, setState] = useState<LoginState>({
    step: 'email',
    email: '',
    accounts: [],
    selectedAccount: null,
    password: '',
    twoFactorToken: null,
    twoFactorMethod: null,
    twoFactorCode: '',
    expiresAt: null,
  });

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | undefined>();
  const [resendCooldown, setResendCooldown] = useState(60);

  // Dynamic titles based on current step
  const stepContent = useMemo(() => {
    switch (state.step) {
      case 'email':
        return { title: 'Welcome Back', subtitle: 'Enter your email to continue' };
      case 'account-selection':
        return { title: 'Select Account', subtitle: 'Choose the account you want to sign in with' };
      case 'password':
        return { title: 'Enter Password', subtitle: 'Sign in to your selected account' };
      case '2fa':
        return { title: 'Verification Required', subtitle: 'Complete two-factor authentication' };
      default:
        return { title: 'Welcome Back', subtitle: 'Sign in to your account' };
    }
  }, [state.step]);

  // Get redirect path based on verification status and user role
  const getRedirectPath = (userVerificationStatus?: string, selectedAccount?: AvailableAccount | null): string => {
    const status = userVerificationStatus || verificationStatus;
    const account = selectedAccount || state.selectedAccount;
    const userType = account?.userType?.toLowerCase() || '';
    const isVendor = userType.includes('vendor') || userType === 'vendor';
    
    switch (status) {
      case VerificationStatus.APPROVED:
      case 'approved':
        return getDashboardUrl();
      case VerificationStatus.PENDING:
      case 'pending':
        return '/verification-pending';
      case VerificationStatus.REJECTED:
      case 'rejected':
        toast.error('Your profile verification was rejected. Please update your profile.');
        return isVendor ? '/vendor-settings' : '/dashboard/industry-settings';
      case VerificationStatus.INCOMPLETE:
      case 'incomplete':
      default:
        return isVendor ? '/vendor-settings' : '/dashboard/industry-settings';
    }
  };

  // Step 1: Email lookup
  const handleEmailContinue = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.lookupAccounts(state.email);

      if (response.success && response.data.accounts.length > 0) {
        // Filter out inactive accounts and check for active ones
        const activeAccounts = response.data.accounts.filter(acc => acc.isActive !== false);
        
        if (activeAccounts.length === 0) {
          setError('No active accounts found. Please contact support.');
          return;
        }

        setState(prev => ({
          ...prev,
          accounts: activeAccounts,
          step: activeAccounts.length === 1 ? 'password' : 'account-selection',
          selectedAccount: activeAccounts.length === 1 ? activeAccounts[0] : null,
        }));
      } else {
        setError('No accounts found with this email address');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lookup accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Account selection
  const handleAccountSelect = (account: AvailableAccount) => {
    // Check if account is active
    if (account.isActive === false) {
      setError('This account is currently inactive. Please contact support.');
      return;
    }

    setState(prev => ({
      ...prev,
      selectedAccount: account,
      step: 'password',
    }));
  };

  // Step 3: Password login
  const handleLogin = async () => {
    if (!state.selectedAccount) return;

    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        accountId: state.selectedAccount.id,
        email: state.email,
        userType: state.selectedAccount.userType,
        password: state.password,
      });

      if (response.success) {
        if (response.data.twoFactorRequired) {
          // 2FA required
          setState(prev => ({
            ...prev,
            twoFactorToken: response.data.twoFactorToken || null,
            twoFactorMethod: response.data.twoFactorMethod || null,
            expiresAt: response.data.expiresAt || null,
            step: '2fa',
          }));
          toast.info('Please enter the verification code');
        } else {
          // Login successful - use UserContext
          const result = await contextLogin(state.email, state.password);
          if (result.success) {
            toast.success('Login successful');
            // Use verification status from selected account or fetch from context
            const accountVerificationStatus = state.selectedAccount?.verificationStatus;
            const redirectPath = getRedirectPath(accountVerificationStatus, state.selectedAccount);
            navigate(redirectPath);
          } else {
            setError(result.error || 'Login failed');
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: 2FA verification
  const handleVerify2FA = async () => {
    if (!state.twoFactorToken || state.twoFactorCode.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const response = await authService.verify2FA({
        twoFactorToken: state.twoFactorToken,
        code: state.twoFactorCode,
      });

      if (response.success) {
        // Use UserContext verify2FA method
        const result = await contextVerify2FA(state.twoFactorToken, state.twoFactorCode);
        if (result.success) {
          toast.success('Authentication successful');
          // Use verification status from selected account or fetch from context
          const accountVerificationStatus = state.selectedAccount?.verificationStatus;
          const redirectPath = getRedirectPath(accountVerificationStatus, state.selectedAccount);
          navigate(redirectPath);
        } else {
          setError(result.error || 'Verification failed');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
      setAttemptsRemaining(err.response?.data?.attemptsRemaining);
    } finally {
      setLoading(false);
    }
  };

  // Resend 2FA code
  const handleResend2FA = async () => {
    if (!state.twoFactorToken) return;

    setResending(true);
    setError('');

    try {
      const response = await authService.resend2FA(state.twoFactorToken);

      if (response.success) {
        setResendCooldown(response.data.resendCooldown || 60);
        setState(prev => ({
          ...prev,
          expiresAt: response.data.expiresAt,
          twoFactorCode: '',
        }));
        toast.success('Verification code resent');
      }
    } catch (err: any) {
      if (err.response?.data?.cooldownRemaining) {
        toast.error(`Please wait ${err.response.data.cooldownRemaining} seconds before resending`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to resend code');
      }
    } finally {
      setResending(false);
    }
  };

  // Back navigation
  const handleBack = () => {
    setError('');
    setAttemptsRemaining(undefined);

    if (state.step === 'account-selection') {
      setState(prev => ({ ...prev, step: 'email', accounts: [], selectedAccount: null }));
    } else if (state.step === 'password') {
      setState(prev => ({
        ...prev,
        step: state.accounts.length > 1 ? 'account-selection' : 'email',
        password: '',
        selectedAccount: state.accounts.length > 1 ? null : prev.selectedAccount,
      }));
    } else if (state.step === '2fa') {
      setState(prev => ({
        ...prev,
        step: 'password',
        twoFactorToken: null,
        twoFactorMethod: null,
        twoFactorCode: '',
        expiresAt: null,
      }));
    }
  };

  // Removed unused STEPS constant reference

  return (
    <AuthLayout title={stepContent.title} subtitle={stepContent.subtitle}>
      {/* Progress Indicator - Commented out to hide multi-step display */}
      {/*
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {STEPS.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = step === state.step;

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`text-xs mt-1 ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {STEP_LABELS[index]}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-1 rounded transition-all mb-5 ${
                      isActive && index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      */}

      {/* Step Content */}
      {state.step === 'email' && (
        <EmailStep
          email={state.email}
          onEmailChange={(email) => setState(prev => ({ ...prev, email }))}
          onContinue={handleEmailContinue}
          loading={loading}
          error={error}
        />
      )}

      {state.step === 'account-selection' && (
        <AccountSelectionStep
          accounts={state.accounts}
          selectedAccount={state.selectedAccount}
          onSelectAccount={handleAccountSelect}
          onBack={handleBack}
          email={state.email}
        />
      )}

      {state.step === 'password' && state.selectedAccount && (
        <PasswordStep
          selectedAccount={state.selectedAccount}
          password={state.password}
          onPasswordChange={(password) => setState(prev => ({ ...prev, password }))}
          onLogin={handleLogin}
          onBack={handleBack}
          loading={loading}
          error={error}
        />
      )}

      {state.step === '2fa' && state.selectedAccount && state.twoFactorMethod && (
        <TwoFactorStep
          selectedAccount={state.selectedAccount}
          twoFactorMethod={state.twoFactorMethod}
          code={state.twoFactorCode}
          onCodeChange={(code) => setState(prev => ({ ...prev, twoFactorCode: code }))}
          onVerify={handleVerify2FA}
          onResend={handleResend2FA}
          onBack={handleBack}
          loading={loading}
          resending={resending}
          error={error}
          attemptsRemaining={attemptsRemaining}
          resendCooldown={resendCooldown}
        />
      )}
    </AuthLayout>
  );
};

export default MultiStepLogin;
