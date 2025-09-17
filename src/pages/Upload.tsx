import { useState } from 'react';
import { ArrowLeft, Upload as UploadIcon, Music, Image, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { PageContainer } from '@/components/layout/PageContainer';

export const Upload = () => {
  const [trackTitle, setTrackTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  
  // DSP toggles
  const [dsps, setDsps] = useState({
    spotify: true,
    appleMusic: true,
    boomplay: true,
    audiomack: true,
    deezer: false,
    youtubeMusic: false,
  });

  const handleDspToggle = (platform: keyof typeof dsps) => {
    setDsps(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement upload logic
    console.log('Upload data:', { trackTitle, artist, genre, releaseDate, description, dsps });
  };

  return (
    <PageContainer>
      {/* Consistent Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              UPLOAD
            </Badge>
          </div>
          
          {/* Avatar Dropdown (Right) */}
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Section */}
          <Card className="bg-card border border-border rounded-[20px] shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
                <Music className="h-5 w-5 text-primary" />
                Audio File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-[16px] p-8 text-center bg-secondary/20">
                <UploadIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-card-foreground font-semibold mb-2">Upload your track</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports MP3, WAV, FLAC (Max 100MB)
                </p>
                <button type="button" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-[12px] transition-all duration-200">
                  Choose File
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Artwork Upload */}
          <Card className="bg-card border border-border rounded-[20px] shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
                <Image className="h-5 w-5 text-primary" />
                Artwork
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-[16px] p-6 text-center bg-secondary/20">
                <Image className="h-8 w-8 mx-auto text-primary mb-3" />
                <p className="text-xs text-muted-foreground mb-3">
                  3000x3000px recommended
                </p>
                <button type="button" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 px-4 rounded-[8px] transition-all duration-200 border border-border">
                  Upload Artwork
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Track Information */}
          <Card className="bg-card border border-border rounded-[20px] shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                Track Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-muted-foreground mb-2 block">Track Title</Label>
                <input
                  id="title"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Enter track title"
                  className="w-full p-3 bg-input border border-border rounded-[12px] text-foreground placeholder-muted-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="artist" className="text-sm font-medium text-muted-foreground mb-2 block">Artist Name</Label>
                <input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  className="w-full p-3 bg-input border border-border rounded-[12px] text-foreground placeholder-muted-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="genre" className="text-sm font-medium text-muted-foreground mb-2 block">Genre</Label>
                <select 
                  value={genre} 
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-[12px] text-foreground"
                >
                  <option value="">Select genre</option>
                  <option value="afrobeats">Afrobeats</option>
                  <option value="hiphop">Hip Hop</option>
                  <option value="rnb">R&B</option>
                  <option value="pop">Pop</option>
                  <option value="gospel">Gospel</option>
                  <option value="highlife">Highlife</option>
                  <option value="amapiano">Amapiano</option>
                </select>
              </div>

              <div>
                <Label htmlFor="releaseDate" className="text-sm font-medium text-muted-foreground mb-2 block">Release Date</Label>
                <input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-[12px] text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-muted-foreground mb-2 block">Description (Optional)</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your fans about this track..."
                  className="w-full p-3 bg-input border border-border rounded-[12px] text-foreground placeholder-muted-foreground"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit for Review
          </button>
        </form>
      </div>
    </PageContainer>
  );
};