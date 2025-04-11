import { useAuth } from "@/components/auth/AuthProvider.tsx";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requireEmailVerification,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  if (requireEmailVerification && user && !user.is_email_verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};
