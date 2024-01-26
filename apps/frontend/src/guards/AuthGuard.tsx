import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../providers/UserProvider';

type AuthGuardType = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardType) => {
  let { user } = useUser();
  let location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
