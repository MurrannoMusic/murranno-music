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
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+5</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">24</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Artists</div>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Music className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+15</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">156</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Tracks</div>
            </div>
          </div>
        </div>

        {/* Top Artists */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-[#6c5ce7]" />
              Top Performing Artists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Luna Sol</p>
                  <span className="text-sm font-bold text-[#00b894]">1.2M streams</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">+25% growth this month</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">The Echoes</p>
                  <span className="text-sm font-bold text-[#00b894]">890K streams</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">+18% growth this month</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Midnight Drive</p>
                  <span className="text-sm font-bold text-[#00b894]">645K streams</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">+12% growth this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tools */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Analytics Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-xs break-words">
                Generate Report
              </button>
              
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66] text-xs break-words">
                Export Data
              </button>
            </div>
            
            <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-4 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66] text-xs break-words">
              View Detailed Metrics
            </button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};