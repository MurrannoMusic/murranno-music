import { useState } from 'react';
import { ArrowLeft, Upload as UploadIcon, Music, Image, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

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
    <div className="min-h-screen bg-background mobile-safe-bottom">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <Link to="/" className="mr-3 sm:mr-4">
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </Link>
          <h1 className="mobile-heading">Upload Track</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="h-5 w-5 mr-2 text-primary" />
                Audio File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Upload your track</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports MP3, WAV, FLAC (Max 100MB)
                </p>
                <Button type="button" variant="outline" className="music-button">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Artwork Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2 text-primary" />
                Artwork
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  3000x3000px recommended
                </p>
                <Button type="button" variant="outline" size="sm">
                  Upload Artwork
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Track Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Track Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Track Title</Label>
                <Input
                  id="title"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Enter track title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="artist">Artist Name</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger>
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
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your fans about this track..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Distribution Platforms */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dsps).map(([platform, enabled]) => (
                <div key={platform} className="flex items-center justify-between">
                  <Label htmlFor={platform} className="capitalize font-medium">
                    {platform === 'appleMusic' ? 'Apple Music' : 
                     platform === 'youtubeMusic' ? 'YouTube Music' : 
                     platform}
                  </Label>
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
            className="w-full gradient-primary music-button shadow-primary" 
            size="lg"
          >
            Submit for Review
          </Button>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
};