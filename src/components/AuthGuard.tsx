import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getDashboardRoute } from '@/types/shared';

const PUBLIC_ROUTES = [
  '/', '/about', '/contact', '/pricing', '/blog', '/careers',
  '/legal', '/privacy', '/terms', '/signup', '/login',
  '/forgot-password', '/pending-approval'
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route =>
        location.pathname === route ||
        location.pathname.startsWith('/blog/') ||
        location.pathname.startsWith('/reset-password/')
      );

      // Not logged in and trying to access protected route
      if (!user && !isPublicRoute) {
        navigate('/login', { replace: true, state: { from: location.pathname } });
      }

      // Logged in and on signup/login pages - redirect to dashboard
      if (user && (location.pathname === '/signup' || location.pathname === '/login')) {
        const dashboardUrl = getDashboardRoute(user);
        navigate(dashboardUrl, { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

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

  return <>{children}</>;
};
