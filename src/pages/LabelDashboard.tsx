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
      {/* Label Header */}
      <div className="gradient-secondary p-6 text-white mobile-safe-top">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="mobile-heading">{headerTitle}</h1>
              <Badge variant="secondary" className="text-xs">
                LABEL
              </Badge>
            </div>
            <p className="text-white/80 text-base">{headerSubtitle}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-soft">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
        {/* Demo User Type Switcher */}
        <UserTypeDemo />
        
        {/* Artist Selector */}
        <ArtistSelector />
        
        {/* Quick Stats */}
        <StatsGrid stats={stats} />

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center mobile-subheading">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="interactive-element flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/10">
                <div className="flex-1">
                  <p className="font-semibold">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${activity.type === 'success' ? 'text-success' : 'text-primary'}`}>
                    {activity.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Link to="/upload">
              <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold" variant="default">
                Upload Track
              </Button>
            </Link>
            <Link to="/promotions">
              <Button className="w-full gradient-secondary music-button h-12 rounded-xl font-semibold" variant="default">
                Start Campaign
              </Button>
            </Link>
            <Link to="/label-analytics">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-accent/10">
                View Analytics
              </Button>
            </Link>
            <Link to="/payout-manager">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-primary/10">
                Manage Payouts
              </Button>
            </Link>
            <Link to="/artist-management">
              <Button className="w-full gradient-accent music-button h-12 rounded-xl font-semibold">
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