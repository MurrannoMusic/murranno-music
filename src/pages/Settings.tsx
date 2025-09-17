import { ArrowLeft, Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <Moon className="h-5 w-5 text-[#6c5ce7]" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setTheme('light')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'light' 
                  ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white' 
                  : 'bg-[#0d0d1b] border-[#2d2d44] text-white hover:bg-[#2d2d44]'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'dark' 
                  ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white' 
                  : 'bg-[#0d0d1b] border-[#2d2d44] text-white hover:bg-[#2d2d44]'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </button>
            
            <button
              onClick={() => setTheme('system')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'system' 
                  ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white' 
                  : 'bg-[#0d0d1b] border-[#2d2d44] text-white hover:bg-[#2d2d44]'
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span>System Default</span>
            </button>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardContent className="p-4">
            <p className="text-center text-[#8b8ba3]">
              More settings options coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};