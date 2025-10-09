import { ArrowLeft, User, Music, Check, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { useToast } from '@/hooks/use-toast';

export const Profile = () => {
  const { currentUser } = useUserType();
  const { toast } = useToast();
  
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [appleMusicUrl, setAppleMusicUrl] = useState('');
  const [savedSpotifyUrl, setSavedSpotifyUrl] = useState('');
  const [savedAppleMusicUrl, setSavedAppleMusicUrl] = useState('');
  const [errors, setErrors] = useState({ spotify: '', appleMusic: '' });

  const validateUrls = () => {
    const newErrors = { spotify: '', appleMusic: '' };
    let isValid = true;

    if (spotifyUrl && !spotifyUrl.startsWith('https://open.spotify.com/')) {
      newErrors.spotify = 'Spotify URL must start with https://open.spotify.com/';
      isValid = false;
    }

    if (appleMusicUrl && !appleMusicUrl.startsWith('https://music.apple.com/')) {
      newErrors.appleMusic = 'Apple Music URL must start with https://music.apple.com/';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveLinks = () => {
    if (validateUrls()) {
      setSavedSpotifyUrl(spotifyUrl);
      setSavedAppleMusicUrl(appleMusicUrl);
      setIsEditingLinks(false);
      toast({
        title: "Links saved successfully",
        description: "Your streaming profile links have been updated.",
      });
    }
  };

  const handleEditLinks = () => {
    setSpotifyUrl(savedSpotifyUrl);
    setAppleMusicUrl(savedAppleMusicUrl);
    setIsEditingLinks(true);
    setErrors({ spotify: '', appleMusic: '' });
  };

  return (
    <PageContainer>
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              PROFILE
            </Badge>
          </div>
          
          {/* Avatar Dropdown (Right) */}
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-xl">
                  {(currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'NA')}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-card-foreground">{currentUser?.name ?? 'Unknown User'}</h2>
                <p className="text-sm text-muted-foreground">{currentUser?.accountType ? currentUser.accountType.toUpperCase() : ''}</p>
                <p className="text-sm text-muted-foreground">{currentUser?.email ?? ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-primary" />
                Streaming Links
              </div>
              {!isEditingLinks && (savedSpotifyUrl || savedAppleMusicUrl) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditLinks}
                  className="text-primary hover:text-primary/80"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditingLinks && !savedSpotifyUrl && !savedAppleMusicUrl ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">Connect your streaming profiles</p>
                <Button onClick={handleEditLinks} variant="outline">
                  Add Streaming Links
                </Button>
              </div>
            ) : isEditingLinks ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="spotify" className="text-sm font-medium text-card-foreground">
                    Spotify Profile Link
                  </Label>
                  <Input
                    id="spotify"
                    type="url"
                    placeholder="https://open.spotify.com/artist/..."
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    className="bg-background border-border rounded-[12px]"
                  />
                  {errors.spotify && (
                    <p className="text-sm text-destructive">{errors.spotify}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appleMusic" className="text-sm font-medium text-card-foreground">
                    Apple Music Profile Link
                  </Label>
                  <Input
                    id="appleMusic"
                    type="url"
                    placeholder="https://music.apple.com/..."
                    value={appleMusicUrl}
                    onChange={(e) => setAppleMusicUrl(e.target.value)}
                    className="bg-background border-border rounded-[12px]"
                  />
                  {errors.appleMusic && (
                    <p className="text-sm text-destructive">{errors.appleMusic}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSaveLinks} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Save Links
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditingLinks(false);
                      setErrors({ spotify: '', appleMusic: '' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {savedSpotifyUrl && (
                  <div className="p-3 bg-secondary/20 rounded-[12px] border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Spotify</p>
                    <a 
                      href={savedSpotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {savedSpotifyUrl}
                    </a>
                  </div>
                )}
                {savedAppleMusicUrl && (
                  <div className="p-3 bg-secondary/20 rounded-[12px] border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Apple Music</p>
                    <a 
                      href={savedAppleMusicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {savedAppleMusicUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};