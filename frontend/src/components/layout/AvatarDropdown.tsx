import { User, Settings, Moon, Sun, Monitor, Building2, Briefcase, Music } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';
import { useUserType } from '@/hooks/useUserType';
import { useArtistProfile } from '@/hooks/useArtistProfile';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const AvatarDropdown = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser, accessibleTiers, currentViewingTier, switchDashboard } = useUserType();
  const { profile } = useArtistProfile();
  const navigate = useNavigate();

  if (!currentUser) {
    return null;
  }

  const handleDashboardSwitch = (tier: 'artist' | 'label' | 'agency') => {
    switchDashboard(tier);
    const dashboardRoutes = {
      artist: '/app/artist-dashboard',
      label: '/app/label-dashboard',
      agency: '/app/agency-dashboard',
    };
    navigate(dashboardRoutes[tier]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
          <Avatar className="w-10 h-10 border-2 border-primary/30">
            <AvatarImage src={profile?.profile_image || ''} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
              {(currentUser.name || 'User').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-card/95 backdrop-blur-xl border border-border/30 shadow-primary z-[100]" 
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-foreground">
          {currentUser.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Dashboard Switcher */}
        <DropdownMenuLabel className="text-foreground text-xs">
          Switch Dashboard
        </DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => handleDashboardSwitch('artist')}
          className={`text-foreground hover:bg-secondary/50 cursor-pointer ${currentViewingTier === 'artist' ? 'bg-primary/10' : ''}`}
        >
          <Music className="h-4 w-4 mr-2" />
          Artist
          {currentViewingTier === 'artist' && <span className="ml-auto text-xs text-primary">Active</span>}
        </DropdownMenuItem>
        
        {accessibleTiers.includes('label') ? (
          <DropdownMenuItem
            onClick={() => handleDashboardSwitch('label')}
            className={`text-foreground hover:bg-secondary/50 cursor-pointer ${currentViewingTier === 'label' ? 'bg-primary/10' : ''}`}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Label
            {currentViewingTier === 'label' && <span className="ml-auto text-xs text-primary">Active</span>}
          </DropdownMenuItem>
        ) : (
          <Link to="/app/subscription/plans">
            <DropdownMenuItem className="text-muted-foreground hover:bg-secondary/50 cursor-pointer">
              <Building2 className="h-4 w-4 mr-2" />
              Label
              <span className="ml-auto text-xs">Subscribe</span>
            </DropdownMenuItem>
          </Link>
        )}
        
        {accessibleTiers.includes('agency') ? (
          <DropdownMenuItem
            onClick={() => handleDashboardSwitch('agency')}
            className={`text-foreground hover:bg-secondary/50 cursor-pointer ${currentViewingTier === 'agency' ? 'bg-primary/10' : ''}`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Agency
            {currentViewingTier === 'agency' && <span className="ml-auto text-xs text-primary">Active</span>}
          </DropdownMenuItem>
        ) : (
          <Link to="/app/subscription/plans">
            <DropdownMenuItem className="text-muted-foreground hover:bg-secondary/50 cursor-pointer">
              <Briefcase className="h-4 w-4 mr-2" />
              Agency
              <span className="ml-auto text-xs">Subscribe</span>
            </DropdownMenuItem>
          </Link>
        )}
        
        <DropdownMenuSeparator />
        
        <Link to="/app/artist-profile">
          <DropdownMenuItem className="text-foreground hover:bg-secondary/50 cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Artist Profile
          </DropdownMenuItem>
        </Link>
        
        <Link to="/app/profile">
          <DropdownMenuItem className="text-foreground hover:bg-secondary/50 cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Account
          </DropdownMenuItem>
        </Link>
        
        <Link to="/app/settings">
          <DropdownMenuItem className="text-foreground hover:bg-secondary/50 cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-foreground text-xs">
          Theme
        </DropdownMenuLabel>
        
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem 
            value="light" 
            className="text-foreground hover:bg-secondary/50 cursor-pointer"
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            value="dark" 
            className="text-foreground hover:bg-secondary/50 cursor-pointer"
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            value="system" 
            className="text-foreground hover:bg-secondary/50 cursor-pointer"
          >
            <Monitor className="h-4 w-4 mr-2" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
