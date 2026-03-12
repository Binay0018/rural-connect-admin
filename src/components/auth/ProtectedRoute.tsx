import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ('admin' | 'doctor' | 'worker')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Still restoring session from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not authenticated at all → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (!allowedRoles.includes(user.role)) {
    const fallback = user.role === 'doctor' ? '/doctor' : '/';
    return <Navigate to={fallback} replace />;
  }

  // Doctor authenticated but isActive = false (awaiting admin approval)
  // Redirect to the dedicated approval-pending page
  if (user.role === 'doctor' && user.status === 'pending' && allowedRoles.includes('doctor')) {
    return <Navigate to="/doctor/pending-approval" replace />;
  }

  return <>{children}</>;
}
