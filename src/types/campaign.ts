export interface Campaign {
  id: string;
  name: string;
  artist: string;
  platform: string;
  status: 'Active' | 'Completed' | 'Paused' | 'Draft';
  budget: string;
  spent: string;
  reach: string;
  engagement: string;
  startDate: string;
  endDate?: string;
  type: 'TikTok' | 'Instagram' | 'YouTube' | 'Spotify' | 'Multi-Platform';
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: string;
  totalReach: string;
}