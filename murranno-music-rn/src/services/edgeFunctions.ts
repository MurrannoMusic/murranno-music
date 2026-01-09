/**
 * Supabase Edge Functions API Service
 * Complete integration for React Native matching web app functionality
 */
import { supabase } from './supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';

// Helper to call edge functions
async function callEdgeFunction<T>(functionName: string, body?: any, method: 'POST' | 'GET' = 'POST'): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const url = method === 'GET' && body 
    ? `${SUPABASE_URL}/functions/v1/${functionName}?${new URLSearchParams(body).toString()}`
    : `${SUPABASE_URL}/functions/v1/${functionName}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    body: method === 'POST' && body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Edge function call failed');
  }

  return data;
}

// ============ TYPES ============

export interface Release {
  id: string;
  title: string;
  artist: string;
  type: string;
  year: number;
  releaseDate: string;
  coverArt: string;
  status: string;
  metadata: {
    genre: string;
    language: string;
    label: string;
    copyright: string;
    upcEan: string;
  };
  smartlink: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  track_number: number;
  audio_file_url: string | null;
  isrc: string | null;
}

export interface WalletBalance {
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  currency: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  platform: string;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  status: string;
  promotion_type: string;
}

export interface ArtistProfile {
  id: string;
  stage_name: string;
  bio: string;
  profile_image_url: string;
  cover_image_url: string;
  genres: string[];
  social_links: Record<string, string>;
}

export interface Analytics {
  totalStreams: number;
  totalEarnings: number;
  activeReleases: number;
  topTracks: Array<{
    id: string;
    title: string;
    artist: string;
    streams: number;
    release: string;
  }>;
  streamsByPlatform: Array<{
    platform: string;
    streams: number;
    percentage: number;
  }>;
  streamsByCountry: Array<{
    country: string;
    streams: number;
    percentage: number;
  }>;
  earningsOverTime: Array<{
    date: string;
    amount: number;
  }>;
  recentActivity: Array<{
    date: string;
    type: string;
    description: string;
    track: string;
    platform: string;
  }>;
}

export interface EarningsBreakdown {
  source: string;
  platform: string;
  amount: number;
  count: number;
}

export interface PromotionBundle {
  id: string;
  name: string;
  description: string;
  price: number;
  services: string[];
  category: string;
}

export interface PromotionService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  delivery_time: string;
}

export interface PayoutMethod {
  id: string;
  type: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
  reference: string;
}

export interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan: {
    name: string;
    price: number;
    features: string[];
  };
}

// ============ API SERVICES ============

// Releases API
export const releasesApi = {
  async getAll(status?: string, search?: string): Promise<Release[]> {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (search) params.search = search;
    
    const data = await callEdgeFunction<{ releases: Release[] }>('get-user-releases', params, 'GET');
    return data.releases;
  },

  async getDetail(releaseId: string): Promise<Release> {
    const data = await callEdgeFunction<{ release: Release }>('get-release-detail', { release_id: releaseId });
    return data.release;
  },

  async create(releaseData: {
    title: string;
    release_type: string;
    release_date: string;
    genre?: string;
    label?: string;
    cover_art_url?: string;
    upc_ean?: string;
    copyright?: string;
    language?: string;
  }): Promise<Release> {
    const data = await callEdgeFunction<{ release: Release }>('create-release', releaseData);
    return data.release;
  },

  async update(releaseId: string, updates: Partial<Release>): Promise<Release> {
    const data = await callEdgeFunction<{ release: Release }>('update-release', { release_id: releaseId, ...updates });
    return data.release;
  },

  async delete(releaseId: string): Promise<boolean> {
    await callEdgeFunction('delete-release', { release_id: releaseId });
    return true;
  },

  async uploadWithTracks(
    releaseData: any,
    tracks: any[],
    coverArtFile?: { base64: string; fileName: string; contentType: string },
    audioFiles?: Array<{ base64: string; fileName: string; contentType: string }>
  ): Promise<{ release: Release; tracks: Track[] }> {
    const data = await callEdgeFunction<{ release: Release; tracks: Track[] }>('upload-track', {
      releaseData,
      tracks,
      coverArtFile,
      audioFiles,
    });
    return data;
  },
};

// Tracks API
export const tracksApi = {
  async delete(trackId: string): Promise<boolean> {
    await callEdgeFunction('delete-track', { track_id: trackId });
    return true;
  },
};

// Wallet & Earnings API
export const walletApi = {
  async getBalance(): Promise<WalletBalance> {
    const data = await callEdgeFunction<{ balance: WalletBalance }>('get-wallet-balance', {}, 'GET');
    return data.balance;
  },

  async getTransactions(limit?: number): Promise<Transaction[]> {
    const data = await callEdgeFunction<{ transactions: Transaction[] }>('get-wallet-transactions', { limit }, 'GET');
    return data.transactions;
  },

  async getEarningsBreakdown(period: string = '30days'): Promise<EarningsBreakdown[]> {
    const data = await callEdgeFunction<{ earnings: EarningsBreakdown[] }>('get-earnings-breakdown', { period }, 'GET');
    return data.earnings;
  },

  async initiateWithdrawal(amount: number, payoutMethodId: string): Promise<{ reference: string }> {
    const data = await callEdgeFunction<{ reference: string }>('paystack-initiate-withdrawal', {
      amount,
      payout_method_id: payoutMethodId,
    });
    return data;
  },

  async getWithdrawalStatus(reference: string): Promise<{ status: string; message: string }> {
    const data = await callEdgeFunction<{ status: string; message: string }>('get-withdrawal-status', { reference }, 'GET');
    return data;
  },
};

// Payout Methods API
export const payoutMethodsApi = {
  async getAll(): Promise<PayoutMethod[]> {
    const data = await callEdgeFunction<{ payout_methods: PayoutMethod[] }>('get-payout-methods', {}, 'GET');
    return data.payout_methods;
  },

  async getBanks(): Promise<Array<{ code: string; name: string }>> {
    const data = await callEdgeFunction<{ banks: Array<{ code: string; name: string }> }>('paystack-get-banks', {}, 'GET');
    return data.banks;
  },

  async resolveAccount(accountNumber: string, bankCode: string): Promise<{ account_name: string }> {
    const data = await callEdgeFunction<{ account_name: string }>('paystack-resolve-account', {
      account_number: accountNumber,
      bank_code: bankCode,
    });
    return data;
  },

  async create(bankCode: string, accountNumber: string, accountName: string): Promise<PayoutMethod> {
    const data = await callEdgeFunction<{ payout_method: PayoutMethod }>('paystack-create-recipient', {
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
    });
    return data.payout_method;
  },

  async setPrimary(payoutMethodId: string): Promise<boolean> {
    await callEdgeFunction('paystack-set-primary-method', { payout_method_id: payoutMethodId });
    return true;
  },

  async delete(payoutMethodId: string): Promise<boolean> {
    await callEdgeFunction('delete-payout-method', { payout_method_id: payoutMethodId });
    return true;
  },
};

// Analytics API
export const analyticsApi = {
  async fetch(period: string = '30days', artistId?: string): Promise<Analytics> {
    const params: Record<string, string> = { period };
    if (artistId) params.artistId = artistId;
    
    const data = await callEdgeFunction<Analytics>('fetch-analytics', params, 'GET');
    return data;
  },

  async getAnalyticsData(period: string = '30days'): Promise<Analytics> {
    const data = await callEdgeFunction<Analytics>('get-analytics-data', { period }, 'GET');
    return data;
  },
};

// Campaigns API
export const campaignsApi = {
  async getAll(): Promise<Campaign[]> {
    const data = await callEdgeFunction<{ campaigns: Campaign[] }>('get-user-campaigns', {}, 'GET');
    return data.campaigns;
  },

  async create(campaignData: {
    name: string;
    type: string;
    platform: string;
    budget: number;
    start_date: string;
    end_date: string;
    artist_id?: string;
    release_id?: string;
    promotion_type?: string;
    bundle_id?: string;
    category?: string;
    service_ids?: string[];
  }): Promise<Campaign> {
    const data = await callEdgeFunction<{ campaign: Campaign }>('create-campaign', campaignData);
    return data.campaign;
  },

  async update(campaignId: string, updates: Partial<Campaign>): Promise<Campaign> {
    const data = await callEdgeFunction<{ campaign: Campaign }>('update-campaign', { campaign_id: campaignId, ...updates });
    return data.campaign;
  },

  async delete(campaignId: string): Promise<boolean> {
    await callEdgeFunction('delete-campaign', { campaign_id: campaignId });
    return true;
  },

  async pause(campaignId: string): Promise<Campaign> {
    const data = await callEdgeFunction<{ campaign: Campaign }>('pause-campaign', { campaign_id: campaignId });
    return data.campaign;
  },

  async getMetrics(campaignId: string): Promise<any> {
    const data = await callEdgeFunction('get-campaign-metrics', { campaign_id: campaignId }, 'GET');
    return data;
  },

  async getPerformance(campaignId: string): Promise<any> {
    const data = await callEdgeFunction('get-campaign-performance', { campaign_id: campaignId }, 'GET');
    return data;
  },

  async initializePayment(campaignId: string): Promise<{ authorization_url: string; reference: string }> {
    const data = await callEdgeFunction<{ authorization_url: string; reference: string }>(
      'paystack-initialize-campaign-payment',
      { campaign_id: campaignId }
    );
    return data;
  },
};

// Promotions API
export const promotionsApi = {
  async getBundles(): Promise<PromotionBundle[]> {
    const data = await callEdgeFunction<{ bundles: PromotionBundle[] }>('get-promotion-bundles', {}, 'GET');
    return data.bundles;
  },

  async getServices(): Promise<PromotionService[]> {
    const data = await callEdgeFunction<{ services: PromotionService[] }>('get-promotion-services', {}, 'GET');
    return data.services;
  },
};

// Artist Profile API
export const artistProfileApi = {
  async get(): Promise<ArtistProfile | null> {
    try {
      const data = await callEdgeFunction<{ artist: ArtistProfile }>('get-artist-profile', {}, 'GET');
      return data.artist;
    } catch (error) {
      return null;
    }
  },

  async create(profileData: Partial<ArtistProfile>): Promise<ArtistProfile> {
    const data = await callEdgeFunction<{ artist: ArtistProfile }>('create-artist-profile', profileData);
    return data.artist;
  },

  async update(updates: Partial<ArtistProfile>): Promise<ArtistProfile> {
    const data = await callEdgeFunction<{ artist: ArtistProfile }>('update-artist-profile', updates);
    return data.artist;
  },

  async getDetail(artistId: string): Promise<ArtistProfile> {
    const data = await callEdgeFunction<{ artist: ArtistProfile }>('get-artist-detail', { artist_id: artistId }, 'GET');
    return data.artist;
  },
};

// Subscriptions API
export const subscriptionsApi = {
  async getPlans(): Promise<Array<{ id: string; name: string; price: number; features: string[] }>> {
    const data = await callEdgeFunction<{ plans: any[] }>('get-subscription-plans', {}, 'GET');
    return data.plans;
  },

  async getStatus(): Promise<Subscription | null> {
    try {
      const data = await callEdgeFunction<{ subscription: Subscription }>('get-subscription-status', {}, 'GET');
      return data.subscription;
    } catch (error) {
      return null;
    }
  },

  async initialize(planId: string): Promise<{ authorization_url: string; reference: string }> {
    const data = await callEdgeFunction<{ authorization_url: string; reference: string }>(
      'paystack-initialize-subscription',
      { plan_id: planId }
    );
    return data;
  },

  async upgrade(planId: string): Promise<{ authorization_url: string; reference: string }> {
    const data = await callEdgeFunction<{ authorization_url: string; reference: string }>(
      'paystack-upgrade-subscription',
      { plan_id: planId }
    );
    return data;
  },

  async cancel(): Promise<boolean> {
    await callEdgeFunction('paystack-cancel-subscription', {});
    return true;
  },

  async verify(reference: string): Promise<{ status: string }> {
    const data = await callEdgeFunction<{ status: string }>('paystack-verify-subscription', { reference });
    return data;
  },
};

// Label API (for labels managing artists)
export const labelApi = {
  async getArtists(): Promise<ArtistProfile[]> {
    const data = await callEdgeFunction<{ artists: ArtistProfile[] }>('get-label-artists', {}, 'GET');
    return data.artists;
  },

  async inviteArtist(email: string): Promise<{ invitation_id: string }> {
    const data = await callEdgeFunction<{ invitation_id: string }>('invite-artist-to-label', { email });
    return data;
  },

  async addArtist(artistId: string): Promise<boolean> {
    await callEdgeFunction('add-artist-to-label', { artist_id: artistId });
    return true;
  },

  async removeArtist(artistId: string): Promise<boolean> {
    await callEdgeFunction('remove-artist-from-label', { artist_id: artistId });
    return true;
  },
};

// Agency API (for agencies managing clients)
export const agencyApi = {
  async getClients(): Promise<any[]> {
    const data = await callEdgeFunction<{ clients: any[] }>('get-agency-clients', {}, 'GET');
    return data.clients;
  },

  async inviteClient(email: string): Promise<{ invitation_id: string }> {
    const data = await callEdgeFunction<{ invitation_id: string }>('invite-client-to-agency', { email });
    return data;
  },

  async addClient(clientId: string): Promise<boolean> {
    await callEdgeFunction('add-client-to-agency', { client_id: clientId });
    return true;
  },

  async getCampaignAnalytics(): Promise<any> {
    const data = await callEdgeFunction('get-agency-campaign-analytics', {}, 'GET');
    return data;
  },
};

// Profile API
export const profileApi = {
  async get(): Promise<any> {
    const data = await callEdgeFunction('get-profile', {}, 'GET');
    return data.profile;
  },

  async update(updates: any): Promise<any> {
    const data = await callEdgeFunction('update-profile', updates);
    return data.profile;
  },
};

// Push Notifications API
export const pushNotificationsApi = {
  async registerToken(token: string, platform: 'ios' | 'android'): Promise<boolean> {
    await callEdgeFunction('register-push-token', { token, platform });
    return true;
  },
};

// Cloudinary Upload API
export const uploadApi = {
  async uploadImage(base64: string, folder: string = 'uploads'): Promise<{ url: string }> {
    const data = await callEdgeFunction<{ url: string }>('upload-image-cloudinary', {
      file: base64,
      folder,
    });
    return data;
  },

  async uploadAudio(base64: string, folder: string = 'audio'): Promise<{ url: string }> {
    const data = await callEdgeFunction<{ url: string }>('upload-audio-cloudinary', {
      file: base64,
      folder,
    });
    return data;
  },
};

// Export all APIs
export default {
  releases: releasesApi,
  tracks: tracksApi,
  wallet: walletApi,
  payoutMethods: payoutMethodsApi,
  analytics: analyticsApi,
  campaigns: campaignsApi,
  promotions: promotionsApi,
  artistProfile: artistProfileApi,
  subscriptions: subscriptionsApi,
  label: labelApi,
  agency: agencyApi,
  profile: profileApi,
  pushNotifications: pushNotificationsApi,
  upload: uploadApi,
};
