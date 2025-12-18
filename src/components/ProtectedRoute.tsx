import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { VerificationStatus } from '@/types/verification';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, verificationStatus } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Allow access to Settings and verification pages for all user types
  if (location.pathname.includes('industry-settings') || 
      location.pathname.includes('vendor-settings') ||
      location.pathname.includes('verification-pending')) {
    return <>{children}</>;
  }

  // Check user role and verification status
  const isVendor = user.role === 'vendor';
  const isIndustry = user.role === 'industry';

  // Redirect based on user type and verification status
  if (isIndustry) {
    if (verificationStatus === VerificationStatus.INCOMPLETE || 
        verificationStatus === VerificationStatus.REJECTED) {
      return <Navigate to="/dashboard/industry-settings" replace />;
    }

    if (verificationStatus === VerificationStatus.PENDING) {
      return <Navigate to="/verification-pending" replace />;
    }
  }

  if (isVendor) {
    // Redirect vendors to vendor-settings if verification is incomplete/rejected
    if (verificationStatus === VerificationStatus.INCOMPLETE || 
        verificationStatus === VerificationStatus.REJECTED) {
      // Only redirect if not already on vendor-settings or verification pages
      if (!location.pathname.includes('vendor-settings') && 
          !location.pathname.includes('verification-pending')) {
        return <Navigate to="/dashboard/vendor-settings" replace />;
      }
    }

    if (verificationStatus === VerificationStatus.PENDING) {
      if (!location.pathname.includes('verification-pending')) {
        return <Navigate to="/verification-pending" replace />;
      }
    }
  }

  // Full access for approved users
  return <>{children}</>;
};
