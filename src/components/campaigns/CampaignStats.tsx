import { Card, CardContent } from '@/components/ui/card';
import { CampaignStats as CampaignStatsType } from '@/types/campaign';

interface CampaignStatsProps {
  stats: CampaignStatsType;
}

export const CampaignStats = ({ stats }: CampaignStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Card className="glass-card border border-border/20">
        <CardContent className="p-3 text-center">
          <p className="text-xl font-bold gradient-text">{stats.totalCampaigns}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Total</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border border-border/20">
        <CardContent className="p-3 text-center">
          <p className="text-xl font-bold text-primary">{stats.activeCampaigns}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Active</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border border-border/20">
        <CardContent className="p-3 text-center">
          <p className="text-xl font-bold text-accent">{stats.totalSpent}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Spent</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border border-border/20">
        <CardContent className="p-3 text-center">
          <p className="text-xl font-bold text-secondary-foreground">{stats.totalReach}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Reach</p>
        </CardContent>
      </Card>
    </div>
  );
};
