import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  role: UserRole;
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ role: requiredRole, children }) => {
  const { role, loading, user } = useAuth();

  if (loading || (user && !role)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-base text-lime-400">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    // Redirect to the appropriate dashboard based on their verified role
    return <Navigate to={role === 'trainer' ? '/trainer' : '/user'} replace />;
  }

  return <>{children}</>;
};
