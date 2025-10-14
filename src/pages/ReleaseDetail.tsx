import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useReleases } from '@/hooks/useReleases';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Share2, ExternalLink } from 'lucide-react';
import { ReleaseStatus } from '@/types/release';
import { toast } from 'sonner';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

const statusColors: Record<ReleaseStatus, string> = {
  Live: 'bg-green-500 text-white',
  Repair: 'bg-yellow-500 text-white',
  Takedown: 'bg-red-500 text-white'
};

const ReleaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReleaseById } = useReleases();
  
  const release = id ? getReleaseById(id) : undefined;

  if (!release) {
    return (
      <PageContainer>
        <PageHeader title="Release Not Found" backTo="/releases" />
        <div className="mobile-container py-12 text-center">
          <p className="text-muted-foreground">This release could not be found.</p>
          <Button onClick={() => navigate('/releases')} className="mt-4">
            Back to Releases
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleShareSmartlink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: release.title,
          text: `Check out ${release.title} by ${release.artist}`,
          url: release.smartlink
        });
      } else {
        await navigator.clipboard.writeText(release.smartlink);
        toast.success('Smartlink copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share smartlink');
    }
  };

  const handleFilterInAnalytics = () => {
    navigate(`/analytics?release=${release.id}`);
  };

  // Extract Cloudinary public ID from URL
  const getPublicIdFromUrl = (url: string) => {
    if (url.includes('cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length > 1) {
        const pathParts = parts[1].split('/');
        const publicIdParts = pathParts.filter(p => !p.startsWith('v'));
        return publicIdParts.join('/').replace(/\.[^/.]+$/, '');
      }
    }
    return null;
  };

  const coverArtPublicId = getPublicIdFromUrl(release.coverArt);

  return (
    <PageContainer>
      <PageHeader title="Release Details" backTo="/releases" />

      <div className="pb-20">
        {/* Hero Section with Blurred Background */}
        <div 
          className="relative min-h-[400px] flex items-center justify-center px-4 py-12"
          style={{
            backgroundImage: coverArtPublicId ? 'none' : `url(${release.coverArt})`,
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
              ) : (
                <img
                  src={release.coverArt}
                  alt={release.title}
                  className="w-48 h-48 rounded-[20px] shadow-2xl"
                />
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
              {release.type} by: {release.artist}
            </p>
            <p className="text-white/80">
              Release Date: {release.releaseDate}
            </p>
          </div>
        </div>

        <div className="mobile-container space-y-6 mt-6">
          {/* Metadata Section */}
          <div className="bg-card border border-border rounded-[20px] shadow-soft p-6">
            <h2 className="text-sm font-bold text-muted-foreground mb-4 tracking-wider">
              METADATA
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Genre:</span>
                <span className="text-foreground font-medium">{release.metadata.genre}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Language:</span>
                <span className="text-foreground font-medium">{release.metadata.language}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Label:</span>
                <span className="text-foreground font-medium">{release.metadata.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Copyright:</span>
                <span className="text-foreground font-medium text-sm">{release.metadata.copyright}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">UPC/EAN:</span>
                <span className="text-foreground font-medium">{release.metadata.upcEan}</span>
              </div>
            </div>
          </div>

          {/* Smartlink Section */}
          <div className="bg-card border border-border rounded-[20px] shadow-soft p-6">
            <h2 className="text-sm font-bold text-muted-foreground mb-4 tracking-wider">
              SMARTLINK
            </h2>
            <a
              href={release.smartlink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline break-all"
            >
              {release.smartlink}
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
            </a>
          </div>

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
    </PageContainer>
  );
};

export default ReleaseDetail;
