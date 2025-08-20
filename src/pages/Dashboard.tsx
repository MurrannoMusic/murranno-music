import { Music, TrendingUp, DollarSign, Users, Play, Clock } from 'lucide-react';
import { StatCard } from '@/components/mobile/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background mobile-safe-bottom">
      {/* Header */}
      <div className="gradient-primary p-4 text-white sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="mobile-heading sm:text-2xl font-bold">Welcome back, Artist</h1>
            <p className="text-white/80 text-sm sm:text-base">Let's make some music magic</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Music className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-4 sm:space-y-6 -mt-6 sm:-mt-8">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">New streams detected</p>
                <p className="text-sm text-muted-foreground">Your track "Summer Vibes" gained 150 new streams</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-success">+150</p>
                <p className="text-xs text-muted-foreground">2h ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Promotion campaign</p>
                <p className="text-sm text-muted-foreground">TikTok campaign reached 5K users</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary">Active</p>
                <p className="text-xs text-muted-foreground">6h ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Link to="/upload">
              <Button className="w-full gradient-primary music-button" variant="default">
                Upload Track
              </Button>
            </Link>
            <Link to="/promotions">
              <Button className="w-full gradient-secondary music-button" variant="default">
                Start Campaign
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </Link>
            <Link to="/earnings">
              <Button variant="outline" className="w-full">
                Check Earnings
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