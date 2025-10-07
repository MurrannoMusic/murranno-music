import { ArrowLeft, Users, DollarSign, TrendingUp, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/mobile/StatCard';
import { ArtistSelector } from '@/components/mobile/ArtistSelector';
import { useUserType } from '@/hooks/useUserType';
import { PageContainer } from '@/components/layout/PageContainer';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';

export const LabelAnalytics = () => {
  const { selectedArtist, currentUser, isLabel } = useUserType();

  const getLabelStats = () => {
    if (selectedArtist) {
      // Individual artist stats
      return {
        streams: '3.2K',
        earnings: '$89',
        followers: '547',
        releases: '3'
      };
    }
    // Combined label stats
    return {
      streams: '45.7K',
      earnings: '$1,234',
      followers: '8.9K',
      releases: '24'
    };
  };

  const stats = getLabelStats();

  return (
    <PageContainer>
      {/* Consistent Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/label-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-4 py-1">
              {selectedArtist ? 'ARTIST ANALYTICS' : 'LABEL ANALYTICS'}
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
        {/* Artist Selector for Labels */}
        {isLabel && <ArtistSelector />}

        {/* Crypto-style Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card border-border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-xs text-accent font-medium">+5</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold">24</div>
              <div className="text-xs text-muted-foreground font-medium">Total Artists</div>
            </div>
          </div>
          
          <div className="glass-card border-border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-xs text-accent font-medium">+15</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold">156</div>
              <div className="text-xs text-muted-foreground font-medium">Total Tracks</div>
            </div>
          </div>
        </div>

        {/* Top Artists */}
        <Card className="glass-card border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Performing Artists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border/10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate">Luna Sol</p>
                  <span className="text-sm font-bold text-accent">1.2M streams</span>
                </div>
                <p className="text-xs text-muted-foreground">+25% growth this month</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border/10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate">The Echoes</p>
                  <span className="text-sm font-bold text-accent">890K streams</span>
                </div>
                <p className="text-xs text-muted-foreground">+18% growth this month</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border/10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate">Midnight Drive</p>
                  <span className="text-sm font-bold text-accent">645K streams</span>
                </div>
                <p className="text-xs text-muted-foreground">+12% growth this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tools */}
        <Card className="glass-card border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Analytics Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full gradient-primary font-semibold py-4 px-3 rounded-xl transition-smooth text-xs">
                Generate Report
              </button>
              
              <button className="w-full bg-muted/20 hover:bg-muted/30 border border-border/20 hover:border-border/30 font-semibold py-4 px-3 rounded-xl transition-smooth text-xs">
                Export Data
              </button>
            </div>
            
            <button className="w-full bg-muted/20 hover:bg-muted/30 border border-border/20 hover:border-border/30 font-semibold py-4 px-4 rounded-xl transition-smooth text-xs">
              View Detailed Metrics
            </button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};