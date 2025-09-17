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
          {/* Avatar (Left) */}
          <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-4 py-1">
              LABEL
            </Badge>
          </div>
          
          {/* Menu Icon (Right) */}
          <Link to="/" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center mt-4">
          <h1 className="heading-lg">{headerTitle}</h1>
          <p className="body-md text-muted-foreground">{headerSubtitle}</p>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-4">
        {/* Artist Selector */}
        <ArtistSelector />
        
        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="modern-card">
            <div className="p-5">
              <div className="portfolio-value">{stats[1]?.value}</div>
              <div className="body-sm text-muted-foreground">Total Earnings</div>
              <div className="portfolio-change positive">{stats[1]?.change}</div>
            </div>
          </div>
          <div className="modern-card">
            <div className="p-5">
              <div className="portfolio-value">{stats[0]?.value}</div>
              <div className="body-sm text-muted-foreground">Total Streams</div>
              <div className="portfolio-change positive">{stats[0]?.change}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="heading-md flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="list-item">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="body-lg font-semibold truncate">{activity.title}</p>
                    <span className={`body-md font-bold ${activity.type === 'success' ? 'text-success' : 'text-primary'}`}>
                      {activity.value}
                    </span>
                  </div>
                  <p className="body-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="heading-md">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link to="/upload">
              <Button variant="pill" className="w-full h-12">
                Upload Track
              </Button>
            </Link>
            <Link to="/promotions">
              <Button variant="glass" className="w-full h-12">
                Start Campaign
              </Button>
            </Link>
            <Link to="/label-analytics">
              <Button variant="outline" className="w-full h-12">
                View Analytics
              </Button>
            </Link>
            <Link to="/payout-manager">
              <Button variant="outline" className="w-full h-12">
                Manage Payouts
              </Button>
            </Link>
            <Link to="/artist-management" className="col-span-2">
              <Button variant="pill" className="w-full h-12 bg-gradient-accent">
                Manage Artists
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};