import { useState } from 'react';
import { ArrowLeft, Settings, Edit, Save, X, Music, Music2, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
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

  useState(() => {
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
  });

  const handleImageSelect = async (file: File) => {
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
      <PageContainer>
        <div className="mobile-container py-6 space-y-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <Badge variant="outline" className="border-white/20 text-white/90">
            ARTIST PROFILE
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
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
                    className="bg-white/5 border-white/20 text-white text-center"
                  />
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Bio"
                    className="bg-white/5 border-white/20 text-white resize-none"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{profile?.stage_name}</h2>
                  {profile?.bio && (
                    <p className="text-sm text-white/70 max-w-md">{profile.bio}</p>
                  )}
                  <div className="flex gap-6 text-sm text-white/50">
                    <div>
                      <div className="text-lg font-semibold text-white">0</div>
                      <div>Releases</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
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
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Major Streaming Services</CardTitle>
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
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Additional Streaming Platforms</CardTitle>
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
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Social Media</CardTitle>
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
    </PageContainer>
  );
};
