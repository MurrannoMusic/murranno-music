import { User, Music, Check, Edit2 } from 'lucide-react';
import mmLogo from "@/assets/mm_logo.png";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { useUserType } from '@/hooks/useUserType';
import { useToast } from '@/hooks/use-toast';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { useArtistProfile } from '@/hooks/useArtistProfile';
import { supabase } from '@/integrations/supabase/client';

export const Profile = () => {
  const { currentUser } = useUserType();
  const { toast } = useToast();
  const { profile, uploadProfileImage } = useArtistProfile();
  
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState(profile?.spotify_url || '');
  const [appleMusicUrl, setAppleMusicUrl] = useState(profile?.apple_music_url || '');
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

  const handleSaveLinks = async () => {
    if (validateUrls()) {
      try {
        const { data, error } = await supabase.functions.invoke('update-artist-profile', {
          body: {
            spotify_url: spotifyUrl || null,
            apple_music_url: appleMusicUrl || null,
          }
        });

        if (error) throw error;

        setIsEditingLinks(false);
        toast({
          title: "Links saved successfully",
          description: "Your streaming profile links have been updated.",
        });
      } catch (error: any) {
        console.error('Error saving links:', error);
        toast({
          title: "Failed to save links",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditLinks = () => {
    setSpotifyUrl(profile?.spotify_url || '');
    setAppleMusicUrl(profile?.apple_music_url || '');
    setIsEditingLinks(true);
    setErrors({ spotify: '', appleMusic: '' });
  };

  const handleImageSelect = async (file: File) => {
    setIsUploadingImage(true);
    try {
      await uploadProfileImage(file);
      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
          <div className="flex items-center justify-between">
            <Link to="/app" className="flex items-center">
              <img src={mmLogo} alt="Murranno Music" className="h-8" />
            </Link>
            <div className="flex-1 text-center">
              <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">PROFILE</Badge>
            </div>
            <div className="w-9" />
          </div>
        </div>
        <div className="mobile-container space-y-4 mt-4">
          <Card className="bg-card border border-border rounded-[20px] shadow-soft">
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-muted-foreground">No profile loaded.</p>
              <Link to="/app/user-type-selection" className="text-primary hover:underline">Select user type</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="smooth-scroll">
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={mmLogo} alt="Murranno Music" className="h-8" />
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
              <ProfileImageUpload
                imageUrl={profile?.profile_image || currentUser?.avatar}
                onImageSelect={handleImageSelect}
                disabled={isUploadingImage}
              />
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
              {!isEditingLinks && (profile?.spotify_url || profile?.apple_music_url) && (
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
            {!isEditingLinks && !profile?.spotify_url && !profile?.apple_music_url ? (
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
                {profile?.spotify_url && (
                  <div className="p-3 bg-secondary/20 rounded-[12px] border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Spotify</p>
                    <a 
                      href={profile.spotify_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {profile.spotify_url}
                    </a>
                  </div>
                )}
                {profile?.apple_music_url && (
                  <div className="p-3 bg-secondary/20 rounded-[12px] border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Apple Music</p>
                    <a 
                      href={profile.apple_music_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {profile.apple_music_url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};