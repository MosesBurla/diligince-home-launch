import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { authService, type AvailableAccount } from '@/services/modules/auth';
import { EmailStep } from '@/components/auth/login-steps/EmailStep';
import { AccountSelectionStep } from '@/components/auth/login-steps/AccountSelectionStep';
import { PasswordStep } from '@/components/auth/login-steps/PasswordStep';
import { TwoFactorStep } from '@/components/auth/login-steps/TwoFactorStep';
import { toast } from 'sonner';

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
  const { login: contextLogin, verify2FA: contextVerify2FA } = useUser();

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

  // Step 1: Email lookup
  const handleEmailContinue = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.lookupAccounts(state.email);

      if (response.success && response.data.accounts.length > 0) {
        setState(prev => ({
          ...prev,
          accounts: response.data.accounts,
          step: response.data.accounts.length === 1 ? 'password' : 'account-selection',
          selectedAccount: response.data.accounts.length === 1 ? response.data.accounts[0] : null,
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
            navigate('/dashboard');
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
          navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="rounded-2xl shadow-xl p-8 bg-white/95 backdrop-blur-lg border border-white/20">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              {['email', 'account-selection', 'password', '2fa'].map((step, index) => {
                const stepIndex = ['email', 'account-selection', 'password', '2fa'].indexOf(state.step);
                const currentIndex = ['email', 'account-selection', 'password', '2fa'].indexOf(step);
                const isActive = currentIndex <= stepIndex;
                const isCurrent = step === state.step;

                return (
                  <React.Fragment key={step}>
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
                    {index < 3 && (
                      <div
                        className={`w-12 h-1 rounded transition-all ${
                          isActive ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default MultiStepLogin;
