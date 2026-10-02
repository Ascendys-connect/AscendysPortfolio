/**
 * GuestGuard
 * Redirects authenticated users away from guest pages (login, etc.)
 */

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/routes';

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;
