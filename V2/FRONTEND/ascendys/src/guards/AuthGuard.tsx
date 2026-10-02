/**
 * AuthGuard
 * Protects routes that require authentication
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/routes';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
