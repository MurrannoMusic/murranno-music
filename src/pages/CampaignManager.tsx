import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { CampaignStats } from '@/components/campaigns/CampaignStats';
import { CampaignFilter } from '@/components/campaigns/CampaignFilter';
import { CampaignList } from '@/components/campaigns/CampaignList';
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