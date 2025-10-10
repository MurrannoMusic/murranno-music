import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { useReleases } from '@/hooks/useReleases';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ReleaseStatus } from '@/types/release';

const statusColors: Record<ReleaseStatus, string> = {
  Live: 'bg-green-500 text-white',
  Repair: 'bg-yellow-500 text-white',
  Takedown: 'bg-red-500 text-white'
};

const Releases = () => {
  const { releases, searchQuery, setSearchQuery, statusFilter, setStatusFilter, getStatusCount } = useReleases();

  return (
    <PageContainer>
      <PageHeader 
        title="Music" 
        subtitle="Your Releases"
        backTo="/artist-dashboard"
        actions={<AvatarDropdown />}
      />

      <div className="mobile-container space-y-4 pb-20">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Release title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/20 rounded-[16px] border border-border pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth ${
              statusFilter === 'All' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
            }`}
          >
            All Releases
          </button>
          <button
            onClick={() => setStatusFilter('Live')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth ${
              statusFilter === 'Live' 
                ? 'bg-green-500 text-white' 
                : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
            }`}
          >
            Live ({getStatusCount('Live')})
          </button>
          <button
            onClick={() => setStatusFilter('Repair')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth ${
              statusFilter === 'Repair' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
            }`}
          >
            Repair ({getStatusCount('Repair')})
          </button>
          <button
            onClick={() => setStatusFilter('Takedown')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth ${
              statusFilter === 'Takedown' 
                ? 'bg-red-500 text-white' 
                : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
            }`}
          >
            Takedown ({getStatusCount('Takedown')})
          </button>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Releases</h1>
        </div>

        {/* Releases Grid */}
        {releases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No releases found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {releases.map((release) => (
              <Link
                key={release.id}
                to={`/releases/${release.id}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-[20px] shadow-soft overflow-hidden transition-smooth hover:shadow-primary hover:scale-[1.02]">
                  {/* Cover Art */}
                  <div className="relative aspect-square">
                    <img
                      src={release.coverArt}
                      alt={release.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Status Badge */}
                    <Badge 
                      className={`absolute top-2 right-2 ${statusColors[release.status]} border-0`}
                    >
                      {release.status}
                    </Badge>
                  </div>

                  {/* Release Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-foreground text-sm mb-1 truncate">
                      {release.title}
                    </h3>
                    <p className="text-xs text-primary mb-1 truncate">
                      {release.type} by: {release.artist}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {release.year}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Releases;
