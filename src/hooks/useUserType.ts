import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserType = () => {
  const [userType, setUserType] = useState<'artist' | 'label' | 'manager' | 'agency' | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  useEffect(() => {
    fetchUserType();
  }, []);

  const fetchUserType = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setUserType(null);
        setCurrentUser(null);
        return;
      }

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase.functions.invoke('get-profile');

      if (profileError) throw profileError;

      if (profileData?.success && profileData.profile) {
        setUserType(profileData.profile.tier);
        setCurrentUser({
          id: profileData.profile.id,
          name: profileData.profile.full_name,
          email: profileData.profile.email,
          accountType: profileData.profile.tier,
        });
      }
    } catch (error: any) {
      console.error('Error fetching user type:', error);
      toast.error('Failed to load user type');
      setUserType('artist'); // Default fallback
    } finally {
      setLoading(false);
    }
  };

  const switchUserType = async (newType: 'artist' | 'label' | 'manager' | 'agency') => {
    try {
      const { data, error } = await supabase.functions.invoke('update-subscription-tier', {
        body: { tier: newType }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to update user type');
      }

      setUserType(newType);
      toast.success(`Switched to ${newType} account`);
      
      // Reload the page to refresh all data
      window.location.reload();
    } catch (error: any) {
      console.error('Error switching user type:', error);
      toast.error(error.message || 'Failed to switch account type');
    }
  };

  const selectArtist = (artistId: string) => {
    setSelectedArtist(artistId);
  };

  return {
    currentUserType: userType,
    userType,
    currentUser,
    selectedArtist,
    loading,
    switchUserType,
    selectArtist,
    refetch: fetchUserType,
    isLabel: userType === 'label',
    isAgency: userType === 'agency',
    isArtist: userType === 'artist',
  };
};
