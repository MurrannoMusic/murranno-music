import { ArrowLeft, Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTheme } from '@/components/ThemeProvider';

export const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <PageContainer>
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              SETTINGS
            </Badge>
          </div>
          
          {/* Avatar Dropdown (Right) */}
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <Moon className="h-5 w-5 text-primary" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setTheme('light')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'light' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-secondary/20 border-border text-card-foreground hover:bg-secondary/40'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'dark' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-secondary/20 border-border text-card-foreground hover:bg-secondary/40'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </button>
            
            <button
              onClick={() => setTheme('system')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'system' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-secondary/20 border-border text-card-foreground hover:bg-secondary/40'
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span>System Default</span>
            </button>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardContent className="p-4">
            <p className="text-center text-muted-foreground">
              More settings options coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};