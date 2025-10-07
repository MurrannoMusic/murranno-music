import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { CampaignCard } from '@/components/cards/CampaignCard';
import { CampaignStats } from '@/components/campaigns/CampaignStats';
import { CampaignFilter } from '@/components/campaigns/CampaignFilter';
import { CampaignActions } from '@/components/campaigns/CampaignActions';
import { useCampaigns } from '@/hooks/useCampaigns';

export const CampaignManager = () => {
  const { campaigns, stats, getFilteredCampaigns, getStatusBadgeVariant } = useCampaigns();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = getFilteredCampaigns(statusFilter);

  const handleEdit = (id: string) => {
    console.log('Edit campaign:', id);
  };

  const handleViewAnalytics = (id: string) => {
    console.log('View analytics for campaign:', id);
  };

  const handlePause = (id: string) => {
    console.log('Pause/Resume campaign:', id);
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplicate campaign:', id);
  };

  const exportToPDF = () => {
    console.log('Exporting campaigns to PDF...');
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <Link to="/promotions">
        <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
          <Plus className="h-4 w-4 mr-1" />
          New Campaign
        </Button>
      </Link>
      <AvatarDropdown />
    </div>
  );

  return (
    <PageContainer>
      <PageHeader 
        title="Campaign Manager"
        subtitle="Track and manage all campaigns"
        backTo="/agency-dashboard"
        actions={headerActions}
      />

      <div className="mobile-container space-y-6 -mt-8">
        <CampaignStats stats={stats} />
        
        <CampaignFilter 
          statusFilter={statusFilter} 
          onFilterChange={setStatusFilter} 
        />

        {/* Campaign List */}
        <Card className="glass-card border border-border/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {statusFilter === 'all' ? 'All Campaigns' : `${statusFilter} Campaigns`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                getStatusBadgeVariant={getStatusBadgeVariant}
                onEdit={handleEdit}
                onViewAnalytics={handleViewAnalytics}
                onPause={handlePause}
                onDuplicate={handleDuplicate}
              />
            ))}
          </CardContent>
        </Card>

        <CampaignActions onExportToPDF={exportToPDF} />
      </div>
    </PageContainer>
  );
};