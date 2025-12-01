import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SlidersHorizontal, Share2, ExternalLink, Music, DollarSign, Play, Copy } from 'lucide-react';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { useReleaseDetail } from '@/hooks/useReleaseDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { useShare } from '@/hooks/useShare';
import { useClipboard } from '@/hooks/useClipboard';
import { TwoTierHeader } from '@/components/layout/TwoTierHeader';


const statusColors: Record<string, string> = {
  Live: 'bg-green-500 text-white',
  Published: 'bg-green-500 text-white',
  Draft: 'bg-gray-500 text-white',
  Repair: 'bg-yellow-500 text-white',
  Takedown: 'bg-red-500 text-white'
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const ReleaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { release, loading } = useReleaseDetail(id);
  const { shareUrl } = useShare();
  const { copySmartlink } = useClipboard();


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark mobile-safe-bottom">
        <TwoTierHeader title="RELEASE DETAILS" backTo="/app/releases" />
        <div className="mobile-container pt-[120px] pb-6 space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-screen bg-gradient-dark mobile-safe-bottom">
        <TwoTierHeader title="RELEASE DETAILS" backTo="/app/releases" />
        <div className="mobile-container pt-[120px] pb-6 text-center">
          <p className="text-muted-foreground">This release could not be found.</p>
          <Button onClick={() => navigate('/app/releases')} className="mt-4">
            Back to Releases
          </Button>
        </div>
      </div>
    );
  }


  const handleShareSmartlink = async () => {
    const smartlink = release.smartlink || window.location.href;
    await shareUrl(
      smartlink,
      release.title,
      `Check out ${release.title} by ${release.artist_name}`
    );
  };

  const handleFilterInAnalytics = () => {
    navigate(`/app/analytics?release=${release.id}`);
  };


  const getPublicIdFromUrl = (url: string | null) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    const parts = url.split('/upload/');
    if (parts.length > 1) {
      const pathParts = parts[1].split('/');
      const publicIdParts = pathParts.filter(p => !p.startsWith('v'));
      return publicIdParts.join('/').replace(/\.[^/.]+$/, '');
    }
    return null;
  };

  const coverArtPublicId = getPublicIdFromUrl(release.cover_art_url);

  return (
    <div className="min-h-screen bg-gradient-dark mobile-safe-bottom">
      <TwoTierHeader 
        title="RELEASE DETAILS" 
        backTo="/app/releases"
        actionIcon={<Share2 className="w-4 h-4" />}
        onAction={handleShareSmartlink}
      />

      <div className="pt-[120px] pb-20">
        {/* Hero Section with Blurred Background */}
        <div 
          className="relative min-h-[400px] flex items-center justify-center px-4 py-12"
          style={{
            backgroundImage: coverArtPublicId || !release.cover_art_url ? 'none' : `url(${release.cover_art_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Blur Overlay */}
          <div className="absolute inset-0 backdrop-blur-3xl bg-black/60" />
          {coverArtPublicId && (
            <div className="absolute inset-0 opacity-50">
              <CloudinaryImage 
                publicId={coverArtPublicId} 
                alt={release.title}
                width={1920}
                height={1080}
                className="w-full h-full object-cover blur-3xl"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            {/* Album Art */}
            <div className="relative inline-block mb-6">
              {coverArtPublicId ? (
                <CloudinaryImage 
                  publicId={coverArtPublicId} 
                  alt={release.title}
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-[20px] shadow-2xl"
                />
              ) : release.cover_art_url ? (
                <img
                  src={release.cover_art_url}
                  alt={release.title}
                  className="w-48 h-48 rounded-[20px] shadow-2xl"
                />
              ) : (
                <div className="w-48 h-48 rounded-[20px] shadow-2xl bg-primary/20 flex items-center justify-center">
                  <Music className="h-16 w-16 text-primary" />
                </div>
              )}
              <Badge 
                className={`absolute top-2 right-2 ${statusColors[release.status]} border-0`}
              >
                {release.status}
              </Badge>
            </div>

            {/* Release Info */}
            <h1 className="text-3xl font-bold text-white mb-2">{release.title}</h1>
            <p className="text-white/90 text-lg mb-1">
              {release.release_type} by: {release.artist_name}
            </p>
            <p className="text-white/80">
              Release Date: {new Date(release.release_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mobile-container space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card border border-border rounded-[20px] shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">{formatNumber(release.total_streams)}</p>
                    <p className="text-xs text-muted-foreground">Total Streams</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-[20px] shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">₦{release.total_earnings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracks List */}
          {release.tracks.length > 0 && (
            <Card className="bg-card border border-border rounded-[20px] shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
                  <Music className="h-5 w-5 text-primary" />
                  Tracks ({release.tracks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {release.tracks.map((track) => (
                  <div key={track.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px] border border-border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-bold text-muted-foreground w-6">{track.track_number}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(track.streams)} streams</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDuration(track.duration)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Metadata Section */}
          <div className="bg-card border border-border rounded-[20px] shadow-soft p-6">
            <h2 className="text-sm font-bold text-muted-foreground mb-4 tracking-wider">
              METADATA
            </h2>
            <div className="space-y-3">
              {release.genre && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Genre:</span>
                  <span className="text-foreground font-medium">{release.genre}</span>
                </div>
              )}
              {release.language && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="text-foreground font-medium">{release.language}</span>
                </div>
              )}
              {release.label && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Label:</span>
                  <span className="text-foreground font-medium">{release.label}</span>
                </div>
              )}
              {release.copyright && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Copyright:</span>
                  <span className="text-foreground font-medium text-sm">{release.copyright}</span>
                </div>
              )}
              {release.upc_ean && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">UPC/EAN:</span>
                  <span className="text-foreground font-medium">{release.upc_ean}</span>
                </div>
              )}
            </div>
          </div>

          {/* Smartlink Section */}
          {release.smartlink && (
            <div className="bg-card border border-border rounded-[20px] shadow-soft p-6">
              <h2 className="text-sm font-bold text-muted-foreground mb-4 tracking-wider">
                SMARTLINK
              </h2>
              <div className="flex items-center gap-2">
                <a
                  href={release.smartlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline break-all flex-1"
                >
                  {release.smartlink}
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copySmartlink(release.smartlink!)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleFilterInAnalytics}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-[16px] h-12 text-base font-semibold"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filter in analytics
            </Button>
            <Button
              onClick={handleShareSmartlink}
              variant="outline"
              className="w-full rounded-[16px] h-12 text-base font-semibold"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Smartlink
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDetail;
