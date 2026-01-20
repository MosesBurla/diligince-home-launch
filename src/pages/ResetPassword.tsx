import React, { useState, useMemo } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2, XCircle, Check, X } from "lucide-react";
import { authService } from "@/services/modules/auth/auth.service";
import toast from "@/utils/toast.utils";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    const passed = passwordRequirements.filter(req => req.test(password)).length;
    return {
      score: passed,
      percentage: (passed / passwordRequirements.length) * 100,
      label: passed === 0 ? "" : passed <= 2 ? "Weak" : passed <= 4 ? "Medium" : "Strong",
      color: passed <= 2 ? "bg-destructive" : passed <= 4 ? "bg-amber-500" : "bg-green-500",
    };
  }, [password]);

  const isPasswordValid = passwordRequirements.every(req => req.test(password));
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
      });
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;
      const errorMessage = err?.response?.data?.message || "Failed to reset password. Please try again.";
      
      if (errorCode === "INVALID_TOKEN" || errorCode === "EXPIRED_TOKEN") {
        setError("This reset link is invalid or has expired. Please request a new one.");
      } else {
        setError(errorMessage);
      }
      toast.error("Reset failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="This password reset link is invalid"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <p className="text-muted-foreground">
            The reset link you followed is invalid or has expired. Please request a new password reset.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/forgot-password">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Reset Complete"
        subtitle="Your password has been successfully reset"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          
          <p className="text-muted-foreground">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>

          <Link to="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="pl-10 pr-10"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.percentage}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.score <= 2 ? "text-destructive" : 
                  passwordStrength.score <= 4 ? "text-amber-500" : "text-green-500"
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Password Requirements */}
        {password && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
            {passwordRequirements.map((req, index) => {
              const passed = req.test(password);
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {passed ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={passed ? "text-green-600" : "text-muted-foreground"}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className={`pl-10 pr-10 ${
                confirmPassword && !doPasswordsMatch ? "border-destructive" : ""
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && !doPasswordsMatch && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
