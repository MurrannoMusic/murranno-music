import { Music, Clock, Upload, Play, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';

import { StatsGrid } from '@/components/stats/StatsGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { useStats } from '@/hooks/useStats';

export const ArtistDashboard = () => {
  const { currentUser } = useUserType();
  const { getStatsAsItems } = useStats();

  const recentActivity = [
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

  const stats = getStatsAsItems();

  return (
    <PageContainer className="smooth-scroll">
      {/* Modern Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              ARTIST
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-4">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="modern-card">
            <div className="p-5">
              <div className="portfolio-value">{stats[1]?.value}</div>
              <div className="body-sm text-muted-foreground">Total Earnings</div>
              <div className="portfolio-change positive">+12%</div>
            </div>
          </div>
          <div className="modern-card">
            <div className="p-5">
              <div className="portfolio-value">{stats[0]?.value}</div>
              <div className="body-sm text-muted-foreground">Total Streams</div>
              <div className="portfolio-change positive">+23%</div>
            </div>
          </div>
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
            <Link to="/analytics">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-accent/10">
                View Analytics
              </Button>
            </Link>
            <Link to="/earnings">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30 hover:bg-primary/10">
                Check Earnings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <FloatingActionButton />
    </PageContainer>
  );
};