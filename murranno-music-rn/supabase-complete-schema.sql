-- =====================================================
-- MURRANNO MUSIC - COMPLETE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'artist' CHECK (user_type IN ('artist', 'label', 'agency', 'admin')),
  bio TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('artist', 'label', 'agency', 'admin')),
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tier)
);

-- =====================================================
-- ARTISTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  cover_image_url TEXT,
  genres TEXT[],
  social_links JSONB DEFAULT '{}',
  spotify_id TEXT,
  apple_music_id TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RELEASES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  release_type TEXT NOT NULL CHECK (release_type IN ('Single', 'EP', 'Album', 'Compilation')),
  release_date DATE,
  cover_art_url TEXT,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Live', 'Rejected', 'Takedown')),
  genre TEXT,
  language TEXT,
  label TEXT,
  copyright TEXT,
  upc_ean TEXT,
  smartlink TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TRACKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  track_number INTEGER NOT NULL,
  audio_file_url TEXT,
  isrc TEXT,
  lyrics TEXT,
  explicit BOOLEAN DEFAULT false,
  preview_start INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STREAMING DATA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS streaming_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  country TEXT,
  streams INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EARNINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  release_id UUID REFERENCES releases(id),
  track_id UUID REFERENCES tracks(id),
  source TEXT NOT NULL,
  platform TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  period_start DATE,
  period_end DATE,
  payout_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WALLET BALANCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wallet_balance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  available_balance DECIMAL(12, 2) DEFAULT 0,
  pending_balance DECIMAL(12, 2) DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'NGN',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WALLET TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal', 'refund')),
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  reference TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAYOUT METHODS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payout_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'bank' CHECK (type IN ('bank', 'mobile_money', 'paypal')),
  bank_code TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  recipient_code TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id),
  release_id UUID REFERENCES releases(id),
  name TEXT NOT NULL,
  type TEXT,
  platform TEXT,
  promotion_type TEXT DEFAULT 'bundle' CHECK (promotion_type IN ('bundle', 'custom')),
  bundle_id UUID,
  category TEXT,
  budget DECIMAL(12, 2) DEFAULT 0,
  spent DECIMAL(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Payment', 'Active', 'Paused', 'Completed', 'Cancelled')),
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  payment_amount DECIMAL(12, 2),
  start_date DATE,
  end_date DATE,
  target_audience JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROMOTION BUNDLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS promotion_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  category TEXT,
  services TEXT[],
  features TEXT[],
  delivery_days INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROMOTION SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS promotion_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  category TEXT,
  delivery_time TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CAMPAIGN SERVICES (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS campaign_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  service_id UUID REFERENCES promotion_services(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATION PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PUSH NOTIFICATION TOKENS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS push_notification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  paystack_subscription_code TEXT,
  paystack_email_token TEXT,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBSCRIPTION PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  interval TEXT DEFAULT 'monthly' CHECK (interval IN ('monthly', 'yearly')),
  features TEXT[],
  paystack_plan_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LABEL ARTISTS (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS label_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'removed')),
  contract_start DATE,
  contract_end DATE,
  revenue_share DECIMAL(5, 2) DEFAULT 50.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(label_id, artist_id)
);

-- =====================================================
-- AGENCY CLIENTS (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS agency_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, client_id)
);

-- =====================================================
-- INVITATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('label_artist', 'agency_client')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  token TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLATFORM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE label_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_clients ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles are created on signup" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Artists policies
CREATE POLICY "Users can view own artists" ON artists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create artists" ON artists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own artists" ON artists FOR UPDATE USING (auth.uid() = user_id);

-- Releases policies
CREATE POLICY "Users can view own releases" ON releases FOR SELECT USING (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create releases" ON releases FOR INSERT WITH CHECK (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own releases" ON releases FOR UPDATE USING (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete own releases" ON releases FOR DELETE USING (
  artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
);

-- Tracks policies
CREATE POLICY "Users can view own tracks" ON tracks FOR SELECT USING (
  release_id IN (SELECT id FROM releases WHERE artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can manage own tracks" ON tracks FOR ALL USING (
  release_id IN (SELECT id FROM releases WHERE artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()))
);

-- Wallet policies
CREATE POLICY "Users can view own wallet" ON wallet_balance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON wallet_transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION has_admin_role(_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND tier = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'artist')
  );
  
  INSERT INTO user_roles (user_id, tier)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'user_type', 'artist'));
  
  INSERT INTO wallet_balance (user_id)
  VALUES (NEW.id);
  
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, interval, features, is_active) VALUES
('Free', 0, 'monthly', ARRAY['1 release per month', 'Basic analytics', 'Standard support'], true),
('Pro', 4999, 'monthly', ARRAY['Unlimited releases', 'Advanced analytics', 'Priority support', 'Playlist pitching'], true),
('Premium', 14999, 'monthly', ARRAY['Everything in Pro', 'Dedicated account manager', 'Custom reporting', 'Early payouts'], true)
ON CONFLICT DO NOTHING;

-- Insert default promotion bundles
INSERT INTO promotion_bundles (name, description, price, category, services, features, delivery_days) VALUES
('Starter Pack', 'Perfect for new artists', 9999, 'starter', ARRAY['Social media promotion', 'Blog coverage'], ARRAY['1000+ reach', 'Basic targeting'], 7),
('Growth Pack', 'Boost your visibility', 24999, 'growth', ARRAY['Playlist pitching', 'Social media campaign', 'Blog features'], ARRAY['5000+ reach', 'Advanced targeting'], 14),
('Pro Pack', 'Maximum exposure', 49999, 'pro', ARRAY['Premium playlists', 'Influencer campaign', 'PR coverage', 'Radio promotion'], ARRAY['20000+ reach', 'Premium targeting', 'Dedicated manager'], 21)
ON CONFLICT DO NOTHING;

-- Insert default promotion services
INSERT INTO promotion_services (name, description, price, category, delivery_time) VALUES
('Spotify Playlist Pitching', 'Get your track on curated playlists', 4999, 'playlists', '7-14 days'),
('Social Media Promotion', 'Instagram & TikTok campaign', 7999, 'social', '3-5 days'),
('Blog Coverage', 'Feature on music blogs', 3999, 'press', '5-7 days'),
('Radio Promotion', 'Get airplay on FM stations', 14999, 'radio', '14-21 days'),
('Influencer Campaign', 'Collaboration with music influencers', 19999, 'influencer', '7-14 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_releases_artist_id ON releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_tracks_release_id ON tracks(release_id);
CREATE INDEX IF NOT EXISTS idx_streaming_data_track_id ON streaming_data(track_id);
CREATE INDEX IF NOT EXISTS idx_streaming_data_date ON streaming_data(date);
CREATE INDEX IF NOT EXISTS idx_earnings_artist_id ON earnings(artist_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Database schema created successfully!' as status;
