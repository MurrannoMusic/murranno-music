import { ArrowLeft, Target, Users, BarChart3, Download, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { PageContainer } from '@/components/layout/PageContainer';

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
    <PageContainer>
      {/* Modern Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-accent/15 text-accent border-accent/30 px-4 py-1">
              AGENCY
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Zap className="h-5 w-5 text-accent" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-4">
        {/* Campaign Stats */}
        <div className="grid grid-cols-2 gap-4">
          <ModernStatCard
            icon={<Target className="h-5 w-5 text-primary" />}
            title="Active Campaigns"
            value="8"
            change="+3"
            changeType="positive"
          />
          <ModernStatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Total Reach"
            value="156K"
            change="+28%"
            changeType="positive"
          />
          <ModernStatCard
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            title="Conversion Rate"
            value="3.2%"
            change="+0.5%"
            changeType="positive"
          />
          <ModernStatCard
            icon={<Download className="h-5 w-5 text-primary" />}
            title="Reports Generated"
            value="24"
            change="+6"
            changeType="positive"
          />
        </div>

        {/* Active Campaigns */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="heading-md">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="list-item">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="body-lg font-semibold">{campaign.artist}</h3>
                      <Badge 
                        variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <span className="body-md font-bold">{campaign.reach}</span>
                  </div>
                  <p className="body-sm text-muted-foreground">{campaign.campaign}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                    <span className="body-sm text-muted-foreground">Budget: {campaign.budget}</span>
                    <span className="body-sm font-medium">{campaign.remaining}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="heading-md">Agency Tools</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link to="/promotions">
              <Button variant="pill" className="w-full h-12">
                Create Campaign
              </Button>
            </Link>
            <Link to="/campaign-manager">
              <Button variant="glass" className="w-full h-12">
                Manage Campaigns
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-12">
              Export Reports
            </Button>
            <Button variant="outline" className="w-full h-12">
              Client Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};