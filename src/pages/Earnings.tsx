import { ArrowLeft, DollarSign, TrendingUp, Download, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

export const Earnings = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Earnings"
        subtitle="Track your revenue and payouts"
        backTo="/artist-dashboard"
      />

      <div className="mobile-container space-y-6 -mt-4">
        {/* Wallet Balance */}
        <Card className="modern-card bg-gradient-primary text-white border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 body-md">Total Balance</p>
                <p className="portfolio-value text-white">$342.50</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 body-sm">Available</p>
                <p className="heading-md text-white">$298.50</p>
              </div>
              <div>
                <p className="text-white/80 body-sm">Pending</p>
                <p className="heading-md text-white">$44.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <ModernStatCard
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            title="This Month"
            value="$89.20"
            change="+15%"
            changeType="positive"
          />
          <ModernStatCard
            icon={<Download className="h-5 w-5 text-primary" />}
            title="Last Payout"
            value="$125.00"
            change="5 days ago"
          />
        </div>

        {/* Payout Section */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="heading-md">Request Payout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-20 rounded-2xl">
                <CreditCard className="h-5 w-5 mb-2 text-primary" />
                <span className="body-sm">Bank Transfer</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-20 rounded-2xl">
                <Smartphone className="h-5 w-5 mb-2 text-primary" />
                <span className="body-sm">Mobile Money</span>
              </Button>
            </div>
            
            <Button variant="pill" className="w-full h-14" size="lg">
              Withdraw $298.50
            </Button>
            
            <p className="body-sm text-muted-foreground text-center">
              Minimum withdrawal: $25. Processing time: 1-3 business days
            </p>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="modern-card">
          <CardContent className="p-0">
            <Tabs defaultValue="streams" className="w-full">
              <div className="p-6 border-b border-border/20">
                <TabsList className="grid w-full grid-cols-3 bg-secondary/30 rounded-2xl">
                  <TabsTrigger value="streams" className="rounded-xl">Streams</TabsTrigger>
                  <TabsTrigger value="royalties" className="rounded-xl">Royalties</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl">History</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="streams" className="p-6 space-y-3">
                <h3 className="heading-md">Streaming Revenue</h3>
                <div className="space-y-3">
                  <div className="list-item">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-green-500 font-bold text-sm">S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">Spotify</p>
                        <span className="body-md font-bold">$164.80</span>
                      </div>
                      <p className="body-sm text-muted-foreground">8.2K streams</p>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-blue-500 font-bold text-sm">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">Apple Music</p>
                        <span className="body-md font-bold">$89.30</span>
                      </div>
                      <p className="body-sm text-muted-foreground">3.1K streams</p>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-orange-500 font-bold text-sm">B</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">Boomplay</p>
                        <span className="body-md font-bold">$52.40</span>
                      </div>
                      <p className="body-sm text-muted-foreground">2.5K streams</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="royalties" className="p-6">
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="body-lg text-muted-foreground">Royalty splits and collaborator payments will appear here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="p-6 space-y-4">
                <h3 className="heading-md">Transaction History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-l-4 border-success bg-success/5 rounded-r-2xl">
                    <div>
                      <p className="body-lg font-semibold">Payout Completed</p>
                      <p className="body-sm text-muted-foreground">Dec 15, 2024</p>
                    </div>
                    <p className="body-md font-bold text-success">+$125.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border-l-4 border-primary bg-primary/5 rounded-r-2xl">
                    <div>
                      <p className="body-lg font-semibold">Streaming Revenue</p>
                      <p className="body-sm text-muted-foreground">Dec 10, 2024</p>
                    </div>
                    <p className="body-md font-bold text-primary">+$67.30</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};