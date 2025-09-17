import { User, Settings, Moon, Sun, Monitor } from 'lucide-react';
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
import { Link } from 'react-router-dom';

export const AvatarDropdown = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser } = useUserType();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
          <span className="text-primary font-bold text-sm">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </span>
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
        
        <Link to="/profile">
          <DropdownMenuItem className="text-foreground hover:bg-secondary/50 cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        
        <Link to="/settings">
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