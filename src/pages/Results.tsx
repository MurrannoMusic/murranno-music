import { TrendingUp, Users, Target, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
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

  const headerActions = <AvatarDropdown />;

  return (
    <PageContainer>
      <PageHeader 
        title="Campaign Results"
        subtitle="View performance metrics"
        backTo="/agency-dashboard"
        actions={headerActions}
      />

      <div className="mobile-container space-y-4 pt-4 pb-6">
        {/* Overall Performance Stats */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="glass-card border border-border/20">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-primary">{totalMetrics.totalReach}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total Reach</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border border-border/20">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-accent">{totalMetrics.avgEngagement}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Avg Engagement</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border border-border/20">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold">{totalMetrics.totalConversions}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Conversions</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border border-border/20">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-accent">{totalMetrics.avgROI}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Avg ROI</p>
            </CardContent>
          </Card>
        </div>

        {/* Total Spent Summary */}
        <Card className="glass-card border border-border/20">
          <CardContent className="p-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold">{totalMetrics.totalSpent}</p>
          </CardContent>
        </Card>

        {/* Campaign Results List */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaignResults.map((campaign) => (
              <div key={campaign.id} className="p-3 bg-muted/20 rounded-2xl border border-border/10 space-y-2">
                {/* Campaign Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold truncate">{campaign.name}</h3>
                      <Badge 
                        variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        className="text-[10px] flex-shrink-0"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{campaign.artist}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-accent">{campaign.roi}</p>
                    <p className="text-[10px] text-muted-foreground">ROI</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/10">
                  <div className="text-center">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Users className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs font-bold">{campaign.reach}</p>
                    <p className="text-[10px] text-muted-foreground">Reach</p>
                  </div>
                  <div className="text-center">
                    <div className="w-7 h-7 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <TrendingUp className="h-3 w-3 text-accent" />
                    </div>
                    <p className="text-xs font-bold">{campaign.engagement}</p>
                    <p className="text-[10px] text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Target className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs font-bold">{campaign.conversions}</p>
                    <p className="text-[10px] text-muted-foreground">Conversions</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between pt-2 border-t border-border/10">
                  <span className="text-xs text-muted-foreground">Budget Spent</span>
                  <span className="text-sm font-bold">{campaign.spent}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Export & Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full gradient-primary font-semibold py-4 text-xs h-auto">
              <Download className="h-3 w-3 mr-2" />
              Download Full Report
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full font-semibold py-4 text-xs border-border/20 h-auto">
                Export CSV
              </Button>
              
              <Button variant="outline" className="w-full font-semibold py-4 text-xs border-border/20 h-auto">
                Share Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
