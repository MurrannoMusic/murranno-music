import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignCard } from '@/components/cards/CampaignCard';
import { Campaign } from '@/types/campaign';

interface CampaignListProps {
  campaigns: Campaign[];
  statusFilter: string;
  getStatusBadgeVariant: (status: string) => string;
  onEdit: (id: string) => void;
  onViewAnalytics: (id: string) => void;
  onPause: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const CampaignList = ({
  campaigns,
  statusFilter,
  getStatusBadgeVariant,
  onEdit,
  onViewAnalytics,
  onPause,
  onDuplicate,
}: CampaignListProps) => {
  return (
    <Card className="glass-card border border-border/20">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {statusFilter === 'all' ? 'All Campaigns' : `${statusFilter} Campaigns`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            getStatusBadgeVariant={getStatusBadgeVariant}
            onEdit={onEdit}
            onViewAnalytics={onViewAnalytics}
            onPause={onPause}
            onDuplicate={onDuplicate}
          />
        ))}
      </CardContent>
    </Card>
  );
};
