import { useState } from 'react';
import { Campaign, CampaignStats } from '@/types/campaign';
import { mockCampaigns, mockCampaignStats } from '@/utils/mockData';

export const useCampaigns = () => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [stats] = useState<CampaignStats>(mockCampaignStats);

  const getFilteredCampaigns = (statusFilter: string = 'all'): Campaign[] => {
    if (statusFilter === 'all') return campaigns;
    return campaigns.filter(c => c.status === statusFilter);
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants = {
      'Active': 'default',
      'Completed': 'secondary',
      'Paused': 'outline',
      'Draft': 'outline'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const getPlatformIcon = (platform: string) => {
    // This would return appropriate icons for each platform
    return platform;
  };

  return {
    campaigns,
    stats,
    getFilteredCampaigns,
    getStatusBadgeVariant,
    getPlatformIcon
  };
};