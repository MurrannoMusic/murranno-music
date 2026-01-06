-- ============================================
-- MURRANNO MUSIC - COMPLETE DATABASE SCHEMA
-- Supabase PostgreSQL Setup Script
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('artist', 'label', 'agency', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  phone TEXT,
  country TEXT,
  verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ARTISTS TABLE
-- ============================================

CREATE TABLE public.artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  label_id UUID REFERENCES public.profiles(id),
  artist_name TEXT NOT NULL,
  genre TEXT[],
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  instagram_url TEXT,
  monthly_listeners INTEGER DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. RELEASES TABLE
-- ============================================

CREATE TABLE public.releases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  release_type TEXT CHECK (release_type IN ('single', 'ep', 'album', 'compilation')),
  cover_url TEXT,
  release_date DATE,
  upc_code TEXT UNIQUE,
  isrc_codes TEXT[],
  genre TEXT[],
  label_name TEXT,
  copyright_holder TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'rejected', 'taken_down')),
  total_tracks INTEGER,
  duration_seconds INTEGER,
  platforms JSONB DEFAULT '{"spotify": false, "apple_music": false, "youtube": false, "amazon": false, "tidal": false}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TRACKS TABLE
-- ============================================

CREATE TABLE public.tracks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
  track_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  duration_seconds INTEGER,
  isrc_code TEXT,
  audio_url TEXT,
  lyrics TEXT,
  explicit BOOLEAN DEFAULT false,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. CAMPAIGNS TABLE
-- ============================================

CREATE TABLE public.campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  release_id UUID REFERENCES public.releases(id),
  creator_id UUID REFERENCES public.profiles(id),
  campaign_type TEXT CHECK (campaign_type IN ('spotify_promotion', 'playlist_pitching', 'social_media', 'radio', 'press', 'influencer', 'combined')),
  name TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2),
  spent DECIMAL(10, 2) DEFAULT 0,
  target_audience JSONB DEFAULT '{}',
  platforms TEXT[],
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  goals JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. ANALYTICS TABLE
-- ============================================

CREATE TABLE public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT CHECK (entity_type IN ('release', 'artist', 'campaign')),
  entity_id UUID NOT NULL,
  date DATE NOT NULL,
  platform TEXT,
  metrics JSONB DEFAULT '{}', -- streams, saves, playlist_adds, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, date, platform)
);

-- ============================================
-- 7. EARNINGS TABLE
-- ============================================

CREATE TABLE public.earnings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  release_id UUID REFERENCES public.releases(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  platform TEXT NOT NULL,
  streams INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  payment_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. WALLETS TABLE
-- ============================================

CREATE TABLE public.wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0,
  pending_balance DECIMAL(10, 2) DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  total_withdrawn DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_method JSONB DEFAULT '{}',
  minimum_payout DECIMAL(10, 2) DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. PAYOUTS TABLE
-- ============================================

CREATE TABLE public.payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallets(id),
  profile_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. LABEL_ARTISTS TABLE (Label roster)
-- ============================================

CREATE TABLE public.label_artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  contract_start DATE,
  contract_end DATE,
  revenue_share DECIMAL(5, 2), -- percentage
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(label_id, artist_id)
);

-- ============================================
-- 11. AGENCY_CLIENTS TABLE
-- ============================================

CREATE TABLE public.agency_clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agency_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_profile_id UUID REFERENCES public.profiles(id),
  client_name TEXT NOT NULL,
  client_type TEXT CHECK (client_type IN ('artist', 'label', 'brand')),
  contract_start DATE,
  contract_end DATE,
  service_fee DECIMAL(5, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. PLAYLISTS TABLE (for tracking)
-- ============================================

CREATE TABLE public.playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL,
  playlist_id TEXT NOT NULL,
  name TEXT NOT NULL,
  curator_name TEXT,
  followers INTEGER,
  genre TEXT[],
  contact_info TEXT,
  submission_status TEXT CHECK (submission_status IN ('available', 'contacted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, playlist_id)
);

-- ============================================
-- 14. PLAYLIST_SUBMISSIONS TABLE
-- ============================================

CREATE TABLE public.playlist_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id),
  playlist_id UUID REFERENCES public.playlists(id),
  release_id UUID REFERENCES public.releases(id),
  submitted_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'added', 'rejected', 'removed')),
  added_date DATE,
  removed_date DATE,
  position INTEGER,
  streams_generated INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. ACTIVITY_LOGS TABLE
-- ============================================

CREATE TABLE public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. SUBSCRIPTION_PLANS TABLE
-- ============================================

CREATE TABLE public.subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')),
  features JSONB DEFAULT '[]',
  user_types TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 17. SUBSCRIPTIONS TABLE
-- ============================================

CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  start_date DATE NOT NULL,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_artists_profile_id ON public.artists(profile_id);
CREATE INDEX idx_artists_label_id ON public.artists(label_id);
CREATE INDEX idx_releases_artist_id ON public.releases(artist_id);
CREATE INDEX idx_releases_status ON public.releases(status);
CREATE INDEX idx_releases_release_date ON public.releases(release_date);
CREATE INDEX idx_campaigns_creator_id ON public.campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_analytics_entity ON public.analytics(entity_type, entity_id, date);
CREATE INDEX idx_earnings_artist_id ON public.earnings(artist_id);
CREATE INDEX idx_earnings_period ON public.earnings(period_start, period_end);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, read);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON public.releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- ============================================
-- ARTISTS POLICIES
-- ============================================

-- Artists can view their own data
CREATE POLICY "Artists can view own data"
  ON public.artists FOR SELECT
  USING (profile_id = auth.uid());

-- Labels can view their artists
CREATE POLICY "Labels can view their artists"
  ON public.artists FOR SELECT
  USING (
    label_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.label_artists la
      WHERE la.label_id = auth.uid() AND la.artist_id = artists.id
    )
  );

-- Artists can update their own data
CREATE POLICY "Artists can update own data"
  ON public.artists FOR UPDATE
  USING (profile_id = auth.uid());

-- ============================================
-- RELEASES POLICIES
-- ============================================

-- Artists can view their own releases
CREATE POLICY "Artists can view own releases"
  ON public.releases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE artists.id = releases.artist_id
      AND artists.profile_id = auth.uid()
    )
  );

-- Artists can create releases
CREATE POLICY "Artists can create releases"
  ON public.releases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE artists.id = releases.artist_id
      AND artists.profile_id = auth.uid()
    )
  );

-- Artists can update their own releases
CREATE POLICY "Artists can update own releases"
  ON public.releases FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE artists.id = releases.artist_id
      AND artists.profile_id = auth.uid()
    )
  );

-- Labels can view their artists' releases
CREATE POLICY "Labels can view artists releases"
  ON public.releases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists a
      JOIN public.label_artists la ON la.artist_id = a.id
      WHERE a.id = releases.artist_id
      AND la.label_id = auth.uid()
    )
  );

-- ============================================
-- CAMPAIGNS POLICIES
-- ============================================

-- Users can view their own campaigns
CREATE POLICY "Users can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (creator_id = auth.uid());

-- Users can create campaigns
CREATE POLICY "Users can create campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- Users can update their own campaigns
CREATE POLICY "Users can update own campaigns"
  ON public.campaigns FOR UPDATE
  USING (creator_id = auth.uid());

-- ============================================
-- EARNINGS POLICIES
-- ============================================

-- Artists can view their own earnings
CREATE POLICY "Artists can view own earnings"
  ON public.earnings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE artists.id = earnings.artist_id
      AND artists.profile_id = auth.uid()
    )
  );

-- Labels can view their artists' earnings
CREATE POLICY "Labels can view artists earnings"
  ON public.earnings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists a
      JOIN public.label_artists la ON la.artist_id = a.id
      WHERE a.id = earnings.artist_id
      AND la.label_id = auth.uid()
    )
  );

-- ============================================
-- WALLETS POLICIES
-- ============================================

-- Users can view their own wallet
CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (profile_id = auth.uid());

-- Users can update their own wallet
CREATE POLICY "Users can update own wallet"
  ON public.wallets FOR UPDATE
  USING (profile_id = auth.uid());

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate total streams for an artist
CREATE OR REPLACE FUNCTION public.calculate_artist_total_streams(artist_uuid UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM((metrics->>'streams')::BIGINT), 0)
  FROM public.analytics
  WHERE entity_type = 'artist' AND entity_id = artist_uuid;
$$ LANGUAGE sql;

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  wallet_uuid UUID,
  amount DECIMAL
)
RETURNS void AS $$
BEGIN
  UPDATE public.wallets
  SET balance = balance + amount,
      total_earned = total_earned + GREATEST(amount, 0),
      updated_at = NOW()
  WHERE id = wallet_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, description, price, billing_period, features, user_types) VALUES
  ('Free', 'Basic features for getting started', 0, 'monthly', '["Up to 2 releases", "Basic analytics", "Email support"]', ARRAY['artist']),
  ('Pro', 'Advanced features for serious artists', 29.99, 'monthly', '["Unlimited releases", "Advanced analytics", "Priority support", "Campaign tools"]', ARRAY['artist', 'label']),
  ('Label', 'Complete solution for labels', 99.99, 'monthly', '["Unlimited artists", "Full analytics suite", "White label", "API access"]', ARRAY['label']),
  ('Agency', 'Tools for agencies and promoters', 149.99, 'monthly', '["Client management", "Campaign analytics", "Reporting tools", "API access"]', ARRAY['agency']);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Run this script in your Supabase SQL Editor
-- All tables, policies, and functions are now created
