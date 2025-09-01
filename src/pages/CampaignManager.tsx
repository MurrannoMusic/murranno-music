import { useState } from 'react';
import { ArrowLeft, Target, Play, Pause, Download, FileText, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

export const CampaignManager = () => {
  const [campaigns] = useState([
    {
      id: 1,
      artist: 'Luna Sol',
      title: 'TikTok Viral Push',
      status: 'Active',
      platform: 'TikTok',
      reach: '25.3K',
      engagement: '4.2%',
      budget: '$299',
      spent: '$187',
      remaining: '5 days',
      startDate: '2024-08-15',
      impressions: '89.2K',
      clicks: '3.7K'
    },
    {
      id: 2,
      artist: 'The Echoes',
      title: 'Instagram Stories Campaign',
      status: 'Active',
      platform: 'Instagram',
      reach: '12.1K',
      engagement: '3.8%',
      budget: '$149',
      spent: '$89',
      remaining: '12 days',
      startDate: '2024-08-20',
      impressions: '45.6K',
      clicks: '1.8K'
    },
    {
      id: 3,
      artist: 'Midnight Drive',
      title: 'YouTube Pre-roll',
      status: 'Completed',
      platform: 'YouTube',
      reach: '45.7K',
      engagement: '2.9%',
      budget: '$599',
      spent: '$599',
      remaining: 'Complete',
      startDate: '2024-07-20',
      impressions: '156.8K',
      clicks: '4.5K'
    },
    {
      id: 4,
      artist: 'Luna Sol',
      title: 'Spotify Playlist Push',
      status: 'Paused',
      platform: 'Spotify',
      reach: '8.4K',
      engagement: '5.1%',
      budget: '$199',
      spent: '$76',
      remaining: '18 days',
      startDate: '2024-08-10',
      impressions: '23.1K',
      clicks: '1.2K'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = campaigns.filter(campaign => 
    statusFilter === 'all' || campaign.status.toLowerCase() === statusFilter
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Completed': 'secondary', 
      'Paused': 'outline'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Exporting campaigns to PDF...');
  };

  return (
    <div className="min-h-screen bg-gradient-mesh mobile-safe-bottom">
      {/* Header */}
      <div className="gradient-primary p-6 text-white mobile-safe-top">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/agency-dashboard">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="mobile-heading">Campaign Manager</h1>
            <p className="text-white/80 text-base">Track all active campaigns</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={exportToPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
        {/* Campaign Overview */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{campaigns.filter(c => c.status === 'Active').length}</p>
                <p className="text-xs text-muted-foreground">Active Campaigns</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">91.5K</p>
                <p className="text-xs text-muted-foreground">Total Reach</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">$951</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
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
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="glass-card">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Campaign Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{campaign.title}</h3>
                        <Badge variant={getStatusBadge(campaign.status) as any} className="text-xs">
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{campaign.artist} • {campaign.platform}</p>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'Active' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === 'Paused' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/20 h-8">
                      <TabsTrigger value="overview" className="text-xs h-6">Overview</TabsTrigger>
                      <TabsTrigger value="details" className="text-xs h-6">Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-3">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-primary">{campaign.reach}</p>
                          <p className="text-xs text-muted-foreground">Reach</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-primary">{campaign.engagement}</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="mt-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-semibold">{campaign.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Spent:</span>
                          <span className="font-semibold">{campaign.spent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Impressions:</span>
                          <span className="font-semibold">{campaign.impressions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Clicks:</span>
                          <span className="font-semibold">{campaign.clicks}</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Time Remaining */}
                  <div className="pt-2 border-t border-border/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Time Remaining:</span>
                      <span className="font-semibold">{campaign.remaining}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Link to="/promotions">
              <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold">
                Create Campaign
              </Button>
            </Link>
            <Button 
              className="w-full gradient-secondary music-button h-12 rounded-xl font-semibold"
              onClick={exportToPDF}
            >
              Export All Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};