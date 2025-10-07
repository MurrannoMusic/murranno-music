import { Card, CardContent } from '@/components/ui/card';
import { CampaignStats as CampaignStatsType } from '@/types/campaign';

interface CampaignStatsProps {
  stats: CampaignStatsType;
}

export const CampaignStats = ({ stats }: CampaignStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="glass-card border border-border/20">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{stats.totalCampaigns}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Campaigns</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border border-border/20">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stats.activeCampaigns}</p>
          <p className="text-xs text-muted-foreground mt-1">Active</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border border-border/20">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-accent">{stats.totalSpent}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Spent</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border border-border/20">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-secondary-foreground">{stats.totalReach}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Reach</p>
        </CardContent>
      </Card>
    </div>
  );
};
