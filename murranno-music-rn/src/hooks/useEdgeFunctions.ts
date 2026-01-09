/**
 * React Native Hooks for Edge Functions
 * Matching the web app's hook patterns
 */
import { useState, useEffect, useCallback } from 'react';
import edgeFunctions, {
  Release,
  WalletBalance,
  Campaign,
  Analytics,
  PromotionBundle,
  PromotionService,
  ArtistProfile,
  PayoutMethod,
  Transaction,
  EarningsBreakdown,
  Subscription,
} from '../services/edgeFunctions';

// ============ RELEASES HOOKS ============

export function useReleases(statusFilter?: string, searchQuery?: string) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.releases.getAll(statusFilter, searchQuery);
      setReleases(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return { releases, loading, error, refetch: fetchReleases };
}

export function useReleaseDetail(releaseId: string) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!releaseId) return;
    
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.releases.getDetail(releaseId);
        setRelease(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [releaseId]);

  return { release, loading, error };
}

// ============ WALLET HOOKS ============

export function useWalletBalance() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.wallet.getBalance();
      setBalance(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

export function useTransactions(limit: number = 20) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.wallet.getTransactions(limit);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
}

export function useEarningsBreakdown(period: string = '30days') {
  const [earnings, setEarnings] = useState<EarningsBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.wallet.getEarningsBreakdown(period);
        setEarnings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [period]);

  return { earnings, loading, error };
}

// ============ ANALYTICS HOOKS ============

export function useAnalytics(period: string = '30days', artistId?: string) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.analytics.fetch(period, artistId);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period, artistId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export function useAnalyticsData(period: string = '30days') {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await edgeFunctions.analytics.getAnalyticsData(period);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [period]);

  return { data, loading, error };
}

// ============ CAMPAIGNS HOOKS ============

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.campaigns.getAll();
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = async (campaignData: Parameters<typeof edgeFunctions.campaigns.create>[0]) => {
    const campaign = await edgeFunctions.campaigns.create(campaignData);
    setCampaigns(prev => [campaign, ...prev]);
    return campaign;
  };

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    const updated = await edgeFunctions.campaigns.update(campaignId, updates);
    setCampaigns(prev => prev.map(c => c.id === campaignId ? updated : c));
    return updated;
  };

  const deleteCampaign = async (campaignId: string) => {
    await edgeFunctions.campaigns.delete(campaignId);
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  const pauseCampaign = async (campaignId: string) => {
    const updated = await edgeFunctions.campaigns.pause(campaignId);
    setCampaigns(prev => prev.map(c => c.id === campaignId ? updated : c));
    return updated;
  };

  return { 
    campaigns, 
    loading, 
    error, 
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    pauseCampaign,
  };
}

export function useCampaignActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await edgeFunctions.campaigns.initializePayment(campaignId);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = async (campaignId: string) => {
    setLoading(true);
    try {
      return await edgeFunctions.campaigns.getMetrics(campaignId);
    } finally {
      setLoading(false);
    }
  };

  const getPerformance = async (campaignId: string) => {
    setLoading(true);
    try {
      return await edgeFunctions.campaigns.getPerformance(campaignId);
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment, getMetrics, getPerformance, loading, error };
}

// ============ PROMOTIONS HOOKS ============

export function usePromotionBundles() {
  const [bundles, setBundles] = useState<PromotionBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.promotions.getBundles();
        setBundles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { bundles, loading, error };
}

export function usePromotionServices() {
  const [services, setServices] = useState<PromotionService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.promotions.getServices();
        setServices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { services, loading, error };
}

// ============ ARTIST PROFILE HOOKS ============

export function useArtistProfile() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.artistProfile.get();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<ArtistProfile>) => {
    const updated = await edgeFunctions.artistProfile.update(updates);
    setProfile(updated);
    return updated;
  };

  const createProfile = async (profileData: Partial<ArtistProfile>) => {
    const created = await edgeFunctions.artistProfile.create(profileData);
    setProfile(created);
    return created;
  };

  return { profile, loading, error, refetch: fetchProfile, updateProfile, createProfile };
}

export function useArtistDetail(artistId: string) {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) return;
    
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.artistProfile.getDetail(artistId);
        setArtist(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [artistId]);

  return { artist, loading, error };
}

// ============ PAYOUT METHODS HOOKS ============

export function usePayoutMethods() {
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.payoutMethods.getAll();
      setPayoutMethods(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const addMethod = async (bankCode: string, accountNumber: string, accountName: string) => {
    const method = await edgeFunctions.payoutMethods.create(bankCode, accountNumber, accountName);
    setPayoutMethods(prev => [...prev, method]);
    return method;
  };

  const setPrimary = async (methodId: string) => {
    await edgeFunctions.payoutMethods.setPrimary(methodId);
    setPayoutMethods(prev => prev.map(m => ({ ...m, is_primary: m.id === methodId })));
  };

  const deleteMethod = async (methodId: string) => {
    await edgeFunctions.payoutMethods.delete(methodId);
    setPayoutMethods(prev => prev.filter(m => m.id !== methodId));
  };

  return { payoutMethods, loading, error, refetch: fetchMethods, addMethod, setPrimary, deleteMethod };
}

export function useBanks() {
  const [banks, setBanks] = useState<Array<{ code: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.payoutMethods.getBanks();
        setBanks(data);
      } catch (err) {
        console.error('Error fetching banks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const resolveAccount = async (accountNumber: string, bankCode: string) => {
    return edgeFunctions.payoutMethods.resolveAccount(accountNumber, bankCode);
  };

  return { banks, loading, resolveAccount };
}

// ============ SUBSCRIPTION HOOKS ============

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<Array<{ id: string; name: string; price: number; features: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await edgeFunctions.subscriptions.getPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { plans, loading, error };
}

export function useSubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.subscriptions.getStatus();
      setSubscription(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { subscription, loading, error, refetch: fetchStatus };
}

// ============ LABEL HOOKS ============

export function useArtists() {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.label.getArtists();
      setArtists(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const inviteArtist = async (email: string) => {
    return edgeFunctions.label.inviteArtist(email);
  };

  const removeArtist = async (artistId: string) => {
    await edgeFunctions.label.removeArtist(artistId);
    setArtists(prev => prev.filter(a => a.id !== artistId));
  };

  return { artists, loading, error, refetch: fetchArtists, inviteArtist, removeArtist };
}

// ============ AGENCY HOOKS ============

export function useAgencyClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeFunctions.agency.getClients();
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const inviteClient = async (email: string) => {
    return edgeFunctions.agency.inviteClient(email);
  };

  return { clients, loading, error, refetch: fetchClients, inviteClient };
}

// ============ TOP TRACKS HOOK ============

export function useTopTracks(period: string = '30days', limit: number = 10) {
  const [tracks, setTracks] = useState<Array<{
    id: string;
    title: string;
    artist: string;
    streams: number;
    release: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const analytics = await edgeFunctions.analytics.fetch(period);
        setTracks(analytics.topTracks.slice(0, limit));
      } catch (err) {
        console.error('Error fetching top tracks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [period, limit]);

  return { tracks, loading };
}

// Export all hooks
export default {
  useReleases,
  useReleaseDetail,
  useWalletBalance,
  useTransactions,
  useEarningsBreakdown,
  useAnalytics,
  useAnalyticsData,
  useCampaigns,
  useCampaignActions,
  usePromotionBundles,
  usePromotionServices,
  useArtistProfile,
  useArtistDetail,
  usePayoutMethods,
  useBanks,
  useSubscriptionPlans,
  useSubscriptionStatus,
  useArtists,
  useAgencyClients,
  useTopTracks,
};
