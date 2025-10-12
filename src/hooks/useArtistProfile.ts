import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ArtistProfile {
  id: string;
  stage_name: string;
  bio: string | null;
  profile_image: string | null;
  spotify_id: string | null;
  apple_music_id: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  audiomack_url: string | null;
  soundcloud_url: string | null;
  apple_music_url: string | null;
  deezer_url: string | null;
  tidal_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  created_at: string;
}

export const useArtistProfile = () => {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-artist-profile');
      
      if (error) throw error;
      if (data?.artist) {
        setProfile(data.artist);
      }
    } catch (error: any) {
      console.error('Error fetching artist profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ArtistProfile>) => {
    try {
      setUpdating(true);
      const { data, error } = await supabase.functions.invoke('update-artist-profile', {
        body: updates,
      });

      if (error) throw error;

      if (data?.artist) {
        setProfile(data.artist);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    uploadProfileImage,
    refetch: fetchProfile,
  };
};
