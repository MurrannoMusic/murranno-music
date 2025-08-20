import { ArrowLeft, DollarSign, TrendingUp, Download, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/mobile/StatCard';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

export const Earnings = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-muted-foreground" />
          </Link>
          <h1 className="text-2xl font-bold">Earnings</h1>
        </div>

        {/* Wallet Balance */}
        <Card className="gradient-primary text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Total Balance</p>
                <p className="text-3xl font-bold">$342.50</p>
              </div>
              <DollarSign className="h-12 w-12 text-white/80" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-sm">Available</p>
                <p className="text-lg font-semibold">$298.50</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Pending</p>
                <p className="text-lg font-semibold">$44.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={TrendingUp}
            title="This Month"
            value="$89.20"
            change="+15%"
            changeType="positive"
          />
          <StatCard
            icon={Download}
            title="Last Payout"
            value="$125.00"
            change="5 days ago"
            changeType="neutral"
          />
        </div>

        {/* Payout Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Payout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <CreditCard className="h-5 w-5 mb-2" />
                <span className="text-sm">Bank Transfer</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <Smartphone className="h-5 w-5 mb-2" />
                <span className="text-sm">Mobile Money</span>
              </Button>
            </div>
            
            <Button className="w-full gradient-primary music-button shadow-primary" size="lg">
              Withdraw $298.50
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Minimum withdrawal: $25. Processing time: 1-3 business days
            </p>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Tabs defaultValue="streams" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="streams">Streams</TabsTrigger>
            <TabsTrigger value="royalties">Royalties</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="streams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Streaming Revenue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Spotify</p>
                      <p className="text-sm text-muted-foreground">8.2K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold">$164.80</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div>
                      <p className="font-medium">Apple Music</p>
                      <p className="text-sm text-muted-foreground">3.1K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold">$89.30</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <div>
                      <p className="font-medium">Boomplay</p>
                      <p className="text-sm text-muted-foreground">2.5K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold">$52.40</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="royalties" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Royalty splits and collaborator payments will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border-l-4 border-success bg-success/5 rounded-r-lg">
                  <div>
                    <p className="font-medium">Payout Completed</p>
                    <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                  </div>
                  <p className="font-semibold text-success">+$125.00</p>
                </div>
                
                <div className="flex items-center justify-between p-3 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <div>
                    <p className="font-medium">Streaming Revenue</p>
                    <p className="text-sm text-muted-foreground">Dec 10, 2024</p>
                  </div>
                  <p className="font-semibold text-primary">+$67.30</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};