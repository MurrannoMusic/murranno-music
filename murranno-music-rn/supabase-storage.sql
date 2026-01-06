-- ============================================
-- MURRANNO MUSIC - STORAGE BUCKETS SETUP
-- Create and configure Supabase Storage
-- ============================================

-- Run these commands in Supabase Dashboard -> Storage

-- ============================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================

-- Bucket for profile avatars
-- In Supabase Dashboard: Storage -> Create bucket
-- Name: avatars
-- Public: true

-- Bucket for release covers
-- Name: covers
-- Public: true

-- Bucket for audio files
-- Name: audio
-- Public: false (requires authentication)

-- Bucket for documents
-- Name: documents
-- Public: false

-- ============================================
-- 2. STORAGE POLICIES (RLS)
-- ============================================

-- After creating buckets, run these SQL commands:

-- AVATARS BUCKET POLICIES
-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view avatars (public)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- ============================================
-- COVERS BUCKET POLICIES
-- ============================================

-- Artists can upload release covers
CREATE POLICY "Artists can upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND
  EXISTS (
    SELECT 1 FROM public.artists
    WHERE artists.profile_id = auth.uid()
  )
);

-- Artists can update their covers
CREATE POLICY "Artists can update covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'covers' AND
  EXISTS (
    SELECT 1 FROM public.artists
    WHERE artists.profile_id = auth.uid()
  )
);

-- Anyone can view covers (public)
CREATE POLICY "Anyone can view covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');

-- ============================================
-- AUDIO BUCKET POLICIES
-- ============================================

-- Artists can upload audio files
CREATE POLICY "Artists can upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio' AND
  EXISTS (
    SELECT 1 FROM public.artists
    WHERE artists.profile_id = auth.uid()
  )
);

-- Artists can update their audio files
CREATE POLICY "Artists can update audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio' AND
  EXISTS (
    SELECT 1 FROM public.artists
    WHERE artists.profile_id = auth.uid()
  )
);

-- Only authenticated users can view audio (preview/download)
CREATE POLICY "Authenticated users can view audio"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio');

-- ============================================
-- DOCUMENTS BUCKET POLICIES
-- ============================================

-- Users can upload their own documents
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- HELPER FUNCTIONS FOR STORAGE
-- ============================================

-- Function to generate signed URL for private files
CREATE OR REPLACE FUNCTION public.get_audio_url(file_path TEXT)
RETURNS TEXT AS $$
DECLARE
  signed_url TEXT;
BEGIN
  SELECT storage.create_signed_url('audio', file_path, 3600) INTO signed_url;
  RETURN signed_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete old avatar when uploading new one
CREATE OR REPLACE FUNCTION public.delete_old_avatar()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL AND OLD.avatar_url != NEW.avatar_url THEN
    -- Extract path from URL and delete
    PERFORM storage.delete_object('avatars', OLD.avatar_url);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER delete_old_avatar_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
  EXECUTE FUNCTION public.delete_old_avatar();

-- ============================================
-- STORAGE FOLDER STRUCTURE
-- ============================================

-- Recommended folder structure:
-- 
-- avatars/
--   └── {user_id}/
--       └── avatar.jpg
-- 
-- covers/
--   └── {artist_id}/
--       └── {release_id}/
--           └── cover.jpg
-- 
-- audio/
--   └── {artist_id}/
--       └── {release_id}/
--           └── {track_id}.mp3
-- 
-- documents/
--   └── {user_id}/
--       └── contracts/
--       └── invoices/
--       └── reports/

-- ============================================
-- SETUP COMPLETE
-- ============================================
