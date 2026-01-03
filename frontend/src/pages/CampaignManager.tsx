import { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { CampaignStats } from '@/components/campaigns/CampaignStats';
import { CampaignFilter } from '@/components/campaigns/CampaignFilter';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { CampaignActions } from '@/components/campaigns/CampaignActions';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCampaignActions } from '@/hooks/useCampaignActions';

export const CampaignManager = () => {
  const { campaigns, stats, getFilteredCampaigns, getStatusBadgeVariant, refetch } = useCampaigns();
  const { pauseCampaign, duplicateCampaign, viewAnalytics, editCampaign, loading } = useCampaignActions();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = getFilteredCampaigns(statusFilter);

  const handleEdit = (id: string) => {
    editCampaign(id);
  };

  const handleViewAnalytics = (id: string) => {
    viewAnalytics(id);
  };

  const handlePause = async (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      const success = await pauseCampaign(id, campaign.status);
      if (success) refetch();
    }
  };

  const handleDuplicate = async (id: string) => {
    const success = await duplicateCampaign(id);
    if (success) refetch();
  };

  const exportToPDF = () => {
    console.log('Exporting campaigns to PDF...');
  };

  return (
    <PageContainer>
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/app/agency-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 text-center">
            <Badge className="bg-secondary/15 text-secondary-foreground border-secondary/30 px-4 py-1">
              CAMPAIGN MANAGER
            </Badge>
          </div>
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 -mt-2">
        <CampaignStats stats={stats} />
        
        <CampaignFilter 
          statusFilter={statusFilter} 
          onFilterChange={setStatusFilter} 
        />

        <CampaignList
          campaigns={filteredCampaigns}
          statusFilter={statusFilter}
          getStatusBadgeVariant={getStatusBadgeVariant}
          onEdit={handleEdit}
          onViewAnalytics={handleViewAnalytics}
          onPause={handlePause}
          onDuplicate={handleDuplicate}
        />

        <CampaignActions onExportToPDF={exportToPDF} />
      </div>
    </PageContainer>
  );
};