import { Music, Clock, Upload, Play, ArrowLeft, DollarSign, BarChart3 } from 'lucide-react';
import { NewsCarousel } from '@/components/modern/NewsCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { useEffect } from 'react';

import { StatsGrid } from '@/components/stats/StatsGrid';

import { useUserType } from '@/hooks/useUserType';
import { useStats } from '@/hooks/useStats';
import { TopTracksCard } from '@/components/modern/TopTracksCard';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useTopTracks } from '@/hooks/useTopTracks';

import { AnalyticsCarousel } from '@/components/analytics/AnalyticsCarousel';

export const ArtistDashboard = () => {
  const { currentUser, loading } = useUserType();
  const { getStatsAsItems } = useStats();
  const { activities } = useRecentActivity();
  const { tracks } = useTopTracks();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/app/user-type-selection', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <div className="mobile-container py-8 text-center text-muted-foreground text-sm">
          {loading ? 'Loading...' : 'Redirecting…'}
        </div>
      </div>
    );
  }

  const stats = getStatsAsItems();

  return (
    <div className="smooth-scroll">
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

        {/* News Carousel */}
        <NewsCarousel />

        {/* Recent Activity */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent activity. Upload your first release to get started!
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    {activity.icon === 'dollar' && <DollarSign className="h-5 w-5 text-primary" />}
                    {activity.icon === 'upload' && <Upload className="h-5 w-5 text-primary" />}
                    {activity.icon === 'play' && <Play className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-card-foreground truncate">{activity.title}</p>
                      <span className={`text-sm font-bold ${
                        activity.type === 'success' ? 'text-success' : 
                        activity.type === 'primary' ? 'text-primary' : 
                        'text-card-foreground'
                      }`}>
                        {activity.value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Tracks Performance */}
        {tracks.length > 0 && <TopTracksCard tracks={tracks} />}
      </div>

      <FloatingActionButton />
    </div>
  );
};