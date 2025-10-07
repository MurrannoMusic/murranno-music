import { Card, CardContent } from '@/components/ui/card';
import { CampaignStats as CampaignStatsType } from '@/types/campaign';

interface CampaignStatsProps {
  stats: CampaignStatsType;
}

export const CampaignStats = ({ stats }: CampaignStatsProps) => {
  return (
    <Card className="glass-card border border-border/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold">{stats.totalCampaigns}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats.activeCampaigns}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats.totalSpent}</p>
            <p className="text-xs text-muted-foreground">Spent</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats.totalReach}</p>
            <p className="text-xs text-muted-foreground">Reach</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
