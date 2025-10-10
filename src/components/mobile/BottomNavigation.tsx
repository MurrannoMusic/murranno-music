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
      path.startsWith('/artist') || ['\u002Fupload', '\u002Fearnings', '\u002Fanalytics', '\u002Fpromotions'].includes(path)
    );
    const inferredLabel = !isArtist && !isLabel && !isAgency && (
      path.startsWith('/label') || ['\u002Fartist-management', '\u002Fpayout-manager', '\u002Flabel-analytics'].includes(path)
    );
    const inferredAgency = !isArtist && !isLabel && !isAgency && (
      path.startsWith('/agency') || ['\u002Fcampaign-manager'].includes(path)
    );

    if (isArtist || inferredArtist) {
      return [
        { icon: Home, label: 'Home', path: '/artist-dashboard' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Music, label: 'Music', path: '/releases' },
        { icon: DollarSign, label: 'Earnings', path: '/earnings' },
        { icon: Upload, label: 'Upload', path: '/upload' },
      ];
    }

    if (isLabel || inferredLabel) {
      return [
        { icon: Home, label: 'Home', path: '/label-dashboard' },
        { icon: Users, label: 'Artists', path: '/artist-management' },
        { icon: Upload, label: 'Upload', path: '/upload' },
        { icon: DollarSign, label: 'Payouts', path: '/payout-manager' },
        { icon: TrendingUp, label: 'Analytics', path: '/label-analytics' },
      ];
    }

    if (isAgency || inferredAgency) {
      return [
        { icon: Home, label: 'Home', path: '/agency-dashboard' },
        { icon: Megaphone, label: 'Campaigns', path: '/campaign-manager' },
        { icon: Upload, label: 'Create', path: '/promotions' },
        { icon: BarChart3, label: 'Results', path: '/results' },
      ];
    }

    // Default fallback
    return [{ icon: Home, label: 'Home', path: '/dashboard' }];
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