import { useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnalyticsTabs } from '@/components/analytics/AnalyticsTabs';
import { TimePeriodFilter } from '@/components/analytics/TimePeriodFilter';
import { StatsComparison } from '@/components/analytics/StatsComparison';
import { StreamsChart } from '@/components/analytics/StreamsChart';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsTab, TimePeriod } from '@/types/analytics';

const analyticsTabs: AnalyticsTab[] = [
  { id: 'streams', label: 'Streams' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'stores', label: 'Stores' },
  { id: 'audience', label: 'Audience' },
];

const timePeriods: TimePeriod[] = [
  { id: 'week', label: 'Week', days: 7 },
  { id: 'month', label: 'Month', days: 30 },
  { id: '90days', label: '90 Days', days: 90 },
  { id: 'year', label: 'Year', days: 365 },
];

export const Analytics = () => {
  const [showFilters, setShowFilters] = useState(false);
  const {
    activeTab,
    setActiveTab,
    activePeriod,
    setActivePeriod,
    filters,
    resetFilters,
    chartData,
    stats,
  } = useAnalytics();

  const handleUpdateFilters = () => {
    setShowFilters(false);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between mb-4">
          <Link to="/app/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              ANALYTICS
            </Badge>
          </div>
          
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4 pb-20">
        {/* Analytics Tabs */}
        <AnalyticsTabs 
          tabs={analyticsTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Page Title & Filter Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            {analyticsTabs.find(tab => tab.id === activeTab)?.label}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="border border-border rounded-[16px] px-4 py-2"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Time Period Filter */}
        <TimePeriodFilter
          periods={timePeriods}
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {/* Stats Comparison Card */}
        <StatsComparison 
          stats={stats}
          label={analyticsTabs.find(tab => tab.id === activeTab)?.label || 'Streams'}
        />

        {/* Chart */}
        <StreamsChart data={chartData} />
      </div>

      {/* Filters Sheet */}
      <AnalyticsFilters
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onReset={resetFilters}
        onUpdate={handleUpdateFilters}
      />
    </PageContainer>
  );
};
