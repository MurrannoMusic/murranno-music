import { Campaign, CampaignStats } from '@/types/campaign';
import { Payout, PayoutSummary } from '@/types/payout';
import { LabelStats } from '@/types/stats';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Vibes Promo',
    artist: 'Luna Sol',
    platform: 'TikTok',
    status: 'Active',
    budget: '₦500',
    spent: '₦320',
    reach: '45.2K',
    engagement: '8.9%',
    startDate: '2024-08-15',
    type: 'TikTok'
  },
  {
    id: '2', 
    name: 'New Single Launch',
    artist: 'The Echoes',
    platform: 'Instagram',
    status: 'Completed',
    budget: '₦800',
    spent: '₦750',
    reach: '72.1K',
    engagement: '12.3%',
    startDate: '2024-07-20',
    endDate: '2024-08-10',
    type: 'Instagram'
  },
  {
    id: '3',
    name: 'Midnight Drive Push',
    artist: 'Midnight Drive', 
    platform: 'Multi-Platform',
    status: 'Active',
    budget: '₦1200',
    spent: '₦890',
    reach: '98.7K',
    engagement: '15.2%',
    startDate: '2024-08-01',
    type: 'Multi-Platform'
  }
];

export const mockPayouts: Payout[] = [
  {
    id: 1,
    artist: 'Luna Sol',
    amount: '₦87.50',
    period: 'August 2024',
    status: 'Pending',
    requestDate: '2024-09-01',
    streams: '3,250',
    type: 'Monthly'
  },
  {
    id: 2,
    artist: 'The Echoes',
    amount: '₦62.30', 
    period: 'August 2024',
    status: 'Approved',
    requestDate: '2024-09-01',
    streams: '2,180',
    type: 'Monthly'
  },
  {
    id: 3,
    artist: 'Midnight Drive',
    amount: '₦45.80',
    period: 'August 2024',
    status: 'Completed',
    requestDate: '2024-08-31',
    streams: '1,620',
    type: 'Monthly'
  }
];

export const mockLabelStats: LabelStats = {
  streams: '27.6K',
  earnings: '₦754',
  followers: '5.8K',
  releases: '18',
  totalArtists: 3,
  totalReleases: 18,
  combinedRevenue: '₦754'
};

export const mockCampaignStats: CampaignStats = {
  totalCampaigns: 8,
  activeCampaigns: 3,
  totalSpent: '₦4,250',
  totalReach: '284K'
};

export const mockPayoutSummary: PayoutSummary = {
  totalPending: 195.60,
  thisMonth: 3,
  totalAvailable: '₦195.60'
};

export const mockTopTracks = [
  {
    id: '1',
    name: 'Summer Vibes',
    plays: '12.5K',
    change: '+23%',
    changeType: 'positive' as const
  },
  {
    id: '2',
    name: 'Midnight Dreams',
    plays: '8.2K',
    change: '+15%',
    changeType: 'positive' as const
  },
  {
    id: '3',
    name: 'City Lights',
    plays: '6.8K',
    change: '-5%',
    changeType: 'negative' as const
  },
  {
    id: '4',
    name: 'Ocean Breeze',
    plays: '4.1K',
    change: '+8%',
    changeType: 'positive' as const
  }
];