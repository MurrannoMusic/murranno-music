import { StreamData, AnalyticsStats, FilterOption } from '@/types/analytics';

export const weeklyStreamData: StreamData[] = [
  { label: 'Wed', current: 10, previous: 55, date: '2024-10-01' },
  { label: 'Thu', current: 30, previous: 20, date: '2024-10-02' },
  { label: 'Fri', current: 30, previous: 50, date: '2024-10-03' },
  { label: 'Sat', current: 4182, previous: 75, date: '2024-10-04' },
  { label: 'Sun', current: 5120, previous: 4200, date: '2024-10-05' },
  { label: 'Mon', current: 3560, previous: 3215, date: '2024-10-06' },
  { label: 'Tue', current: 2000, previous: 2851, date: '2024-10-07' },
];

export const monthlyStreamData: StreamData[] = [
  { label: 'Week 1', current: 2500, previous: 2200, date: '2024-10-01' },
  { label: 'Week 2', current: 3200, previous: 2800, date: '2024-10-08' },
  { label: 'Week 3', current: 4100, previous: 3500, date: '2024-10-15' },
  { label: 'Week 4', current: 5000, previous: 4200, date: '2024-10-22' },
];

export const ninetyDaysStreamData: StreamData[] = [
  { label: 'Aug', current: 12000, previous: 10500, date: '2024-08-01' },
  { label: 'Sep', current: 15000, previous: 12800, date: '2024-09-01' },
  { label: 'Oct', current: 18500, previous: 14200, date: '2024-10-01' },
];

export const yearlyStreamData: StreamData[] = [
  { label: 'Jan', current: 8000, previous: 7000, date: '2024-01-01' },
  { label: 'Feb', current: 9200, previous: 7500, date: '2024-02-01' },
  { label: 'Mar', current: 11000, previous: 8200, date: '2024-03-01' },
  { label: 'Apr', current: 12500, previous: 9800, date: '2024-04-01' },
  { label: 'May', current: 14000, previous: 11200, date: '2024-05-01' },
  { label: 'Jun', current: 15800, previous: 12500, date: '2024-06-01' },
  { label: 'Jul', current: 17200, previous: 13800, date: '2024-07-01' },
  { label: 'Aug', current: 18500, previous: 15000, date: '2024-08-01' },
  { label: 'Sep', current: 19800, previous: 16200, date: '2024-09-01' },
  { label: 'Oct', current: 21000, previous: 17500, date: '2024-10-01' },
];

export const weeklyStats: AnalyticsStats = {
  currentTotal: 14902,
  currentDateRange: '01 - 07 Oct',
  previousTotal: 10416,
  previousDateRange: '24 - 30 Sep',
  percentageChange: 43.1,
};

export const monthlyStats: AnalyticsStats = {
  currentTotal: 54800,
  currentDateRange: '01 - 31 Oct',
  previousTotal: 48200,
  previousDateRange: '01 - 30 Sep',
  percentageChange: 13.7,
};

export const ninetyDaysStats: AnalyticsStats = {
  currentTotal: 145500,
  currentDateRange: '01 Aug - 31 Oct',
  previousTotal: 125000,
  previousDateRange: '01 May - 31 Jul',
  percentageChange: 16.4,
};

export const yearlyStats: AnalyticsStats = {
  currentTotal: 458000,
  currentDateRange: 'Jan - Oct 2024',
  previousTotal: 385000,
  previousDateRange: 'Jan - Oct 2023',
  percentageChange: 19.0,
};

export const labelOptions: FilterOption[] = [
  { id: 'all', name: 'All', category: 'label' },
  { id: 'indie-label', name: 'Indie Label', category: 'label' },
  { id: 'major-label', name: 'Major Label', category: 'label' },
];

export const artistOptions: FilterOption[] = [
  { id: 'all', name: 'All', category: 'artist' },
  { id: 'artist-1', name: 'John Doe', category: 'artist' },
  { id: 'artist-2', name: 'Jane Smith', category: 'artist' },
  { id: 'artist-3', name: 'Mike Johnson', category: 'artist' },
];

export const releaseOptions: FilterOption[] = [
  { id: 'all', name: 'All', category: 'release' },
  { id: 'release-1', name: 'Summer Vibes', category: 'release' },
  { id: 'release-2', name: 'Midnight Dreams', category: 'release' },
  { id: 'release-3', name: 'City Lights', category: 'release' },
];

export const trackOptions: FilterOption[] = [
  { id: 'all', name: 'All', category: 'track' },
  { id: 'track-1', name: 'Summer Vibes - Title Track', category: 'track' },
  { id: 'track-2', name: 'Midnight Dreams - Remix', category: 'track' },
  { id: 'track-3', name: 'City Lights - Acoustic', category: 'track' },
];

export const countryOptions: FilterOption[] = [
  { id: 'all', name: 'All', category: 'country' },
  { id: 'us', name: 'United States', category: 'country' },
  { id: 'uk', name: 'United Kingdom', category: 'country' },
  { id: 'ng', name: 'Nigeria', category: 'country' },
  { id: 'ca', name: 'Canada', category: 'country' },
];

export const storeOptions: FilterOption[] = [
  { id: 'all', name: 'All', category: 'store' },
  { id: 'spotify', name: 'Spotify', category: 'store' },
  { id: 'apple-music', name: 'Apple Music', category: 'store' },
  { id: 'youtube-music', name: 'YouTube Music', category: 'store' },
  { id: 'amazon-music', name: 'Amazon Music', category: 'store' },
];
