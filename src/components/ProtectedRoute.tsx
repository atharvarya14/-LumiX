/**
 * ProtectedRoute component - Guards routes based on authentication and authorization
 * Redirects unauthenticated users to landing page
 * Redirects authenticated users to role-specific dashboard if accessing landing/login
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getRoleDashboard } from "@/types/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[]; // Optional role check
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check role if required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      // User is authenticated but doesn't have the required role
      // Redirect to their role-specific dashboard
      const dashboardRoute = getRoleDashboard(user.role);
      return <Navigate to={dashboardRoute} replace />;
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
};

/**
 * PublicRoute component - Redirects authenticated users away from public pages
 * Used for landing page and login pages
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // User is already authenticated - redirect to their dashboard
  if (user) {
    const dashboardRoute = getRoleDashboard(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // Not authenticated - allow access to public route
  return <>{children}</>;
};
