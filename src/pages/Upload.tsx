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
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <UploadIcon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="heading-md flex items-center gap-3">
                <Music className="h-5 w-5 text-primary" />
                Audio File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border/30 rounded-2xl p-8 text-center bg-secondary/10">
                <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="body-lg font-semibold mb-2">Upload your track</p>
                <p className="body-sm text-muted-foreground mb-4">
                  Supports MP3, WAV, FLAC (Max 100MB)
                </p>
                <Button type="button" variant="pill" size="lg">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Artwork Upload */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="heading-md flex items-center gap-3">
                <Image className="h-5 w-5 text-primary" />
                Artwork
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border/30 rounded-2xl p-6 text-center bg-secondary/10">
                <Image className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                <p className="body-sm text-muted-foreground mb-3">
                  3000x3000px recommended
                </p>
                <Button type="button" variant="outline" size="sm">
                  Upload Artwork
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Track Information */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="heading-md flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                Track Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="body-md font-semibold">Track Title</Label>
                <Input
                  id="title"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Enter track title"
                  className="mt-1 h-12 rounded-xl border-border/30"
                  required
                />
              </div>

              <div>
                <Label htmlFor="artist" className="body-md font-semibold">Artist Name</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  className="mt-1 h-12 rounded-xl border-border/30"
                  required
                />
              </div>

              <div>
                <Label htmlFor="genre" className="body-md font-semibold">Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="mt-1 h-12 rounded-xl border-border/30">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="afrobeats">Afrobeats</SelectItem>
                    <SelectItem value="hiphop">Hip Hop</SelectItem>
                    <SelectItem value="rnb">R&B</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="gospel">Gospel</SelectItem>
                    <SelectItem value="highlife">Highlife</SelectItem>
                    <SelectItem value="amapiano">Amapiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="releaseDate" className="body-md font-semibold">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="mt-1 h-12 rounded-xl border-border/30"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="body-md font-semibold">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your fans about this track..."
                  className="mt-1 rounded-xl border-border/30"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Distribution Platforms */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="heading-md">Distribution Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dsps).map(([platform, enabled]) => (
                <div key={platform} className="list-item">
                  <div className="flex-1">
                    <Label htmlFor={platform} className="body-lg font-semibold capitalize">
                      {platform === 'appleMusic' ? 'Apple Music' : 
                       platform === 'youtubeMusic' ? 'YouTube Music' : 
                       platform}
                    </Label>
                  </div>
                  <Switch
                    id={platform}
                    checked={enabled}
                    onCheckedChange={() => handleDspToggle(platform as keyof typeof dsps)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="pill"
            className="w-full h-14"
            size="lg"
          >
            Submit for Review
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};