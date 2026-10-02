/**
 * Custom hook for checking user permissions
 */

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth.types";

export const usePermissions = () => {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isEditor = user?.role === UserRole.EDITOR;

  const canPublish = isSuperAdmin || isAdmin;
  const canSetToDraft = isSuperAdmin || isAdmin;
  const canDelete = isSuperAdmin || isAdmin;
  const canArchive = true; // All roles can archive (with restrictions on backend)
  const canCreate = isSuperAdmin || isAdmin || isEditor;
  const canEdit = isSuperAdmin || isAdmin || isEditor;

  /**
   * Check if user has one of the allowed roles
   */
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    user,
    isSuperAdmin,
    isAdmin,
    isEditor,
    canPublish,
    canSetToDraft,
    canDelete,
    canArchive,
    canCreate,
    canEdit,
    hasRole,
  };
};
