import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/store/auth';

export default function ProtectedLayout() {
  const status = useAuthStore((s) => s.status);

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}