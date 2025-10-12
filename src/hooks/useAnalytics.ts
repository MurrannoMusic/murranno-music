import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsFilters, StreamData, AnalyticsStats } from '@/types/analytics';
import { toast } from 'sonner';

export const useAnalytics = () => {
  const [activeTab, setActiveTab] = useState('streams');
  const [activePeriod, setActivePeriod] = useState('week');
  const [filters, setFilters] = useState<AnalyticsFilters>({
    label: null,
    artist: null,
    release: null,
    track: null,
    country: null,
    store: null,
  });
  const [chartData, setChartData] = useState<StreamData[]>([]);
  const [stats, setStats] = useState<AnalyticsStats>({
    currentTotal: 0,
    currentDateRange: '',
    previousTotal: 0,
    previousDateRange: '',
    percentageChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [activePeriod, filters]);

  const getPeriodDays = (): number => {
    switch (activePeriod) {
      case 'week': return 7;
      case 'month': return 30;
      case '90days': return 90;
      case 'year': return 365;
      default: return 7;
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const period = getPeriodDays();

      const { data, error } = await supabase.functions.invoke('get-analytics-data', {
        body: { 
          period,
          artistId: filters.artist || undefined
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to fetch analytics');
      }

      // Transform backend data to chart format
      const transformedChartData: StreamData[] = Object.entries(data.streamsByDate || {}).map(([date, streams]) => ({
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        current: streams as number,
        previous: 0, // Would need historical comparison data
        date
      }));

      setChartData(transformedChartData);

      // Calculate stats
      const currentTotal = data.totalStreams || 0;
      const dateRange = `${new Date(Date.now() - period * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;

      setStats({
        currentTotal,
        currentDateRange: dateRange,
        previousTotal: 0, // Would need historical data
        previousDateRange: '',
        percentageChange: 0,
      });

    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      label: null,
      artist: null,
      release: null,
      track: null,
      country: null,
      store: null,
    });
  };

  return {
    activeTab,
    setActiveTab,
    activePeriod,
    setActivePeriod,
    filters,
    setFilters,
    resetFilters,
    chartData,
    stats,
    loading,
    refetch: fetchAnalyticsData,
  };
};
