import { useState } from 'react';
import { StatItem, ArtistStats, LabelStats } from '@/types/stats';
import { mockLabelStats } from '@/utils/mockData';

export const useStats = () => {
  const [stats] = useState<LabelStats>(mockLabelStats);

  const getArtistStats = (artistId?: string): ArtistStats => {
    // Mock individual artist stats
    const artistSpecificStats = {
      'a1': { streams: '12.5K', earnings: '₦342', followers: '2.1K', releases: '8' },
      'a2': { streams: '8.9K', earnings: '₦234', followers: '1.8K', releases: '6' }, 
      'a3': { streams: '6.2K', earnings: '₦178', followers: '1.2K', releases: '4' }
    };

    if (artistId && artistSpecificStats[artistId as keyof typeof artistSpecificStats]) {
      return artistSpecificStats[artistId as keyof typeof artistSpecificStats];
    }

    return {
      streams: stats.streams,
      earnings: stats.earnings,
      followers: stats.followers,
      releases: stats.releases
    };
  };

  const getLabelStats = (): LabelStats => stats;

  const getStatsAsItems = (artistId?: string): StatItem[] => {
    const currentStats = getArtistStats(artistId);
    
    return [
      { title: 'Total Streams', value: currentStats.streams, change: '+23%', changeType: 'positive' },
      { title: 'Earnings', value: currentStats.earnings, change: '+12%', changeType: 'positive' },
      { title: 'Followers', value: currentStats.followers, change: '+5%', changeType: 'positive' },
      { title: 'Releases', value: currentStats.releases, change: '+2', changeType: 'positive' }
    ];
  };

  return {
    getArtistStats,
    getLabelStats,
    getStatsAsItems
  };
};