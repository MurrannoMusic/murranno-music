/**
 * Supabase API Services
 * All data fetching and mutations
 */
import { supabase } from './supabase';

// Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  user_type: 'artist' | 'label' | 'agency' | 'admin';
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Release {
  id: string;
  user_id: string;
  title: string;
  artist_name: string;
  cover_art_url: string | null;
  release_date: string | null;
  genre: string | null;
  status: 'draft' | 'pending' | 'approved' | 'live' | 'rejected';
  upc: string | null;
  created_at: string;
  updated_at: string;
  tracks?: Track[];
}

export interface Track {
  id: string;
  release_id: string;
  title: string;
  audio_url: string | null;
  duration: number | null;
  track_number: number;
  isrc: string | null;
  created_at: string;
}

export interface Earning {
  id: string;
  user_id: string;
  release_id: string | null;
  amount: number;
  currency: string;
  source: string;
  status: 'pending' | 'available' | 'withdrawn';
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  release_id: string | null;
  name: string;
  budget: number;
  spent: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

// Profile Services
export const profileService = {
  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async update(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    return data;
  },

  async uploadAvatar(userId: string, uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      await profileService.update(userId, { avatar_url: data.publicUrl });
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};

// Releases Services
export const releasesService = {
  async getAll(userId: string): Promise<Release[]> {
    const { data, error } = await supabase
      .from('releases')
      .select('*, tracks(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching releases:', error);
      return [];
    }
    return data || [];
  },

  async getById(id: string): Promise<Release | null> {
    const { data, error } = await supabase
      .from('releases')
      .select('*, tracks(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching release:', error);
      return null;
    }
    return data;
  },

  async create(release: Partial<Release>): Promise<Release | null> {
    const { data, error } = await supabase
      .from('releases')
      .insert(release)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating release:', error);
      throw error;
    }
    return data;
  },

  async update(id: string, updates: Partial<Release>): Promise<Release | null> {
    const { data, error } = await supabase
      .from('releases')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating release:', error);
      throw error;
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting release:', error);
      return false;
    }
    return true;
  },

  async uploadCoverArt(releaseId: string, uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${releaseId}/cover.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('cover-art')
        .upload(fileName, blob, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('cover-art').getPublicUrl(fileName);
      
      await releasesService.update(releaseId, { cover_art_url: data.publicUrl });
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading cover art:', error);
      throw error;
    }
  },
};

// Tracks Services
export const tracksService = {
  async create(track: Partial<Track>): Promise<Track | null> {
    const { data, error } = await supabase
      .from('tracks')
      .insert(track)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating track:', error);
      throw error;
    }
    return data;
  },

  async uploadAudio(trackId: string, releaseId: string, uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() || 'mp3';
      const fileName = `${releaseId}/${trackId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, blob, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('audio-files').getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('tracks')
        .update({ audio_url: data.publicUrl })
        .eq('id', trackId);
      
      if (updateError) throw updateError;
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tracks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting track:', error);
      return false;
    }
    return true;
  },
};

// Earnings Services
export const earningsService = {
  async getAll(userId: string): Promise<Earning[]> {
    const { data, error } = await supabase
      .from('earnings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching earnings:', error);
      return [];
    }
    return data || [];
  },

  async getStats(userId: string) {
    const { data, error } = await supabase
      .from('earnings')
      .select('amount, status, created_at')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching earnings stats:', error);
      return { total: 0, available: 0, pending: 0, thisMonth: 0 };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = (data || []).reduce(
      (acc, earning) => {
        acc.total += earning.amount;
        if (earning.status === 'available') acc.available += earning.amount;
        if (earning.status === 'pending') acc.pending += earning.amount;
        if (new Date(earning.created_at) >= startOfMonth) acc.thisMonth += earning.amount;
        return acc;
      },
      { total: 0, available: 0, pending: 0, thisMonth: 0 }
    );

    return stats;
  },
};

// Notifications Services
export const notificationsService = {
  async getAll(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  },

  async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    return true;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    return true;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
    return count || 0;
  },
};

// Campaigns Services
export const campaignsService = {
  async getAll(userId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    return data || [];
  },

  async create(campaign: Partial<Campaign>): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
    return data;
  },

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
    return data;
  },
};

// Analytics Services
export const analyticsService = {
  async getStreamStats(userId: string, days: number = 30) {
    // This would typically come from a streaming analytics table
    // For now, returning mock data structure
    return {
      totalStreams: 0,
      uniqueListeners: 0,
      avgDailyStreams: 0,
      topCountries: [],
      topTracks: [],
      streamsByDay: [],
    };
  },

  async getDashboardStats(userId: string) {
    const [releases, earnings] = await Promise.all([
      releasesService.getAll(userId),
      earningsService.getStats(userId),
    ]);

    return {
      totalReleases: releases.length,
      liveReleases: releases.filter(r => r.status === 'live').length,
      pendingReleases: releases.filter(r => r.status === 'pending').length,
      totalEarnings: earnings.total,
      availableBalance: earnings.available,
      pendingEarnings: earnings.pending,
      thisMonthEarnings: earnings.thisMonth,
    };
  },
};

export default {
  profile: profileService,
  releases: releasesService,
  tracks: tracksService,
  earnings: earningsService,
  notifications: notificationsService,
  campaigns: campaignsService,
  analytics: analyticsService,
};
