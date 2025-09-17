import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { CampaignCard } from '@/components/cards/CampaignCard';
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
    <Link to="/promotions">
      <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
        <Plus className="h-4 w-4 mr-1" />
        New Campaign
      </Button>
    </Link>
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
        {/* Campaign Stats */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-white">{stats.totalCampaigns}</p>
                <p className="text-xs text-[#8b8ba3]">Total</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stats.activeCampaigns}</p>
                <p className="text-xs text-[#8b8ba3]">Active</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stats.totalSpent}</p>
                <p className="text-xs text-[#8b8ba3]">Spent</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stats.totalReach}</p>
                <p className="text-xs text-[#8b8ba3]">Reach</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Filter */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-[#8b8ba3]" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 bg-[#0d0d1b] border-[#2d2d44] text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2d2d44]">
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign List */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">
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

        {/* Quick Actions */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Campaign Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/promotions">
                <button className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                  Create New Campaign
                </button>
              </Link>
              
              <button 
                className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]"
                onClick={exportToPDF}
              >
                Bulk Export Results
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Schedule Reports
              </button>
              
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Campaign Templates
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};