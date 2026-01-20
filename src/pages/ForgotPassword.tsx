import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { authService } from "@/services/modules/auth/auth.service";
import toast from "@/utils/toast.utils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
      toast.success("Reset link sent!", {
        description: "Please check your email for the password reset link.",
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to send reset link. Please try again.";
      setError(errorMessage);
      toast.error("Request failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We've sent a password reset link to:
            </p>
            <p className="font-medium text-foreground">{email}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="text-primary hover:underline font-medium"
              >
                try again
              </button>
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={`pl-10 ${error ? "border-destructive" : ""}`}
              disabled={isLoading}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            "Send Reset Link"
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

export default ForgotPassword;
