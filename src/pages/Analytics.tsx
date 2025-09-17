import { ArrowLeft, BarChart3, Globe, Users, Calendar, Download, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { PageContainer } from '@/components/layout/PageContainer';

export const Analytics = () => {
  return (
    <PageContainer>
      {/* Consistent Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              ANALYTICS
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end mt-4">
          <Button variant="glass" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        {/* Crypto-style Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+15%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">2.4M</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Streams</div>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+8%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">3.2K</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Unique Listeners</div>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-[#6c5ce7]" />
              Stream Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-[#0d0d1b] rounded-[12px] border border-[#2d2d44] flex items-center justify-center">
              <p className="text-[#8b8ba3]">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Tracks */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <Music className="h-5 w-5 text-[#6c5ce7]" />
              Top Performing Tracks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Music className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Summer Vibes</p>
                  <span className="text-sm font-bold text-[#00b894]">245K streams</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">+15% from last week</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Music className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Midnight Dreams</p>
                  <span className="text-sm font-bold text-[#00b894]">189K streams</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">+8% from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};