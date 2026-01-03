import { Music, Clock, TrendingUp, Users, Zap, BarChart3, Upload, Play, DollarSign } from 'lucide-react';
import { NewsCarousel } from '@/components/modern/NewsCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { UserTypeDemo } from '@/components/mobile/UserTypeDemo';
import { ArtistSelector } from '@/components/mobile/ArtistSelector';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { useStats } from '@/hooks/useStats';
import { useEffect } from 'react';
import { useDevice } from '@/hooks/useDevice';
import { useGeolocation } from '@/hooks/useGeolocation';

export const Dashboard = () => {
  const { currentUser, isLabel, isAgency, isArtist, selectedArtist } = useUserType();
  const { getStatsAsItems } = useStats();
  const navigate = useNavigate();
  const { deviceInfo, getInfo } = useDevice();
  const { getCurrentPosition, checkPermissions } = useGeolocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/app/user-type-selection', { replace: true });
    }
  }, [currentUser, navigate]);

  // Log device and location info for analytics
  useEffect(() => {
    const logAnalytics = async () => {
      // Get device info
      const info = await getInfo();
      console.log('Dashboard analytics - Device:', info);
      
      // Get location if permissions granted
      const permissions = await checkPermissions();
      if (permissions.location === 'granted') {
        const position = await getCurrentPosition();
        if (position) {
          console.log('Dashboard analytics - Location:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      }
    };

    logAnalytics();
  }, []);

  if (!currentUser) {
    return (
      <PageContainer>
        <div className="mobile-container py-8 text-center text-muted-foreground text-sm">Redirecting…</div>
      </PageContainer>
    );
  }

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
        value: "₦2,450",
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

  const stats = getStatsAsItems();
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

      <div className="mobile-container space-y-4 -mt-6">
        {/* Demo User Type Switcher */}
        <UserTypeDemo />
        
        {/* Artist Selector for Labels */}
        {isLabel && <ArtistSelector />}
        
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
              <div className="text-xl font-bold text-card-foreground">
                {stats[1]?.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Total Earnings</div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-[20px] p-4 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-xs text-success font-medium">+23%</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-card-foreground">
                {stats[0]?.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Total Streams</div>
            </div>
          </div>
        </div>

        {/* News Carousel */}
        <NewsCarousel />

        {/* Recent Activity */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-card-foreground truncate">{activity.title}</p>
                    <span className={`text-sm font-bold ${activity.type === 'success' ? 'text-success' : 'text-primary'}`}>
                      {activity.value}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
            {(isArtist || isLabel) && (
                <Link to="/app/upload">
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98]">
                    Upload Track
                  </button>
                </Link>
              )}
              
              <Link to="/app/promotions">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98]">
                  {isAgency ? 'Create Campaign' : 'Start Campaign'}
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Link to={isLabel ? "/app/label-analytics" : isAgency ? "/app/agency-dashboard" : "/app/analytics"}>
                <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-border hover:border-border/50">
                  View Analytics
                </button>
              </Link>
              
              <Link to={isLabel ? "/app/payout-manager" : "/app/earnings"}>
                <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-border hover:border-border/50">
                  {isLabel ? 'Manage Payouts' : isAgency ? 'Campaign Results' : 'Check Earnings'}
                </button>
              </Link>
            </div>

            {isLabel && (
              <Link to="/app/artist-management">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98]">
                  Manage Artists
                </button>
              </Link>
            )}
            {isAgency && (
              <Link to="/app/campaign-manager">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98]">
                  Track Campaigns
                </button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};