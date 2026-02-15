export interface AdminRelease {
    id: string;
    title: string;
    artist_id: string;
    release_type: string;
    status: string;
    release_date: string;
    cover_art_url: string | null;
    genre: string | null;
    created_at: string;
    upc_ean: string | null;
    label: string | null;
    copyright: string | null;
    language: string | null;
}

export interface AdminTrack {
    id: string;
    title: string;
    audio_file_url: string | null;
}

export interface AdminUser {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    user_roles: { tier: string }[];
    subscriptions: { status: string }[];
}

export interface AdminAnalytics {
    totalUsers: number;
    activeSubscriptions: number;
    totalReleases: number;
    platformRevenue: number;
    tierDistribution: Record<string, number>;
    totalCampaigns: number;
    totalEarnings: number;
    totalWithdrawals: number;
}
