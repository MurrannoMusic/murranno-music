import { ArrowLeft, Target, Users, BarChart3, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/mobile/StatCard';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

export const AgencyDashboard = () => {
  const activeCampaigns = [
    {
      id: 1,
      artist: 'Luna Sol',
      campaign: 'TikTok Viral Push',
      status: 'Active',
      reach: '25.3K',
      budget: '$299',
      remaining: '5 days'
    },
    {
      id: 2,
      artist: 'The Echoes',
      campaign: 'Instagram Stories',
      status: 'Active', 
      reach: '12.1K',
      budget: '$149',
      remaining: '12 days'
    },
    {
      id: 3,
      artist: 'Midnight Drive',
      campaign: 'YouTube Pre-roll',
      status: 'Completed',
      reach: '45.7K',
      budget: '$599',
      remaining: 'Complete'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh mobile-safe-bottom">
      {/* Header */}
      <div className="gradient-primary p-6 text-white mobile-safe-top">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="mobile-heading">Agency Dashboard</h1>
            <p className="text-white/80 text-base">Campaign management hub</p>
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
        {/* Campaign Stats */}
        <div className="mobile-card-grid">
          <StatCard
            icon={Target}
            title="Active Campaigns"
            value="8"
            change="+3"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            title="Total Reach"
            value="156K"
            change="+28%"
            changeType="positive"
          />
          <StatCard
            icon={BarChart3}
            title="Conversion Rate"
            value="3.2%"
            change="+0.5%"
            changeType="positive"
          />
          <StatCard
            icon={Download}
            title="Reports Generated"
            value="24"
            change="+6"
            changeType="positive"
          />
        </div>

        {/* Active Campaigns */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="interactive-element p-4 bg-muted/20 rounded-xl border border-border/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{campaign.artist}</h3>
                      <Badge 
                        variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{campaign.campaign}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Reach</p>
                    <p className="font-semibold text-sm">{campaign.reach}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold text-sm">{campaign.budget}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Time Remaining</p>
                    <p className="font-semibold text-sm">{campaign.remaining}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Agency Tools</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Link to="/promotions">
              <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold">
                Create Campaign
              </Button>
            </Link>
            <Button className="w-full gradient-secondary music-button h-12 rounded-xl font-semibold">
              Export Reports
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
              Manage Clients
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};