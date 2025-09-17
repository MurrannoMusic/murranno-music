import { ArrowLeft, Target, Users, BarChart3, Download, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { PageContainer } from '@/components/layout/PageContainer';

export const AgencyDashboard = () => {
  const activeCampaigns = [
    {
      id: 1,
      artist: 'Luna Sol',
      campaign: 'TikTok Viral Push',
      status: 'Active',
      reach: '25.3K',
      budget: '$299',
      remaining: '5 days'
    },
    {
      id: 2,
      artist: 'The Echoes',
      campaign: 'Instagram Stories',
      status: 'Active', 
      reach: '12.1K',
      budget: '$149',
      remaining: '12 days'
    },
    {
      id: 3,
      artist: 'Midnight Drive',
      campaign: 'YouTube Pre-roll',
      status: 'Completed',
      reach: '45.7K',
      budget: '$599',
      remaining: 'Complete'
    }
  ];

  return (
    <PageContainer>
      {/* Modern Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-accent/15 text-accent border-accent/30 px-4 py-1">
              AGENCY
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Zap className="h-5 w-5 text-accent" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-4">
        {/* Crypto-style Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+3</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">8</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Active Campaigns</div>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+28%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">156K</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Reach</div>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
                <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-[#6c5ce7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{campaign.artist}</h3>
                      <Badge 
                        variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-[#00b894]">{campaign.reach}</span>
                  </div>
                  <p className="text-xs text-[#8b8ba3]">{campaign.campaign}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2d2d44]">
                    <span className="text-xs text-[#8b8ba3]">Budget: {campaign.budget}</span>
                    <span className="text-xs font-medium text-white">{campaign.remaining}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Agency Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/promotions">
                <button className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                  Create Campaign
                </button>
              </Link>
              
              <Link to="/campaign-manager">
                <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                  Manage Campaigns
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Export Reports
              </button>
              
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Client Analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};