import { ArrowLeft, DollarSign, TrendingUp, Download, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
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
          
          {/* Avatar Dropdown (Right) */}
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        {/* Crypto-style Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
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
              <div className="text-xl font-bold text-card-foreground">$2,847</div>
              <div className="text-xs text-muted-foreground font-medium">Total Earnings</div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-[20px] p-4 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-xs text-success font-medium">+8%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-card-foreground">$245</div>
              <div className="text-xs text-muted-foreground font-medium">This Month</div>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-primary" />
              Recent Payouts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-card-foreground truncate">Streaming Revenue</p>
                  <span className="text-sm font-bold text-success">+$164.80</span>
                </div>
                <p className="text-xs text-muted-foreground">Spotify • 8.2K streams</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-card-foreground truncate">Apple Music</p>
                  <span className="text-sm font-bold text-success">+$89.30</span>
                </div>
                <p className="text-xs text-muted-foreground">3.1K streams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground">Payout Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-4 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] text-sm">
              Withdraw $298.50
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 border border-border hover:border-border/50 text-xs break-words">
                Bank Transfer
              </button>
              
              <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 border border-border hover:border-border/50 text-xs break-words">
                Mobile Money
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};