import { Music, Clock, TrendingUp, Users, Zap, BarChart3, Upload, Play } from 'lucide-react';
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

export const Dashboard = () => {
  const { currentUser, isLabel, isAgency, isArtist, selectedArtist } = useUserType();
  const { getStatsAsItems } = useStats();

  const getHeaderContent = () => {
    if (isArtist) return {
      title: `Welcome back, ${currentUser.name}`,
      subtitle: "Let's make some music magic ✨",
      icon: Music,
      gradient: "gradient-primary"
    };
    if (isLabel) return {
      title: selectedArtist 
        ? `Managing: ${(currentUser as any).artists.find((a: any) => a.id === selectedArtist)?.stageName}`
        : `${(currentUser as any).companyName}`,
      subtitle: selectedArtist ? "Artist management dashboard" : "Label dashboard - manage all artists",
      icon: Users,
      gradient: "gradient-secondary"
    };
    if (isAgency) return {
      title: `${(currentUser as any).companyName}`,
      subtitle: "Campaign management hub",
      icon: Zap,
      gradient: "gradient-accent"
    };
    return {
      title: 'Welcome back',
      subtitle: "Dashboard",
      icon: Music,
      gradient: "gradient-primary"
    };
  };

  const getRecentActivity = () => {
    if (isArtist) return [
      {
        title: "New streams detected",
        description: 'Your track "Summer Vibes" gained 150 new streams',
        value: "+150",
        time: "2h ago",
        type: "success"
      },
      {
        title: "Playlist placement",
        description: "Added to 'Indie Discoveries' playlist",
        value: "New",
        time: "4h ago", 
        type: "primary"
      }
    ];
    if (isLabel) return [
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
    if (isAgency) return [
      {
        title: "Campaign milestone",
        description: "TikTok campaign reached 10K impressions",
        value: "10K",
        time: "30m ago",
        type: "success"
      },
      {
        title: "New client inquiry",
        description: "Potential new artist campaign request",
        value: "Review",
        time: "2h ago",
        type: "primary"
      }
    ];
    return [];
  };

  const stats = getStatsAsItems(selectedArtist);
  const headerContent = getHeaderContent();
  const recentActivity = getRecentActivity();
  const HeaderIcon = headerContent.icon;

  return (
    <PageContainer className="smooth-scroll">
      {/* Dynamic Header based on user type */}
      <div className={`${headerContent.gradient} p-6 text-white mobile-safe-top`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="mobile-heading">{headerContent.title}</h1>
              <Badge variant="secondary" className="text-xs">
                {currentUser.accountType.toUpperCase()}
              </Badge>
            </div>
            <p className="text-white/80 text-base">{headerContent.subtitle}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-soft">
            <HeaderIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
        {/* Demo User Type Switcher */}
        <UserTypeDemo />
        
        {/* Artist Selector for Labels */}
        {isLabel && <ArtistSelector />}
        
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
            {(isArtist || isLabel) && (
              <Link to="/upload">
                <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold" variant="default">
                  Upload Track
                </Button>
              </Link>
            )}
            <Link to="/promotions">
              <Button className="w-full gradient-secondary music-button h-12 rounded-xl font-semibold" variant="default">
                {isAgency ? 'Create Campaign' : 'Start Campaign'}
              </Button>
            </Link>
            <Link to={isLabel ? "/label-analytics" : isAgency ? "/agency-dashboard" : "/analytics"}>
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-accent/10">
                View Analytics
              </Button>
            </Link>
            <Link to={isLabel ? "/payout-manager" : "/earnings"}>
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-primary/10">
                {isLabel ? 'Manage Payouts' : isAgency ? 'Campaign Results' : 'Check Earnings'}
              </Button>
            </Link>
            {isLabel && (
              <Link to="/artist-management">
                <Button className="w-full gradient-accent music-button h-12 rounded-xl font-semibold">
                  Manage Artists
                </Button>
              </Link>
            )}
            {isAgency && (
              <Link to="/campaign-manager">
                <Button className="w-full gradient-accent music-button h-12 rounded-xl font-semibold">
                  Track Campaigns
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};