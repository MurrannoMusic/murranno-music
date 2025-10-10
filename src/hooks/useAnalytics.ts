import { useState } from 'react';
import { AnalyticsFilters, StreamData, AnalyticsStats } from '@/types/analytics';
import {
  weeklyStreamData,
  monthlyStreamData,
  ninetyDaysStreamData,
  yearlyStreamData,
  weeklyStats,
  monthlyStats,
  ninetyDaysStats,
  yearlyStats,
} from '@/utils/mockAnalytics';

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

  const getChartData = (): StreamData[] => {
    switch (activePeriod) {
      case 'week':
        return weeklyStreamData;
      case 'month':
        return monthlyStreamData;
      case '90days':
        return ninetyDaysStreamData;
      case 'year':
        return yearlyStreamData;
      default:
        return weeklyStreamData;
    }
  };

  const getStats = (): AnalyticsStats => {
    switch (activePeriod) {
      case 'week':
        return weeklyStats;
      case 'month':
        return monthlyStats;
      case '90days':
        return ninetyDaysStats;
      case 'year':
        return yearlyStats;
      default:
        return weeklyStats;
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
    chartData: getChartData(),
    stats: getStats(),
  };
};
