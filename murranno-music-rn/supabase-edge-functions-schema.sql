-- ============================================
-- MURRANNO MUSIC - SUPPLEMENTARY DATABASE SCHEMA
-- Additional tables required by Supabase Edge Functions
-- Run this AFTER the main supabase-schema.sql
-- ============================================

-- ============================================
-- PROMOTION SERVICES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.promotion_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('social_media', 'playlist', 'press', 'radio', 'influencer', 'video')),
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  delivery_time TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROMOTION BUNDLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.promotion_bundles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'NGN',
  tier_level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUNDLE SERVICES (Junction Table)
-- ============================================

CREATE TABLE IF NOT EXISTS public.bundle_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bundle_id UUID REFERENCES public.promotion_bundles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.promotion_services(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bundle_id, service_id)
);

-- ============================================
-- CAMPAIGN SERVICES (Services selected for a campaign)
-- ============================================

CREATE TABLE IF NOT EXISTS public.campaign_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.promotion_services(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGN METRICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.campaign_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(12, 2) DEFAULT 0,
  platform TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date, metric_type, platform)
);

-- ============================================
-- PAYOUT METHODS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.payout_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'mobile_money', 'paypal', 'crypto')),
  bank_code TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  recipient_code TEXT, -- Paystack recipient code
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WITHDRAWAL TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.withdrawal_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  payout_method_id UUID REFERENCES public.payout_methods(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  fee DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reversed')),
  reference TEXT UNIQUE,
  transfer_code TEXT,
  failure_reason TEXT,
  processed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WALLET BALANCE TABLE (Simplified wallet view)
-- ============================================

CREATE TABLE IF NOT EXISTS public.wallet_balance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  available_balance DECIMAL(12, 2) DEFAULT 0,
  pending_balance DECIMAL(12, 2) DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  total_withdrawn DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'NGN',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STREAMING DATA TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.streaming_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  country TEXT,
  date DATE NOT NULL,
  streams INTEGER DEFAULT 0,
  revenue DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track_id, platform, country, date)
);

-- ============================================
-- PUSH NOTIFICATION TOKENS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.push_notification_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
  device_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- ============================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  email_releases BOOLEAN DEFAULT true,
  email_earnings BOOLEAN DEFAULT true,
  email_campaigns BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  push_releases BOOLEAN DEFAULT true,
  push_earnings BOOLEAN DEFAULT true,
  push_campaigns BOOLEAN DEFAULT true,
  push_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN AUDIT LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLATFORM SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER ROLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'artist', 'label', 'agency', 'admin', 'super_admin')),
  permissions JSONB DEFAULT '[]',
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADDITIONAL INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_promotion_services_category ON public.promotion_services(category);
CREATE INDEX IF NOT EXISTS idx_promotion_services_active ON public.promotion_services(is_active);
CREATE INDEX IF NOT EXISTS idx_promotion_bundles_active ON public.promotion_bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_campaign_services_campaign ON public.campaign_services(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign ON public.campaign_metrics(campaign_id, date);
CREATE INDEX IF NOT EXISTS idx_payout_methods_user ON public.payout_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_transactions_user ON public.withdrawal_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_transactions_status ON public.withdrawal_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_balance_user ON public.wallet_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_streaming_data_release ON public.streaming_data(release_id, date);
CREATE INDEX IF NOT EXISTS idx_streaming_data_artist ON public.streaming_data(artist_id, date);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON public.push_notification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin ON public.admin_audit_logs(admin_id, created_at);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.promotion_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Public read for active services and bundles
CREATE POLICY "Anyone can view active services"
  ON public.promotion_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active bundles"
  ON public.promotion_bundles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view bundle services"
  ON public.bundle_services FOR SELECT
  USING (true);

-- Users can view their own payout methods
CREATE POLICY "Users can view own payout methods"
  ON public.payout_methods FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own payout methods"
  ON public.payout_methods FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own payout methods"
  ON public.payout_methods FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own payout methods"
  ON public.payout_methods FOR DELETE
  USING (user_id = auth.uid());

-- Users can view their own withdrawals
CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawal_transactions FOR SELECT
  USING (user_id = auth.uid());

-- Users can view their own wallet balance
CREATE POLICY "Users can view own wallet balance"
  ON public.wallet_balance FOR SELECT
  USING (user_id = auth.uid());

-- Users can view their own push tokens
CREATE POLICY "Users can manage own push tokens"
  ON public.push_notification_tokens FOR ALL
  USING (user_id = auth.uid());

-- Users can manage their notification preferences
CREATE POLICY "Users can manage own notification preferences"
  ON public.notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Platform settings - public ones visible to all
CREATE POLICY "Anyone can view public settings"
  ON public.platform_settings FOR SELECT
  USING (is_public = true);

-- Campaign services - owners can view
CREATE POLICY "Users can view own campaign services"
  ON public.campaign_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_services.campaign_id
      AND c.creator_id = auth.uid()
    )
  );

-- Campaign metrics - owners can view
CREATE POLICY "Users can view own campaign metrics"
  ON public.campaign_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_metrics.campaign_id
      AND c.creator_id = auth.uid()
    )
  );

-- Streaming data - artists can view their own
CREATE POLICY "Artists can view own streaming data"
  ON public.streaming_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists a
      WHERE a.id = streaming_data.artist_id
      AND a.profile_id = auth.uid()
    )
  );

-- ============================================
-- UPDATE TRIGGERS
-- ============================================

CREATE TRIGGER update_promotion_services_updated_at BEFORE UPDATE ON public.promotion_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_bundles_updated_at BEFORE UPDATE ON public.promotion_bundles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_services_updated_at BEFORE UPDATE ON public.campaign_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_methods_updated_at BEFORE UPDATE ON public.payout_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_transactions_updated_at BEFORE UPDATE ON public.withdrawal_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPFUL FUNCTIONS
-- ============================================

-- Function to create wallet balance record on profile creation
CREATE OR REPLACE FUNCTION public.create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallet_balance (user_id, available_balance, pending_balance, total_earnings, currency)
  VALUES (NEW.id, 0, 0, 0, 'NGN');
  
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create wallet and notification preferences
DROP TRIGGER IF EXISTS on_profile_created_create_wallet ON public.profiles;
CREATE TRIGGER on_profile_created_create_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_wallet_for_new_user();

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION public.add_to_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL,
  p_is_pending BOOLEAN DEFAULT false
)
RETURNS void AS $$
BEGIN
  IF p_is_pending THEN
    UPDATE public.wallet_balance
    SET pending_balance = pending_balance + p_amount,
        total_earnings = total_earnings + p_amount,
        last_updated = NOW()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public.wallet_balance
    SET available_balance = available_balance + p_amount,
        total_earnings = total_earnings + p_amount,
        last_updated = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process withdrawal
CREATE OR REPLACE FUNCTION public.process_withdrawal(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  SELECT available_balance INTO current_balance
  FROM public.wallet_balance
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF current_balance >= p_amount THEN
    UPDATE public.wallet_balance
    SET available_balance = available_balance - p_amount,
        total_withdrawn = total_withdrawn + p_amount,
        last_updated = NOW()
    WHERE user_id = p_user_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA FOR PROMOTION SERVICES
-- ============================================

INSERT INTO public.promotion_services (name, description, category, price, delivery_time, features, sort_order) VALUES
  ('Spotify Playlist Pitching', 'Get your music pitched to curated Spotify playlists', 'playlist', 15000, '7-14 days', '["10+ playlist submissions", "Curator feedback", "Performance report"]', 1),
  ('Apple Music Playlist Placement', 'Feature placement on Apple Music playlists', 'playlist', 20000, '7-14 days', '["Premium playlist targeting", "Genre-specific placement"]', 2),
  ('Instagram Promotion', 'Targeted Instagram ads and influencer promotion', 'social_media', 25000, '5-7 days', '["Story promotion", "Feed posts", "Reel features"]', 3),
  ('TikTok Promotion', 'Viral TikTok campaign with influencers', 'social_media', 30000, '5-10 days', '["Sound promotion", "Influencer challenges", "Hashtag trending"]', 4),
  ('Music Blog Features', 'Get featured on popular music blogs', 'press', 20000, '14-21 days', '["5+ blog features", "SEO optimized", "Social shares"]', 5),
  ('Radio Plugging', 'Get your music on radio stations', 'radio', 50000, '14-30 days', '["National radio stations", "Interview opportunities", "Airplay reports"]', 6),
  ('YouTube Music Video Promotion', 'Promote your music video on YouTube', 'video', 35000, '7-14 days', '["YouTube ads", "Suggested video placement", "Subscriber growth"]', 7),
  ('Influencer Campaign', 'Collaborate with music influencers', 'influencer', 40000, '7-14 days', '["5+ influencer posts", "Story takeovers", "Engagement boost"]', 8)
ON CONFLICT DO NOTHING;

-- Sample promotion bundles
INSERT INTO public.promotion_bundles (name, description, price, original_price, tier_level, features, is_featured) VALUES
  ('Starter Pack', 'Perfect for new artists starting their journey', 35000, 45000, 1, '["2 playlist submissions", "Basic social media promotion", "Performance report"]', false),
  ('Growth Pack', 'For artists ready to expand their reach', 75000, 95000, 2, '["5 playlist submissions", "Social media ads", "Blog features", "Monthly analytics"]', true),
  ('Pro Pack', 'Complete promotional package for serious artists', 150000, 200000, 3, '["Unlimited playlist pitching", "Full social campaign", "Radio plugging", "Press releases", "Dedicated manager"]', false),
  ('Label Pack', 'Enterprise solution for labels and agencies', 300000, 400000, 4, '["All Pro features", "Multiple artist support", "Custom campaigns", "Priority support", "API access"]', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Run this script AFTER the main supabase-schema.sql
-- This adds all tables required by Edge Functions
