import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onContinue: () => Promise<void>;
  loading: boolean;
  error: string;
}

export const EmailStep: React.FC<EmailStepProps> = ({
  email,
  onEmailChange,
  onContinue,
  loading,
  error,
}) => {
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      await onContinue();
    }
  };

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
    if (emailError) setEmailError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">Enter your email to continue</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <span className="text-destructive text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`pl-10 ${emailError ? 'border-destructive' : ''}`}
              placeholder="Enter your email"
              disabled={loading}
              autoFocus
            />
          </div>
          {emailError && (
            <div className="flex items-center space-x-1 mt-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-destructive text-sm">{emailError}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full"
          size="lg"
        >
          {loading ? (
            'Loading...'
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
