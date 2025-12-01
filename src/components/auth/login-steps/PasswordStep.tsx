import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AvailableAccount } from '@/services/modules/auth';
import { Link } from 'react-router-dom';

interface PasswordStepProps {
  selectedAccount: AvailableAccount;
  password: string;
  onPasswordChange: (password: string) => void;
  onLogin: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
  error: string;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  selectedAccount,
  password,
  onPasswordChange,
  onLogin,
  onBack,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }
    setPasswordError('');
    await onLogin();
  };

  const handlePasswordChange = (value: string) => {
    onPasswordChange(value);
    if (passwordError) setPasswordError('');
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
          <Avatar className="w-20 h-20">
            <AvatarImage src={selectedAccount.avatar} alt={selectedAccount.firstName} />
            <AvatarFallback className="text-2xl">
              {getInitials(selectedAccount.firstName, selectedAccount.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {selectedAccount.firstName} {selectedAccount.lastName}
        </h2>
        <p className="text-muted-foreground mb-2">{selectedAccount.email}</p>
        <Badge variant="secondary">{selectedAccount.role}</Badge>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <span className="text-destructive text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`pl-10 pr-10 ${passwordError ? 'border-destructive' : ''}`}
              placeholder="Enter your password"
              disabled={loading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordError && (
            <div className="flex items-center space-x-1 mt-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-destructive text-sm">{passwordError}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !password.trim()}
          className="w-full"
          size="lg"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};
