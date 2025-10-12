import { Music, Clock, Upload, Play, ArrowLeft, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { useEffect } from 'react';

import { StatsGrid } from '@/components/stats/StatsGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { useStats } from '@/hooks/useStats';
import { TopTracksCard } from '@/components/modern/TopTracksCard';

import { AnalyticsCarousel } from '@/components/analytics/AnalyticsCarousel';

export const ArtistDashboard = () => {
  const { currentUser, loading } = useUserType();
  const { getStatsAsItems } = useStats();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/user-type-selection', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser) {
    return (
      <PageContainer>
        <div className="mobile-container py-8 text-center text-muted-foreground text-sm">
          {loading ? 'Loading...' : 'Redirecting…'}
        </div>
      </PageContainer>
    );
  }

  const recentActivity = [
    {
      title: "New streams detected",
      description: 'Your track "Summer Vibes" gained 150 new streams',
      value: "+150",
      time: "2h ago",
      type: "success"
    },
    {
      title: "Playlist placement",
      description: "Added to 'Indie Discoveries' playlist",
      value: "New",
      time: "4h ago", 
      type: "primary"
    }
  ];

  const stats = getStatsAsItems();

  return (
    <PageContainer className="smooth-scroll">
      {/* Modern Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              ARTIST
            </Badge>
          </div>
          
          {/* Avatar Dropdown (Right) */}
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        
        {/* Analytics Carousel */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 px-1">Performance Insights</h2>
          <AnalyticsCarousel />
        </div>

        {/* Crypto-style Stats Card */}
        <div className="bg-card border border-border rounded-[20px] p-4 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right">
              <div className="text-xs text-success font-medium">+12%</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-card-foreground">
              {stats[1]?.value}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Total Earnings</div>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-card-foreground truncate">Streaming payout received</p>
                  <span className="text-sm font-bold text-success">+₦67.30</span>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-card-foreground truncate">New track uploaded</p>
                  <span className="text-sm font-bold text-primary">Live</span>
                </div>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Tracks Performance */}
        <TopTracksCard tracks={[]} />
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};