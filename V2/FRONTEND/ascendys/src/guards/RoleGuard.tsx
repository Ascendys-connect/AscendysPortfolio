/**
 * RoleGuard
 * Protects routes based on user roles
 */

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { usePermissions } from '@/hooks/usePermissions';
import { ROUTES } from '@/config/routes';
import type { UserRole } from '@/types/auth.types';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = ROUTES.DASHBOARD,
}) => {
  const { hasRole } = usePermissions();

  // Check if user has required role
  if (!hasRole(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
