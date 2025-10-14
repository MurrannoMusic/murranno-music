import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Edit, Save, X, Music, Music2, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { StreamingPlatformCard } from '@/components/profile/StreamingPlatformCard';
import { SocialLinkCard } from '@/components/profile/SocialLinkCard';
import { useArtistProfile } from '@/hooks/useArtistProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { validateImageFile } from '@/utils/fileValidation';
import { toast } from '@/hooks/use-toast';

export const ArtistProfile = () => {
  const navigate = useNavigate();
  const { profile, loading, updating, updateProfile, uploadProfileImage } = useArtistProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    stage_name: '',
    bio: '',
    profile_image: '',
    spotify_url: '',
    youtube_url: '',
    apple_music_url: '',
    audiomack_url: '',
    soundcloud_url: '',
    deezer_url: '',
    tidal_url: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    twitter_url: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        stage_name: profile.stage_name || '',
        bio: profile.bio || '',
        profile_image: profile.profile_image || '',
        spotify_url: profile.spotify_url || '',
        youtube_url: profile.youtube_url || '',
        apple_music_url: profile.apple_music_url || '',
        audiomack_url: profile.audiomack_url || '',
        soundcloud_url: profile.soundcloud_url || '',
        deezer_url: profile.deezer_url || '',
        tidal_url: profile.tidal_url || '',
        instagram_url: profile.instagram_url || '',
        facebook_url: profile.facebook_url || '',
        tiktok_url: profile.tiktok_url || '',
        twitter_url: profile.twitter_url || '',
      });
    }
  }, [profile]);

  const handleImageSelect = async (file: File) => {
    const { valid, error } = validateImageFile(file);
    if (!valid) {
      toast({
        title: 'Invalid image',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    const url = await uploadProfileImage(file);
    if (url) {
      setFormData(prev => ({ ...prev, profile_image: url }));
      if (!isEditing) {
        await updateProfile({ profile_image: url });
      }
    }
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        stage_name: profile.stage_name || '',
        bio: profile.bio || '',
        profile_image: profile.profile_image || '',
        spotify_url: profile.spotify_url || '',
        youtube_url: profile.youtube_url || '',
        apple_music_url: profile.apple_music_url || '',
        audiomack_url: profile.audiomack_url || '',
        soundcloud_url: profile.soundcloud_url || '',
        deezer_url: profile.deezer_url || '',
        tidal_url: profile.tidal_url || '',
        instagram_url: profile.instagram_url || '',
        facebook_url: profile.facebook_url || '',
        tiktok_url: profile.tiktok_url || '',
        twitter_url: profile.twitter_url || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center mobile-safe-top">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark mobile-safe-top mobile-safe-bottom">
      <div className="mobile-container py-6 space-y-4">
        {/* Header */}
        <div className="bg-gradient-dark backdrop-blur-xl border-b border-border/20 -mx-4 px-4 py-3 mb-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-secondary/30"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <Badge variant="outline">
              ARTIST PROFILE
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="hover:bg-secondary/30"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <ProfileImageUpload
                imageUrl={formData.profile_image}
                onImageSelect={handleImageSelect}
                disabled={updating}
              />

              {isEditing ? (
                <div className="w-full space-y-3">
                  <Input
                    value={formData.stage_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, stage_name: e.target.value }))}
                    placeholder="Stage Name"
                    className="bg-background border-border text-center"
                  />
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Bio"
                    className="bg-background border-border resize-none"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground">{profile?.stage_name}</h2>
                  {profile?.bio && (
                    <p className="text-sm text-muted-foreground max-w-md">{profile.bio}</p>
                  )}
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div>
                      <div className="text-lg font-semibold text-foreground">0</div>
                      <div>Releases</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        {profile?.created_at && new Date(profile.created_at).getFullYear()}
                      </div>
                      <div>Member Since</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Controls */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={updating} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={updating} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Streaming Platforms */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Major Streaming Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StreamingPlatformCard
              name="Spotify for Artists"
              icon={<Music className="w-5 h-5" />}
              url={formData.spotify_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, spotify_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://open.spotify.com/artist/..."
            />
            <StreamingPlatformCard
              name="Apple Music"
              icon={<Music2 className="w-5 h-5" />}
              url={formData.apple_music_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, apple_music_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://music.apple.com/..."
            />
            <StreamingPlatformCard
              name="YouTube Music"
              icon={<Disc3 className="w-5 h-5" />}
              url={formData.youtube_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, youtube_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://youtube.com/@..."
            />
          </CardContent>
        </Card>

        {/* Additional Platforms */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Additional Streaming Platforms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StreamingPlatformCard
              name="Audiomack"
              icon={<Music className="w-5 h-5" />}
              url={formData.audiomack_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, audiomack_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://audiomack.com/..."
            />
            <StreamingPlatformCard
              name="SoundCloud"
              icon={<Music className="w-5 h-5" />}
              url={formData.soundcloud_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, soundcloud_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://soundcloud.com/..."
            />
            <StreamingPlatformCard
              name="Deezer"
              icon={<Music className="w-5 h-5" />}
              url={formData.deezer_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, deezer_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://deezer.com/..."
            />
            <StreamingPlatformCard
              name="Tidal"
              icon={<Music className="w-5 h-5" />}
              url={formData.tidal_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, tidal_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://tidal.com/..."
            />
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SocialLinkCard
              name="Instagram"
              icon={<Music className="w-5 h-5" />}
              url={formData.instagram_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, instagram_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://instagram.com/..."
            />
            <SocialLinkCard
              name="Facebook"
              icon={<Music className="w-5 h-5" />}
              url={formData.facebook_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, facebook_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://facebook.com/..."
            />
            <SocialLinkCard
              name="TikTok"
              icon={<Music className="w-5 h-5" />}
              url={formData.tiktok_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, tiktok_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://tiktok.com/@..."
            />
            <SocialLinkCard
              name="Twitter/X"
              icon={<Music className="w-5 h-5" />}
              url={formData.twitter_url}
              onUpdate={(url) => setFormData(prev => ({ ...prev, twitter_url: url || '' }))}
              isEditing={isEditing}
              placeholder="https://twitter.com/..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
