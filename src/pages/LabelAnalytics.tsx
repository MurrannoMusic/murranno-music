import { ArrowLeft, Users, DollarSign, TrendingUp, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/mobile/StatCard';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { ArtistSelector } from '@/components/mobile/ArtistSelector';
import { useUserType } from '@/hooks/useUserType';

export const LabelAnalytics = () => {
  const { selectedArtist, currentUser, isLabel } = useUserType();

  const getLabelStats = () => {
    if (selectedArtist) {
      // Individual artist stats
      return {
        streams: '3.2K',
        earnings: '$89',
        followers: '547',
        releases: '3'
      };
    }
    // Combined label stats
    return {
      streams: '45.7K',
      earnings: '$1,234',
      followers: '8.9K',
      releases: '24'
    };
  };

  const stats = getLabelStats();

  return (
    <div className="min-h-screen bg-gradient-mesh mobile-safe-bottom">
      {/* Header */}
      <div className="gradient-primary p-6 text-white mobile-safe-top">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="mobile-heading">
              {selectedArtist ? 'Artist Analytics' : 'Label Analytics'}
            </h1>
            <p className="text-white/80 text-base">
              {selectedArtist ? 'Individual performance metrics' : 'Combined performance overview'}
            </p>
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
        {/* Artist Selector for Labels */}
        {isLabel && <ArtistSelector />}

        {/* Overview Stats */}
        <div className="mobile-card-grid">
          <StatCard
            icon={Music}
            title="Total Streams"
            value={stats.streams}
            change="+23%"
            changeType="positive"
          />
          <StatCard
            icon={DollarSign}
            title="Earnings"
            value={stats.earnings}
            change="+12%"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            title="Followers"
            value={stats.followers}
            change="+8%"
            changeType="positive"
          />
          <StatCard
            icon={TrendingUp}
            title="Releases"
            value={stats.releases}
            change="+2"
            changeType="positive"
          />
        </div>

        {/* Artist Performance Table (for labels) */}
        {!selectedArtist && isLabel && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="mobile-subheading">Artist Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(currentUser as any).artists?.map((artist: any) => (
                  <div key={artist.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/10">
                    <div>
                      <p className="font-semibold">{artist.stageName}</p>
                      <p className="text-sm text-muted-foreground">1.2K streams this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">$45</p>
                      <p className="text-xs text-success">+12%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revenue Breakdown */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/20">
                <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="mt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Streaming Revenue</span>
                    <span className="font-semibold">${selectedArtist ? '67' : '890'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Promotion Revenue</span>
                    <span className="font-semibold">${selectedArtist ? '22' : '344'}</span>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${stats.earnings}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};