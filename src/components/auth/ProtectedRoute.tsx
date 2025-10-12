import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredTier?: 'artist' | 'label' | 'agency';
}

export const ProtectedRoute = ({ children, requiredTier }: ProtectedRouteProps) => {
  const { user, userRole, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/get-started');
        return;
      }

      if (subscription?.status === 'expired' || subscription?.status === 'cancelled') {
        const now = new Date();
        const periodEnd = subscription.current_period_end 
          ? new Date(subscription.current_period_end) 
          : null;
        
        if (!periodEnd || periodEnd < now) {
          navigate('/subscription/plans');
          return;
        }
      }

      if (subscription?.status === 'trial' && subscription.trial_ends_at) {
        const trialEnd = new Date(subscription.trial_ends_at);
        if (trialEnd < new Date()) {
          navigate('/subscription/plans');
          return;
        }
      }

      if (requiredTier && userRole?.tier !== requiredTier) {
        const dashboardMap = {
          artist: '/artist-dashboard',
          label: '/label-dashboard',
          agency: '/agency-dashboard',
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
