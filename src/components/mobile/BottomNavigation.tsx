import { Home, Upload, Megaphone, DollarSign, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserType } from '@/hooks/useUserType';

export const BottomNavigation = () => {
  const location = useLocation();
  const { isArtist, isLabel, isAgency } = useUserType();

  // Dynamic navigation based on user type
  const getNavItems = () => {
    if (isArtist) {
      return [
        { icon: Home, label: 'Home', path: '/artist-dashboard' },
        { icon: Upload, label: 'Upload', path: '/upload' },
        { icon: Megaphone, label: 'Promo', path: '/promotions' },
        { icon: DollarSign, label: 'Earnings', path: '/earnings' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      ];
    }

    if (isLabel) {
      return [
        { icon: Home, label: 'Home', path: '/label-dashboard' },
        { icon: Users, label: 'Artists', path: '/artist-management' },
        { icon: Upload, label: 'Upload', path: '/upload' },
        { icon: DollarSign, label: 'Payouts', path: '/payout-manager' },
        { icon: TrendingUp, label: 'Analytics', path: '/label-analytics' },
      ];
    }

    if (isAgency) {
      return [
        { icon: Home, label: 'Home', path: '/agency-dashboard' },
        { icon: Megaphone, label: 'Campaigns', path: '/campaign-manager' },
        { icon: Upload, label: 'Create', path: '/promotions' },
        { icon: BarChart3, label: 'Results', path: '/agency-dashboard' },
      ];
    }

    // Default fallback
    return [{ icon: Home, label: 'Home', path: '/dashboard' }];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/60 backdrop-blur-2xl border-t border-border/20 z-40 shadow-soft">
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