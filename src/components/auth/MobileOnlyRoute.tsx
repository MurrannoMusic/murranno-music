import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { shouldShowMobileRoutes } from '@/utils/platformDetection';

interface MobileOnlyRouteProps {
  children: ReactNode;
}

export const MobileOnlyRoute = ({ children }: MobileOnlyRouteProps) => {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    setShouldShow(shouldShowMobileRoutes());
  }, []);

  if (shouldShow === null) {
    return null;
  }

  if (!shouldShow) {
    return <Navigate to="/desktop" replace />;
  }

  return <>{children}</>;
};
