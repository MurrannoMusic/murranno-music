import { Users, Clock, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { UserTypeDemo } from '@/components/mobile/UserTypeDemo';
import { ArtistSelector } from '@/components/mobile/ArtistSelector';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { useStats } from '@/hooks/useStats';

export const LabelDashboard = () => {
  const { currentUser, selectedArtist } = useUserType();
  const { getStatsAsItems } = useStats();

  const recentActivity = [
    {
      title: "Artist payout processed",
      description: "Monthly payouts sent to 3 artists",
      value: "$2,450",
      time: "1h ago",
      type: "success"
    },
    {
      title: "New release uploaded",
      description: "Luna Sol uploaded new single",
      value: "Live",
      time: "3h ago",
      type: "primary"
    }
  ];

  const stats = getStatsAsItems(selectedArtist);

  const headerTitle = selectedArtist 
    ? `Managing: ${(currentUser as any).artists.find((a: any) => a.id === selectedArtist)?.stageName}`
    : `${(currentUser as any).companyName}`;

  const headerSubtitle = selectedArtist 
    ? "Artist management dashboard" 
    : "Label dashboard - manage all artists";

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
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-4 py-1">
              LABEL
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-4">
        {/* Artist Selector */}
        <ArtistSelector />
        
        {/* Crypto-style Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-5 shadow-lg">
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
          
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-[#6c5ce7]" />
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
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
                <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-[#6c5ce7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white truncate">{activity.title}</p>
                    <span className={`text-sm font-bold ${activity.type === 'success' ? 'text-[#00b894]' : 'text-[#6c5ce7]'}`}>
                      {activity.value}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b8ba3]">{activity.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/upload">
                <button className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                  Upload Track
                </button>
              </Link>
              
              <Link to="/promotions">
                <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                  Start Campaign
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/label-analytics">
                <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                  View Analytics
                </button>
              </Link>
              
              <Link to="/payout-manager">
                <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                  Manage Payouts
                </button>
              </Link>
            </div>

            <Link to="/artist-management">
              <button className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                Manage Artists
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};