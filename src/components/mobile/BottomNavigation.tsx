import { Home, Upload, Megaphone, DollarSign, BarChart3, Users, TrendingUp, Music } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserType } from '@/hooks/useUserType';

export const BottomNavigation = () => {
  const location = useLocation();
  const { isArtist, isLabel, isAgency } = useUserType();

  // Dynamic navigation based on user type (with route fallback)
  const getNavItems = () => {
    const path = location.pathname;

    // Infer user type from route only if hook flags are not set
    const inferredArtist = !isArtist && !isLabel && !isAgency && (
      path.startsWith('/app/artist') || ['/app/upload', '/app/earnings', '/app/analytics', '/app/promotions'].includes(path)
    );
    const inferredLabel = !isArtist && !isLabel && !isAgency && (
      path.startsWith('/app/label') || ['/app/artist-management', '/app/payout-manager', '/app/label-analytics'].includes(path)
    );
    const inferredAgency = !isArtist && !isLabel && !isAgency && (
      path.startsWith('/app/agency') || ['/app/campaign-manager'].includes(path)
    );

    if (isArtist || inferredArtist) {
      return [
        { icon: Home, label: 'Home', path: '/app/artist-dashboard' },
        { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
        { icon: Music, label: 'Music', path: '/app/releases' },
        { icon: DollarSign, label: 'Earnings', path: '/app/earnings' },
        { icon: Upload, label: 'Upload', path: '/app/upload' },
      ];
    }

    if (isLabel || inferredLabel) {
      return [
        { icon: Home, label: 'Home', path: '/app/label-dashboard' },
        { icon: Users, label: 'Artists', path: '/app/artist-management' },
        { icon: Upload, label: 'Upload', path: '/app/upload' },
        { icon: DollarSign, label: 'Payouts', path: '/app/payout-manager' },
        { icon: TrendingUp, label: 'Analytics', path: '/app/label-analytics' },
      ];
    }

    if (isAgency || inferredAgency) {
      return [
        { icon: Home, label: 'Home', path: '/app/agency-dashboard' },
        { icon: Megaphone, label: 'Campaigns', path: '/app/campaign-manager' },
        { icon: Upload, label: 'Create', path: '/app/promotions' },
        { icon: BarChart3, label: 'Results', path: '/app/results' },
      ];
    }

    // Default fallback
    return [{ icon: Home, label: 'Home', path: '/app/dashboard' }];
  };

  const navItems = getNavItems();

  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 z-40 shadow-soft">
      <div className="flex items-center justify-around py-3 px-4 max-w-sm mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "nav-item flex flex-col items-center gap-1 p-2 rounded-xl",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-elastic",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};