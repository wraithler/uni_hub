import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useAuth } from "@/components/auth/SessionAuthProvider.tsx";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
  requireSuperuser?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requireEmailVerification,
  requireSuperuser,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as string)) {
    return <Navigate to="/404" replace />;
  }

  if (requireEmailVerification && user && !user.is_email_verified) {
    return <Navigate to="/verification-email/send" replace />;
  }

  if (requireSuperuser && user && !user.is_superuser) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};
