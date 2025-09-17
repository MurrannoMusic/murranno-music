import { Music, Clock, Upload, Play, ArrowLeft, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';

import { StatsGrid } from '@/components/stats/StatsGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { useStats } from '@/hooks/useStats';
import { TopTracksCard } from '@/components/modern/TopTracksCard';
import { mockTopTracks } from '@/utils/mockData';

export const ArtistDashboard = () => {
  const { currentUser } = useUserType();
  const { getStatsAsItems } = useStats();

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
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        
        {/* Crypto-style Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+12%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">
                {stats[1]?.value}
              </div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Earnings</div>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+23%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">
                {stats[0]?.value}
              </div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Streams</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#6c5ce7]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Streaming payout received</p>
                  <span className="text-sm font-bold text-[#00b894]">+$67.30</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Upload className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">New track uploaded</p>
                  <span className="text-sm font-bold text-[#6c5ce7]">Live</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Tracks Performance */}
        <TopTracksCard tracks={mockTopTracks} />
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};