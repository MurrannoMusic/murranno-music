import { Home, Upload, Megaphone, DollarSign, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Upload, label: 'Upload', path: '/upload' },
  { icon: Megaphone, label: 'Promo', path: '/promotions' },
  { icon: DollarSign, label: 'Earnings', path: '/earnings' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border/50 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-1 px-2 max-w-md mx-auto sm:py-2 sm:px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-smooth sm:gap-1 sm:p-2 sm:rounded-xl",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-smooth sm:h-5 sm:w-5",
                isActive && "scale-110"
              )} />
              <span className="text-[10px] font-medium sm:text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};