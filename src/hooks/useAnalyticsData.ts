import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopTrack {
  id: string;
  title: string;
  artist: string;
  streams: number;
  release: string;
}

interface PlatformData {
  platform: string;
  streams: number;
  percentage: number;
}

interface CountryData {
  country: string;
  streams: number;
  percentage: number;
}

interface EarningsData {
  date: string;
  amount: number;
}

interface ActivityData {
  date: string;
  type: string;
  description: string;
  track: string;
  platform: string;
}

export interface AnalyticsData {
  totalStreams: number;
  totalEarnings: number;
  activeReleases: number;
  topTracks: TopTrack[];
  streamsByPlatform: PlatformData[];
  streamsByCountry: CountryData[];
  earningsOverTime: EarningsData[];
  recentActivity: ActivityData[];
}

export const useAnalyticsData = (period: string = '30days', artistId?: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        const params = new URLSearchParams({ period });
        if (artistId) {
          params.append('artistId', artistId);
        }

        const { data: analyticsData, error: fetchError } = await supabase.functions.invoke(
          'fetch-analytics',
          {
            body: {},
            method: 'GET',
          }
        );

        if (fetchError) throw fetchError;

        setData(analyticsData);
      } catch (err: any) {
        console.error('Analytics fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period, artistId]);

  return { data, loading, error, refetch: () => {} };
};
