import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredTier?: 'artist' | 'label' | 'agency';
}

// Set to false when ready to enforce subscription and tier restrictions
const IS_DEV_MODE = true;

export const ProtectedRoute = ({ children, requiredTier }: ProtectedRouteProps) => {
  const { user, userRole, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/get-started');
        return;
      }

      // Skip subscription and tier checks in development mode
      if (IS_DEV_MODE) {
        return;
      }

      if (subscription?.status === 'expired' || subscription?.status === 'cancelled') {
        const now = new Date();
        const periodEnd = subscription.current_period_end 
          ? new Date(subscription.current_period_end) 
          : null;
        
        if (!periodEnd || periodEnd < now) {
          navigate('/app/subscription/plans');
          return;
        }
      }

      if (subscription?.status === 'trial' && subscription.trial_ends_at) {
        const trialEnd = new Date(subscription.trial_ends_at);
        if (trialEnd < new Date()) {
          navigate('/app/subscription/plans');
          return;
        }
      }

      if (requiredTier && userRole?.tier !== requiredTier) {
        const dashboardMap = {
          artist: '/app/artist-dashboard',
          label: '/app/label-dashboard',
          agency: '/app/agency-dashboard',
        };
        navigate(dashboardMap[userRole?.tier || 'artist']);
      }
    }
  }, [user, userRole, subscription, loading, requiredTier, navigate]);

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

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
