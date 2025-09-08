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
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-primary">{stats.totalCampaigns}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{stats.activeCampaigns}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{stats.totalSpent}</p>
                <p className="text-xs text-muted-foreground">Spent</p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{stats.totalReach}</p>
                <p className="text-xs text-muted-foreground">Reach</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Filter */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 bg-muted/20 border-border/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/20">
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Campaign Actions</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Link to="/promotions">
              <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold">
                Create New Campaign
              </Button>
            </Link>
            <Button 
              className="w-full gradient-secondary music-button h-12 rounded-xl font-semibold"
              onClick={exportToPDF}
            >
              Bulk Export Results
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
              Schedule Reports
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
              Campaign Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};