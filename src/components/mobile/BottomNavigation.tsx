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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border/50 z-40">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-smooth",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-smooth",
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