import { ArrowLeft, DollarSign, TrendingUp, Download, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { PageContainer } from '@/components/layout/PageContainer';

export const Earnings = () => {
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
              EARNINGS
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
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
              <div className="text-xl font-bold text-white">$2,847</div>
              <div className="text-xs text-[#8b8ba3] font-medium">Total Earnings</div>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-[#6c5ce7]" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[#00b894] font-medium">+8%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">$245</div>
              <div className="text-xs text-[#8b8ba3] font-medium">This Month</div>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-[#6c5ce7]" />
              Recent Payouts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Streaming Revenue</p>
                  <span className="text-sm font-bold text-[#00b894]">+$164.80</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">Spotify • 8.2K streams</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
              <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-[#6c5ce7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">Apple Music</p>
                  <span className="text-sm font-bold text-[#00b894]">+$89.30</span>
                </div>
                <p className="text-xs text-[#8b8ba3]">3.1K streams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Payout Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
              Withdraw $298.50
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Bank Transfer
              </button>
              
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Mobile Money
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};