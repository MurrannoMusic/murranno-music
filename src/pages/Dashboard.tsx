import { Music, TrendingUp, DollarSign, Users, Play, Clock } from 'lucide-react';
import { StatCard } from '@/components/mobile/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { UserTypeDemo } from '@/components/mobile/UserTypeDemo';
import { ArtistSelector } from '@/components/mobile/ArtistSelector';
import { useUserType } from '@/hooks/useUserType';

export const Dashboard = () => {
  const { currentUser, isLabel, isAgency, isArtist, selectedArtist } = useUserType();

  const getWelcomeMessage = () => {
    if (isArtist) return `Welcome back, ${currentUser.name}`;
    if (isLabel) return selectedArtist 
      ? `Managing: ${(currentUser as any).artists.find((a: any) => a.id === selectedArtist)?.stageName}`
      : `Welcome back, ${currentUser.name}`;
    if (isAgency) return `Agency Dashboard - ${currentUser.name}`;
    return 'Welcome back';
  };

  const getSubtitle = () => {
    if (isArtist) return "Let's make some music magic ✨";
    if (isLabel) return selectedArtist ? "Artist management dashboard" : "Label dashboard - manage all artists";
    if (isAgency) return "Campaign management hub";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-mesh mobile-safe-bottom smooth-scroll">
      {/* Header */}
      <div className="gradient-primary p-6 text-white mobile-safe-top">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="mobile-heading">{getWelcomeMessage()}</h1>
            <p className="text-white/80 text-base">{getSubtitle()}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-soft">
            <Music className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
        {/* Demo User Type Switcher */}
        <UserTypeDemo />
        
        {/* Artist Selector for Labels */}
        {isLabel && <ArtistSelector />}
        
        {/* Quick Stats */}
        <div className="mobile-card-grid">
          <StatCard
            icon={Play}
            title="Total Streams"
            value="12.5K"
            change="+23%"
            changeType="positive"
          />
          <StatCard
            icon={DollarSign}
            title="Earnings"
            value="$342"
            change="+12%"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            title="Followers"
            value="2.1K"
            change="+5%"
            changeType="positive"
          />
          <StatCard
            icon={Music}
            title="Releases"
            value="8"
            change="+2"
            changeType="positive"
          />
        </div>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center mobile-subheading">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="interactive-element flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/10">
              <div>
                <p className="font-semibold">New streams detected</p>
                <p className="text-sm text-muted-foreground">Your track "Summer Vibes" gained 150 new streams</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-success font-bold">+150</p>
                <p className="text-xs text-muted-foreground">2h ago</p>
              </div>
            </div>
            
            <div className="interactive-element flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/10">
              <div>
                <p className="font-semibold">Promotion campaign</p>
                <p className="text-sm text-muted-foreground">TikTok campaign reached 5K users</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary font-bold">Active</p>
                <p className="text-xs text-muted-foreground">6h ago</p>
              </div>
            </div>
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
            <Link to="/earnings">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-primary/10">
                {isLabel ? 'Label Earnings' : isAgency ? 'Campaign Results' : 'Check Earnings'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <FloatingActionButton />
      <BottomNavigation />
    </div>
  );
};