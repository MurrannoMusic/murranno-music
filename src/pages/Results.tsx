import { ArrowLeft, TrendingUp, DollarSign, Users, Target, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';

export const Results = () => {
  const campaignResults = [
    {
      id: 1,
      name: 'TikTok Viral Push',
      artist: 'Luna Sol',
      status: 'Completed',
      reach: '125.3K',
      engagement: '18.5%',
      conversions: '4,230',
      spent: '$299',
      roi: '+285%'
    },
    {
      id: 2,
      name: 'Instagram Stories',
      artist: 'The Echoes',
      status: 'Active',
      reach: '89.2K',
      engagement: '12.8%',
      conversions: '2,150',
      spent: '$149',
      roi: '+195%'
    },
    {
      id: 3,
      name: 'YouTube Pre-roll',
      artist: 'Midnight Drive',
      status: 'Completed',
      reach: '245.7K',
      engagement: '22.1%',
      conversions: '8,940',
      spent: '$599',
      roi: '+420%'
    }
  ];

  const totalMetrics = {
    totalReach: '460.2K',
    avgEngagement: '17.8%',
    totalConversions: '15,320',
    totalSpent: '$1,047',
    avgROI: '+300%'
  };

  return (
    <PageContainer>
      {/* Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/agency-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-accent/15 text-accent border-accent/30 px-4 py-1">
              CAMPAIGN RESULTS
            </Badge>
          </div>
          
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
        {/* Overall Performance */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Reach</p>
                <p className="text-xl font-bold text-primary">{totalMetrics.totalReach}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Engagement</p>
                <p className="text-xl font-bold text-accent">{totalMetrics.avgEngagement}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Conversions</p>
                <p className="text-xl font-bold">{totalMetrics.totalConversions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg ROI</p>
                <p className="text-xl font-bold text-accent">{totalMetrics.avgROI}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-lg font-bold">{totalMetrics.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Results */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Campaign Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaignResults.map((campaign) => (
              <div key={campaign.id} className="p-4 bg-muted/20 rounded-xl border border-border/10 space-y-3">
                {/* Campaign Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold">{campaign.name}</h3>
                      <Badge 
                        variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{campaign.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">{campaign.roi}</p>
                    <p className="text-xs text-muted-foreground">ROI</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/10">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-bold">{campaign.reach}</p>
                    <p className="text-xs text-muted-foreground">Reach</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-xs font-bold">{campaign.engagement}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-bold">{campaign.conversions}</p>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <span className="text-xs text-muted-foreground">Budget Spent</span>
                  <span className="text-sm font-bold">{campaign.spent}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Export & Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full gradient-primary font-semibold py-6 text-sm">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full font-semibold py-6 text-xs border-border/20">
                Export CSV
              </Button>
              
              <Button variant="outline" className="w-full font-semibold py-6 text-xs border-border/20">
                Share Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
