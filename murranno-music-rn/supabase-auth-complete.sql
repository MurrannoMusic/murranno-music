-- ============================================
-- MURRANNO MUSIC - AUTHENTICATION & DATABASE SETUP
-- Complete Schema with Auth Integration
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================

-- Drop existing if needed (for clean setup)
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT NOT NULL DEFAULT 'artist' CHECK (user_type IN ('artist', 'label', 'agency', 'admin')),
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

-- Index for performance
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================
-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

-- Function to create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'artist')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. ARTISTS TABLE
-- ============================================

DROP TABLE IF EXISTS public.artists CASCADE;

CREATE TABLE public.artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  artist_name TEXT NOT NULL,
  genre TEXT[] DEFAULT '{}',
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

CREATE INDEX idx_artists_profile_id ON public.artists(profile_id);

-- ============================================
-- 4. RELEASES TABLE
-- ============================================

DROP TABLE IF EXISTS public.releases CASCADE;

CREATE TABLE public.releases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  release_type TEXT CHECK (release_type IN ('single', 'ep', 'album', 'compilation')),
  cover_url TEXT,
  release_date DATE,
  upc_code TEXT UNIQUE,
  genre TEXT[] DEFAULT '{}',
  label_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'rejected')),
  total_tracks INTEGER DEFAULT 0,
  platforms JSONB DEFAULT '{"spotify": false, "apple_music": false, "youtube": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_releases_artist_id ON public.releases(artist_id);
CREATE INDEX idx_releases_status ON public.releases(status);

-- ============================================
-- 5. CAMPAIGNS TABLE
-- ============================================

DROP TABLE IF EXISTS public.campaigns CASCADE;

CREATE TABLE public.campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2) DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_creator_id ON public.campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);

-- ============================================
-- 6. EARNINGS TABLE
-- ============================================

DROP TABLE IF EXISTS public.earnings CASCADE;

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_earnings_artist_id ON public.earnings(artist_id);

-- ============================================
-- 7. WALLETS TABLE
-- ============================================

DROP TABLE IF EXISTS public.wallets CASCADE;

CREATE TABLE public.wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  total_withdrawn DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallets_profile_id ON public.wallets(profile_id);

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================

DROP TABLE IF EXISTS public.notifications CASCADE;

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, read);

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for manual creation)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- ARTISTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Artists can view own data" ON public.artists;
DROP POLICY IF EXISTS "Artists can insert own data" ON public.artists;
DROP POLICY IF EXISTS "Artists can update own data" ON public.artists;

-- Artists can view their own data
CREATE POLICY "Artists can view own data"
  ON public.artists FOR SELECT
  USING (profile_id = auth.uid());

-- Artists can create their profile
CREATE POLICY "Artists can insert own data"
  ON public.artists FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Artists can update their own data
CREATE POLICY "Artists can update own data"
  ON public.artists FOR UPDATE
  USING (profile_id = auth.uid());

-- ============================================
-- RELEASES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Artists can view own releases" ON public.releases;
DROP POLICY IF EXISTS "Artists can create releases" ON public.releases;
DROP POLICY IF EXISTS "Artists can update own releases" ON public.releases;

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

-- ============================================
-- CAMPAIGNS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON public.campaigns;

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

DROP POLICY IF EXISTS "Artists can view own earnings" ON public.earnings;

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

-- ============================================
-- WALLETS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;

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

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Function to create artist profile after user signup
CREATE OR REPLACE FUNCTION public.create_artist_profile(
  user_id UUID,
  artist_name_param TEXT,
  genre_param TEXT[] DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  new_artist_id UUID;
BEGIN
  INSERT INTO public.artists (profile_id, artist_name, genre)
  VALUES (user_id, artist_name_param, genre_param)
  RETURNING id INTO new_artist_id;
  
  RETURN new_artist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create wallet for user
CREATE OR REPLACE FUNCTION public.create_wallet(
  user_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_wallet_id UUID;
BEGIN
  INSERT INTO public.wallets (profile_id)
  VALUES (user_id)
  RETURNING id INTO new_wallet_id;
  
  RETURN new_wallet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_artists_updated_at ON public.artists;
DROP TRIGGER IF EXISTS update_releases_updated_at ON public.releases;
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
DROP TRIGGER IF EXISTS update_wallets_updated_at ON public.wallets;

-- Create triggers
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
-- 12. TEST DATA (Optional - comment out for production)
-- ============================================

-- You can uncomment this section to create test data
/*
-- Create a test profile (requires existing auth user)
INSERT INTO public.profiles (id, email, full_name, user_type)
VALUES (
  'your-test-user-id-here',
  'test@murranno.com',
  'Test User',
  'artist'
) ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- All tables created with proper authentication integration
-- RLS policies ensure users can only access their own data
-- Triggers automatically create profiles on signup
-- Helper functions available for common operations
