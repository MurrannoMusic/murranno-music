import { useState, useMemo } from 'react';
import { Release, ReleaseStatus } from '@/types/release';
import { mockReleases } from '@/utils/mockReleases';

export const useReleases = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReleaseStatus | 'All'>('All');

  const filteredReleases = useMemo(() => {
    return mockReleases.filter((release) => {
      const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          release.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || release.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getReleaseById = (id: string): Release | undefined => {
    return mockReleases.find(release => release.id === id);
  };

  const getStatusCount = (status: ReleaseStatus): number => {
    return mockReleases.filter(release => release.status === status).length;
  };

  return {
    releases: filteredReleases,
    allReleases: mockReleases,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    getReleaseById,
    getStatusCount
  };
};
