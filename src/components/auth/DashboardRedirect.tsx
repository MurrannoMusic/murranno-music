import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardRedirect = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userRole) {
      const dashboardMap: Record<string, string> = {
        artist: '/app/artist-dashboard',
        label: '/app/label-dashboard',
        agency: '/app/agency-dashboard',
        admin: '/admin',
      };

      const targetRoute = dashboardMap[userRole.tier] || '/app/user-type-selection';
      navigate(targetRoute, { replace: true });
    }
  }, [userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
};
