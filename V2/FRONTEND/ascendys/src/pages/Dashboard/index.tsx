import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth.types";
import SuperAdminDashboard from "./SuperAdmin";
import AdminDashboard from "./Admin";
import EditorDashboard from "./Editor";
import { Navigate } from "react-router";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.EDITOR:
      return <EditorDashboard />;
    case UserRole.USER:
    default:
      return <AdminDashboard />; // Default to admin dashboard for regular users
  }
}
